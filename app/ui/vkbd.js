define([
	'tpl/vkbs',
	'text!css/vkbd.css',
	'loader/loader',
	'dom/dom',
	'dom/classes',
	'shims/bind',
	'data/i18l',
	'array/array'
], function(template, css, loader, dom, classes, bind, i18l, array) {
	//Most definetely move the loader loads in the main logic
	loader.loadCSSFromText(css);

	var KBD = function() {
		this.layouts = [];
		this.currentLayoutIndex = 0;
		this.shiftMutators = [];
//		this.shiftKeyPressedState = false 
		this.boundElement = null;
		this.value = '';
		this.container = null;
		this.layouts.push(this.defaultLayout);
		this.customKeyPressHandlers = [];
	};
	
	KBD.prototype.shiftKeyPressedState = false;	
	/**
	* Sets the element to use as input field, can be input, text area, div or span, innerHTML might be used
	* @param {HTMLElement} htmlElement The html to use as input
	*/
	KBD.prototype.inputIsMasked = false;
	KBD.prototype.bindToElement = function(htmlElement, masked) {
		if (masked) this.inputIsMasked = true;
		else delete this.inputIsMasked;
		this.boundElement = htmlElement;
		this.value = this.boundElement.textContent;
	};	

	/**
	* the default layout - US_EN
	*/
	KBD.prototype.defaultLayout = [
		["`","1","2","3","4","5","6","7","8","9",'0','Delete'],
		["q","w","e","r","t","y","u","i","o","p",'[',']','/'],
		["a","s","d","f","g","h","j","k","l",';','"',"Return"],
		['Shift',"z","x","c","v","b","n","m",",",".",'+','-'],
		['Lang:En',' ','www.','.com']
	];
	/**
	* Function to execute when the Mutator key is activated (i.e. pressing OK remote buton on Shift key on vkbd)
	* It will try and find mutated value for the value of all nodes of the kbd
	* First attempt will be the JS way - to Upper / Lower case
	* If this does not mutate the value the custom mutators will be attempted
	*/
	KBD.prototype.shiftMutate = function() {
		var i, old_key_value, keys_list = dom.$$('li', dom.$('.tui-keyboard')),
			case_to_use = (this.shiftKeyPressedState)?'toLowerCase':'toUpperCase',
			len = keys_list.length, celement, new_key_value;
		for (i = 0; i < len; i++) {
			celement = keys_list[i].childNodes[0];
			old_key_value = celement.nodeValue;
			if (celement.nodeValue.length === 1) {
				new_key_value = old_key_value[case_to_use]();
				if (old_key_value !== new_key_value) {
					celement.nodeValue = new_key_value;
					continue;
				}
			}	
			celement.nodeValue = this.iterateOverMutators(old_key_value);
		}
		this.shiftKeyPressedState = !this.shiftKeyPressedState;
	};
	
	/**
	* Iterate over list of asigned mutator functions, that return object of result and result character
	* if the result is found the cycle is discontinued, so order your mutator functions by occurance rate for speed considerations
	* @param {String} value The string that we will try to find mutator for
	* @return {String} The string that we found as mutator result or the original string
	*/
	KBD.prototype.iterateOverMutators = function(value) {
		var i, res;
		/** First try the default mutator, should cover the US_EN kbd */
		res = this.defaultShiftMutator(value);
		if (res.found === true) {
			return res.c;
		}
		for (i = 0; i < this.shiftMutators.length; i++){
			if (typeof this.shiftMutators[i]=== 'function'){
				res = this.shiftMutators[i](value);
				if (res.found === true)	 return res.c;
			}
		}
		return value;
	};
	/**
	* select next layout to use and call rasterize
	*/
	KBD.prototype.selectNextLayout = function() {
		this.currentLayoutIndex++;
		if (this.currentLayoutIndex >= this.layouts.length) {
			this.currentLayoutIndex = 0;
		}
		this.shiftKeyPressedState = false;
		this.rasterizeLayout(true);
	};
	/**
	* Rasterize a layout to html form, optionally set the active key to the lang key
	* @param {Boolean} bool If true, select the language change key (i.e. the default changer, might not be the case in custom layout!), else the selected key will be the first one (top/left)
	*/
	KBD.prototype.rasterizeLayout = function(bool) {
		var uls, toActivate, row;
		this.dom_ = template.render({
			kbdlayout: this.layouts[this.currentLayoutIndex]
		});
		this.container.innerHTML = this.dom_;
		uls = dom.$$('.kbdrow',this.container);
		row = (bool)?uls[uls.length -1]:uls[0];
		toActivate = dom.$('li', row);
		this.setActiveKey(toActivate);
	};
	KBD.prototype.activeItemClass = 'activekey'
	KBD.prototype.activeItemSelector = '.';
	KBD.prototype.activeItemSelectorHelper = 'li';
	KBD.prototype.rowSelector = 'ul.kbdrow';
	/**
	* Returns the current active key from the virtual kbd
	*/
	KBD.prototype.getActiveKey = function() {
		return dom.$(this.activeItemSelectorHelper + this.activeItemSelector + this.activeItemClass, this.container);	
	};
	/**
	* Sets the active key to one key on the kbd, disabling the current active key if there is one
	* @param {HTMLElement} key The html element to set as active
	*/
	KBD.prototype.setActiveKey = function(key, oldKey) {
		var old = oldKey || this.getActiveKey();
		if (old !== null ) {
			classes.removeClasses(old, this.activeItemClass);
		}
		classes.addClasses(key, this.activeItemClass);
	};
	/**
	* Function that handles the value of the key that is selected when the "OK" button is pressed on the remote
	* @param {String} value The value of the key as visualized
	*/
	KBD.prototype.defaultVirtualKeyHandler = function(value) {
		if (/Lang:/.test(value)){
			this.selectNextLayout();
			return;
		}
		switch (value) {
			case '⌫':
			case 'Delete':
			case 'Del':
			case 'delete':
			case 'del':
				console.log('delete key selected');
				this.deleteCharacter();
				break;
			case 'Return':
			case 'Enter':
				console.log('Return key selected, here we should submit probably');
				if (typeof this.submitCallback === 'function') {
					this.submitCallback(this.value);
				}
				break;
			case '⎇':
			case 'Shift':
				this.shiftMutate();
				break;
			default:
				console.log('Key was ', value);
				this.addCharacter(value);
		}		
	};
	KBD.prototype.addCharacter = function(val) {
		this.value = this.value + val;
		this.updateElement();
	};
	KBD.prototype.deleteCharacter = function() {
		this.value = this.value.substr(0,this.value.length-1);
		this.updateElement();
	};
	KBD.prototype.updateElement = function() {
		if (this.inputIsMasked) {
			this.boundElement.textContent = new Array(this.value.length+1).join('*');
		} else {
			this.boundElement.textContent = this.value;
		}
	}
	/**
	* Display the keyboard in container
	*/
	KBD.prototype.show = function(container, callback, opt_multiline) {
		if (!container) return;
		this.container = container;
		this.submitCallback = callback;
		this.isMultiline = opt_multiline || false;
		this.rasterizeLayout();
	};
	/**
	* Returns bound function to use in global handlers
	*/
	KBD.prototype.getEventHandler = function() {
		return bind(this.eventHandler, this);
	};
	/**
	* Remote handlers - handle strings from remote
	*/
	KBD.prototype.eventHandler = function(key) {
		var i, position_in_row, row_number, tmp, destination_row, new_active, t1, plen;
		var active_li = this.getActiveKey();
		var parentnode;
		if (key === 'ok') {
			this.keyPress(active_li.childNodes[0].nodeValue);
		} else {
			tmp = dom.$$(this.rowSelector, this.container );
			for ( i = 0 ; i < tmp.length; i++){
				if (active_li.parentNode === tmp[i]){
					row_number = i;
					parentnode = tmp[i];
					break;
				}
			}
			plen = parentnode.children.length;
			for (i = 0 ; i < plen; i++){
				if (active_li === parentnode.children[i]) {
					position_in_row = i;
					break;
				}
			}
			switch (key) {
				case 'left':
					if (position_in_row === 0) {
						new_active = parentnode.lastElementChild;
					}
					else {
						new_active = active_li.previousElementSibling;
					}
					break;
				case 'right':
					if (position_in_row === plen-1){
						new_active = parentnode.firstElementChild;
					}
					else {
						new_active = active_li.nextElementSibling
					}
					break;
				case 'up':
				case 'down':					
					if (key === 'up'){
						if (row_number === 0){
							destination_row = tmp[tmp.length-1];
						}
						else {
							destination_row = tmp[row_number - 1];
						}
					} else {
						if (row_number >= tmp.length-1){
							destination_row = tmp[0];
						}
						else {
							destination_row = tmp[row_number + 1];
						}
					}
					t1 = dom.$$(this.activeItemSelectorHelper, destination_row);	
					if (position_in_row > t1.length-1) {
						new_active = t1[t1.length-1];
					}
					else {
						new_active = t1[position_in_row];
					}
					break;
			}
			if (new_active)	this.setActiveKey(new_active, active_li);
		}
	};
	/**
	* Iterate over the key handlers, custom key handlers should return 'true' if they have handled the key press
	* or false if they have not
	* @param {String} key The key that has been activated (i.e. the innerHTML of a virtual key)
	*/
	KBD.prototype.keyPress = function(key) {
		console.log(key)
		var i, result;
		if (this.customKeyPressHandlers.length > 0 ) {
			for ( i = 0; i< this.customKeyPressHandlers.length; i++ ) {
				if(this.customKeyPressHandlers[i](key)) return;
			}
		}
		this.defaultVirtualKeyHandler(key);
	};
	/**
	* The default mutator function used to mutate the US_EN keyboard
	* @param {String} ch The value that we will try and find mutating option for
	*/
	KBD.prototype.defaultShiftMutator = function(ch) {
		switch (ch) {
			case '⎇': return {found: true, c: '⎇'};
			case '⌫': return {found: true, c: '⌫'};
			case '1': return {found: true, c: '!'};
			case '!': return {found: true, c: '1'};
			case '2': return {found: true, c: '@'};
			case '@': return {found: true, c: '2'};
			case '3': return {found: true, c: '#'};
			case '#':  return {found: true, c: '3'};
			case '4':  return {found: true, c: '$'};
			case '$': return {found: true, c: '4'};
			case '5': return {found: true, c: '%'};
			case '%': return {found: true, c: '5'};
			case '6': return {found: true, c: '^'};
			case '^': return {found: true, c: '6'};
			case '7': return {found: true, c: '&'};
			case '&': return {found: true, c: '7'};
			case '8': return {found: true, c: '*'};
			case '*': return {found: true, c: '8'};
			case '9': return {found: true, c: '('};
			case '(': return {found: true, c: '9'};
			case '0': return {found: true, c: ')'};
			case ')': return {found: true, c: '0'};
			case '-': return {found: true, c: '_'};
			case '_': return {found: true, c: '-'};
		    case '=': return {found: true, c: '+'};
			case '+': return {found: true, c: '='};
		    case "'": return {found: true, c: '"'};
		    case '"': return {found: true, c: "'"};
		    case '[': return {found: true, c: '{'};
		    case ']': return {found: true, c: '}'};
		    case '{': return {found: true, c: '['};
		    case '}': return {found: true, c: ']'};
 		    case '.': return {found: true, c: '>'};
		    case ',': return {found: true, c: '<'};
		    case '>': return {found: true, c: '.'};
		    case '<': return {found: true, c: ','};
		    case ';': return {found: true, c: ':'};
		    case ':': return {found: true, c: ';'};
		    case '/': return {found: true, c: '|'};
		    case '|': return {found: true, c: '/'};  
		    case '`': return {found: true, c: '~'};
		    case '~': return {found: true, c: '`'};
			default: return {found: false, c: ch}
		}
	};
	/**
	* Adds a layout to be supoprted in the kbd
	* @param {String|Array} layout Array that is a layout or layout name that is defined in i18l
	*/
	KBD.prototype.addCustomLayout = function(layout) {
		if (typeof layout === 'string' && typeof i18l[layout] === 'object') {
			this.layouts.push(i18l[layout]);
		} else if (typeof layout === 'object') {
			this.layouts.push(layout);
		}
	};
	/**
	* Removes a layout from the list of supported ones
	* @param {String|Array} layout Array that is a layout or layout name that is defined in i18l
	*/
	KBD.prototype.removeCustomLayout = function(layout) {
		if (typeof layout === 'object')
			array.remove(this.layout, layout)
		else if ( typeof layout === 'string' && typeof i18l[layout] === 'object' )
			array.remove(this.layouts, i18l[layout]);
	};
	KBD.knownKeys_ = ['ok', 'up', 'down', 'left', 'right'];
	KBD.instance_ = null;
	KBD.getInstance = function() {
		if (KBD.instance_ === null)  {
			KBD.instance_ = new KBD();
			KBD.instance_.addCustomLayout('bg_bg');
			KBD.instance_.addCustomLayout('il_il');
		}
		return KBD.instance_;
	};
	return KBD;
});
