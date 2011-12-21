define([
	'oop/inherit',
	'utils/telescreen',
	'dom/dom',
	'data/static-strings',
	'dom/classes',
	'utils/scrollable',
	'transport/request',
	'transport/response',
	'shims/bind',
	'json/json'
], function(inherit, TScreen, dom, strings, classes, Scrollable, request, response, bind, json ) {
	/**
	 * Subset of the TeleMini screen that handles the specifities of the config panel
	 *
	 * @constructor
	 * @param {Object}
	 */
	var NS = function(options) {
		TScreen.call(this, options);
		this.currentItem = 0;
		this.scroller_ = null;
		this.on('activated', this.onActivate);
		this.selectedIndex = null;
		this.listIsActive = false;
		this.activeListNode = null;
		this.updates_ = {};
	};

	inherit(NS, TScreen);
	/**
	 * Describe the default classes for selectors
	 * @type {String}
	 */
	NS.prototype.activeDataCssSelector = '.general-item.active';
	NS.prototype.isDirty_ = false;
	NS.prototype.dataCssSelector = '.general-item';
	NS.prototype.updateRun = 'update_section_json';
	NS.prototype.activeDataCss = 'active';
	/**
	 * Gets the data without copying it in the object should updates need tp be performed from outside
	 * @return {Object}
	 */
	NS.prototype.getData = function() {
		return this.master.getData(this.name);
	};
	/**
	 * Implement key handler as per miniscreen specs
	 * @param {String} key The key pressed on the remote
	 */
	NS.prototype.keyHandler = function(key) {
		console.log('received key for handling in miniscreen: ' + key);
		switch (key) {
		case 'up':
			if (this.listIsActive) {
				this.selectInList(false);
			} else this.selectItem(this.selectedIndex-1);
			break;
		case 'down':
			if (this.listIsActive) {
				this.selectInList(true);
			} else this.selectItem(this.selectedIndex+1);
			break;
		case 'ok':
			if (!this.listIsActive) {
				this.activateItem();
			} else {
				this.activateItemInList();
			}
			break;
		case 'return':
			if (this.listIsActive) {
				this.deactivateItem();
			} else {
				if (this.isDirty_) {
					tui.createDialog('confirm', undefined, bind(this.handleUpdateDataOnServer, this), strings.components.dialogs.confirmApply);
				} else {
					this.master.activateScreen(0);
				}
			}
			break;
		default:
			break;
		}
	};
	/**
	 * Called when the user presses return in a mini screen and there are item updated.
	 * If th user confirms the action those will be saved on server,
	 * if not - the data will be re-get
	 *
	 * @param {number} confirmation 0 is the user canceled, 1 is user wants to submit
	 * @private
	 */
	NS.prototype.handleUpdateDataOnServer = function(confirmation) {
		if (confirmation === 1 ) {
			this.updates_['run'] = this.updateRun;
			this.updates_['newif'] = 1;
			this.updates_['section']=this.name;
			var req = request.create('calld', this.updates_);
			response.register(req, bind(this.handleSettingsUpdate, this));
			req.send();
		} else {
			delete this.isDirty_;
			this.updates_ = null;
			this.updates_ = {};
			this.master.reload();
		} 
	};
	/**
	 * Function to handle the update reply from calld
	 *
	 * @param {JSONObject} response The server response (Response['response'])
	 */
	NS.prototype.handleSettingsUpdate = function(response) {
		if (response['status'] === 'OK') {
			var res = json.parse(response['content']);
			if (res['status'].toLowerCase() !== 'ok') {
				tui.createDialog('message', undefined, undefined, strings.components.dialogs.updateFailed + res['message']);
			} else {
				delete this.isDirty_;
				this.updates_ = null;
				this.updates_ = [];
			}
		}
	};
	/**
	 * Override of the TeleScreen implementation as we have special meaning for the retunr key here
	 */
	NS.prototype.remoteKeyHandler = NS.prototype.keyHandler;
	/**
	 * Deactivates listing item - i.e. hide it and activate its holder
	 * @protected
	 */
	NS.prototype.deactivateItem = function() {
		var deactivateInnerItem = dom.$('.row.'+ this.activeDataCss, this.activeListNode);
		classes.removeClasses(deactivateInnerItem,this.activeDataCss);
		classes.removeClasses(this.activeListNode, this.activeDataCss);
		this.activeListNode = null;
		this.listIsActive = false;
		var nodes = this.getDataNodes();
		classes.addClasses(nodes[this.selectedIndex], this.activeDataCss);
	};
	/**
	 * Gets the DOMNodes that have data meaning
	 */
	NS.prototype.getDataNodes = function() {
		return dom.$$(this.dataCssSelector, this.dom_);
	};
	/**
	 * Travers the list options
	 * @param {boolean} bool true for 'down', false for 'up' directions
	 */
	NS.prototype.selectInList = function(bool) {
		var node = dom.$('.'+this.activeDataCss, this.activeListNode);
		var next;
		if (bool) {
			next = node.nextElementSibling;
		} else {
			next = node.previousElementSibling;
		}
		if (next !== null && classes.hasClass(next, 'row')) {
			classes.removeClasses(node, this.activeDataCss);
			classes.addClasses(next, this.activeDataCss);
			this.scroller_.scroll(next);
		}

	};
	/**
	 * Called when item in list options is activated, this is - the user wants to activate an option in the list
	 * The function will update the list of changes and will update visually the value, however
	 * it will also mark the data as 'dirty' and will prevent its lost.
	 */
	NS.prototype.activateItemInList = function() {
		var record = this.getData()[this.selectedIndex],
			record_name = record['name'],
			record_value = record['value'],
			new_value = dom.dataGet( dom.$('.' + this.activeDataCss, this.activeListNode), 'key');
		if ( new_value != record_value) {
			dom.$('.value', this.getDataNodes()[this.selectedIndex]).textContent = record['values'][new_value];
			this.isDirty_ = true;
			this.updates_[record_name] = new_value;
		}
		this.deactivateItem();
	};
	/**
	 * When on general list pressing OK should activate the item, handle it here
	 * This function handles all possible action types, if you extend the action, extend this function as well
	 * @protected
	 */
	NS.prototype.activateItem = function() {
		var data = this.getData();
		var index = this.selectedIndex;
		data = data[index];
		switch (data['type']) {
			case 'list':
				this.showListOptions();
				break;
			case 'static':
				//
				// tui.createDialog('message',undefined, undefined, 'Test test test');
				// 
				break;
			case 'action':
				if (data['action'] == 'confirm') {
					tui.createDialog('confirm', undefined, bind(this.performAction, this, data['exec']), data['actiontitle']);
				} else if (data['action'] == 'prompt') {
					if (data['prompttype']== 'text') {
						tui.createDialog('input', true, bind(this.setValueByText, this, data['name'], this.getDataNodes()[index]), data['help']);
					} else if( data['prompttype'] == 'ip' ) {
						tui.createDialog('ip', false, bind(this.setIpAddress, this), data['help']);
					}
				}
				break;
			case 'password':
				tui.createDialog('password', true, bind(this.setPassWord, this, data['name'],  0), strings.common.new_password);
				break;
			case 'string':
				tui.createDialog('input', true, bind(this.setValueByText, this, data['name'], this.getDataNodes()[index]), data['publishName']);
				break;
			default:
				break;

		}
	};
	/**
	 * Called when returning from type == action && action == prompt && prompttype == text 
	 * or when type == string
	 *
	 * This functions protects from empty values
	 * @param {string} dataName The name of the variable to record for update as received by the server in {name}
	 * @param {HTMLElement} node The Element that represents the data node
	 * @param {string} value The new value to be set
	 */
	NS.prototype.setValueByText = function(dataName, node, value) {
		console.log(arguments);
		if (value !== "") {
			this.isDirty_ = true;
			this.updates_[dataName] = value;
			dom.$('.value', node).textContent = value;
		}
	};
	/**
	 * Called when returning from type = 'password'. The functions is designed to be used with two step password resets
	 * This is = the first value is the old pass the second - the new one
	 *
	 * @param {string} dataName The name of the variable to update as received by the server
	 * @param {Number} index Integer representing the pass - 0 for old pass, 1 for new one
	 * @param {string} pass The password as typed by the user, empty values are discarted
	 */
	NS.prototype.setPassWord = function(dataName, index, pass) {
		if (pass !== '') {
			this.isDirty_ = true;
			this.updates_[dataName] = pass;
			if (index === 0) {
				tui.createDialog('password', true, bind(this.setPassWord, this, dataName + '2', 1), strings.common.old_password);
			}
		} else {
			if (index === 1) {
				delete this.updates_[dataName];
			}	
		}
	};
	/**
	 * This is called when returning from type == action && action == confirm, i.e. user is prompted and if confirmed 
	 * the exe command is submited for execution on backend
	 *
	 * @param {Object} exe The exec parameters for the backend as received by the server
	 * @param {Number} confirmed 0 for Cancel, 1 for Ok
	 */
	NS.prototype.performAction = function(exe, confirmed) { 
		console.log(arguments); 
		if (confirmed === 1) {
			var req = request.create('calld', exe);
			response.register(req, bind(this.handleExecError, this));
			req.send();
		}
	};
	/**
	 * Handle the error when calling exec, i.e. when the exe command cannot be executed
	 *
	 * @param {JSONObject} response The response of the error that we receive
	 */
	NS.prototype.handleExecError = function(response) {
		console.log(arguments);
	};
	/**
	 * Shows the list option of the currently active item, should be called only for items that are of type 'list'
	 */
	NS.prototype.showListOptions = function() {
		var domNode = dom.$(this.activeDataCssSelector, this.dom_);
		var list = domNode.nextElementSibling;
		classes.removeClasses(domNode, this.activeDataCss);
		classes.addClasses(list, this.activeDataCss);
		this.activeListNode = list;
		this.listIsActive = true;
		classes.addClasses(dom.$('.row', this.activeListNode), this.activeDataCss);
		this.scroller_.scroll(list);
		this.scroller_.scroll(dom.$('.row', this.activeListNode));
	};
	/**
	 * Called when the mini screen is displayed to user, for now just reset the list
	 *
	 */
	NS.prototype.onActivate = function() {
		console.log('On Activate fired');
		if (this.selectedIndex === null) {
			this.selectItem(0);
		} else this.selectItem(this.selectedIndex);
	};
	/**
	 * General list movement, this allows for selecting any item in the list
	 * @param {number} index The index of the item to select (i.e. put in selected state)
	 */
	NS.prototype.selectItem = function(index) {
		var data = this.getData();
		console.log(data);
		if (index >= data.length || index < 0) return;
		this.selectedIndex = index;
		var dataNodes = dom.$$(this.dataCssSelector, this.dom_);
		var currentNode = dom.$(this.activeDataCssSelector, this.dom_);
		if (currentNode !== null) classes.removeClasses(currentNode, this.activeDataCss);
		classes.addClasses(dataNodes[this.selectedIndex], this.activeDataCss);
		this.scroller_.scroll(dataNodes[this.selectedIndex]);

	};
	/**
	 * Override of the render function to support the specific case of settings listing
	 * @param {HTMLElement} renderIn The HTML node to use as render placeholder, everything will be put in there
	 */
	NS.prototype.render = function(renderIn) {
		var data = this.getData();
		console.log('im miniscreen json data is ', data);
		var mydom = dom.getInnerNodes(this.template_.render({
			items: this.master.getData(this.name),
			transl: strings.screens.setup.header,
			appname: this.name
		}));
		if (this.dom_ && this.dom_.parentNode) {
			this.dom_.parentNode.replaceChild(mydom, this.dom_);
		} else {
			dom.adopt(renderIn, mydom);
		}
		this.dom_= mydom;
		this.scroller_ = new Scrollable('.general-content.' + this.name, '.active');
	};
	//
	// Export the object in the define space
	// 
	return NS;
});
