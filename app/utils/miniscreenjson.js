define([
	'oop/inherit',
	'utils/telescreen',
	'dom/dom',
	'data/static-strings',
	'dom/classes',
	'utils/scrollable'
], function(inherit, TScreen, dom, strings, classes, Scrollable) {
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
	};

	inherit(NS, TScreen);
	/**
	 * Describe the default classes for selectors
	 * @type {String}
	 */
	NS.prototype.activeDataCssSelector = '.general-item.active';
	NS.prototype.dataCssSelector = '.general-item';
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
		console.log('received key for handling in miniscreen: ' + key)
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
			}
			break;
		case 'return':
			console.log('List is active ? ' + this.listIsActive);
			if (this.listIsActive) {
				this.deactivateItem();
			} else {
				this.master.activateScreen(0);
			}
			break;
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
			this.scroller_.scroll(next)
		}

	};
	/**
	 * When on general list pressing OK should activate the item, handle it here
	 * @protected
	 */
	NS.prototype.activateItem = function() {
		var data = this.getData();
		if (data[this.selectedIndex].type === 'list') {
			this.showListOptions();
		} else if (data[this.selectedIndex].type === 'static') {
			return;
		}
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
	};
	/**
	 * Called when the mini screen is displayed to user, for now just reset the list
	 *
	 */
	NS.prototype.onActivate = function() {
		if (this.selectedIndex === null) {
			this.selectItem(0);
		}
	};
	/**
	 * General list movement, this allows for selecting any item in the list
	 * @param {number} index The index of the item to select (i.e. put in selected state)
	 */
	NS.prototype.selectItem = function(index) {
		var data = this.getData();
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
		this.scroller_ = new Scrollable('.general-content', '.active');
	};
	//
	// Export the object in the define space
	// 
	return NS;
});
