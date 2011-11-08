define([
	'dom/dom',
	'tpl/popups',
	'oop/idisposable',
	'oop/inherit',
	'dom/classes',
	'text!css/multiselect.css',
	'loader/loader',
	'dom/attributes',
	'ui/vkbd',
	'array/array',
	'shims/bind'
], function (dom, tpl, Disposable, inherit, classes, css, loader, domattr, KBD, array, bind){
	loader.loadCSSFromText(css);
	
	var Popup = function(type, callback, title) {
		Disposable.call(this);
		this.type = type;
		this.callback = callback;
		this.title = title;
	};
	inherit(Popup, Disposable)
	
	Popup.prototype.useKbd = false;
	
	Popup.prototype.destroyer = function() { tui.signals.restoreEventTree();};
	
	Popup.prototype.show = function(container) {
		this.container = container || document.body;
		this.dom_ = dom.create('div', {
			classes: 'multi-select-wrapper',
			style: domattr.get(this.container, 'style').cssText
		});
		this.dom_.innerHTML = tpl.render({
			title: this.title,
			things: this.options || [],
			type: this.type,
			addKbdContainer: this.useKbd
		});
		this.dom_.style.top = '-' +window.innerHeight + 'px';
		dom.adopt(this.container, this.dom_);
	};
	
	Popup.prototype.destroy = function() {
		dom.dispose(this.dom_);
		this.destroyer();
	};
	
	Popup.prototype.eventHandler = function(key) {
		console.log('Received event', key);
	};
	
	Popup.prototype.disposeInternal = function() {
//		Disposable.prototype.disposeInternal.call(this);
		Popup.superClass_.disposeInternal.call(this);
		delete this.type;
		delete this.container;
		delete this.dom_;
		delete this.callback;
	};
	/**
	* @constructor
	* @param {String} type, Dialog type
	* @param {Array} options, List ot options to visualize
	* @param {Function} callback, Callback function to execute with the selected index
	* @param {?Number} selectedIndex, Default index to select, optional
	* @param {Function} destroySignal Function to call after the selection callback is executed and before disposing the object
	*/
	var OptionSelector = function(type, options, callback, title, selectedIndex) {
		Popup.call(this, type, callback, title);
		this.options = options;
		this.selectedIndex = selectedIndex || 0;		
	};
	inherit(OptionSelector, Popup);
	
	OptionSelector.prototype.itemSelector = '.multi-select-item';
	OptionSelector.prototype.activeItemSelector = '.multi-select-item.active';
	OptionSelector.prototype.activeClass = 'active';
	OptionSelector.prototype.eventHandler = function(key) {
		console.log('Now the events should be received here', key)
		switch (key) {
			case 'up':
				this.selectItem(false);
				break;
			case 'down':
				this.selectItem(true);
				break;
			case 'ok':
				this.resolver(this.selectedIndex);
				break;
			case 'return':
//				this.destroy();
//				this.dispose();
		}
	};	
	OptionSelector.prototype.disposeInternal = function() {
//		this.constructor.superClass_.disposeInternal.call(this);
		OptionSelector.superClass_.disposeInternal.call(this);
		delete this.options;
		delete this.selectedIndex;
	};
	OptionSelector.prototype.selectItem = function(bool) {
		var next;
		if (bool) {
			next = this.selectedIndex + 1;
			if (next < this.options.length) {
				this.selectedIndex = next;
			}
		} else {
			next = this.selectedIndex - 1;
			if (next >= 0 ) {
				this.selectedIndex = next;
			}
		}
		this.activateItem();
	};
	OptionSelector.prototype.activateItem = function() {
		var current = dom.$(this.activeItemSelector, this.dom_);
		if (current !== null) classes.removeClasses(current, this.activeClass);
		classes.addClasses( dom.$$(this.itemSelector, this.dom_)[this.selectedIndex], this.activeClass );
	};
	OptionSelector.prototype.resolver = function(index) {
		this.destroy();
		this.callback(index);
		this.dispose();
	};
	OptionSelector.prototype.show = function(container) {
		this.constructor.superClass_.show.call(this, container);
		this.activateItem();
	};
	
//	Entries
	var Input = function(type, usekbd, callback, title) {
		Popup.call(this, type, callback, title);
		this.useKbd = usekbd || this.useKbd;
	};
	inherit(Input, Popup);
	Input.prototype.disposeInternal = function() {
		Input.superClass_.disposeInternal.call(this);
		delete this.value;
		delete this.input;
		delete this.kbd;
	};
	Input.prototype.show = function(container) {
		Input.superClass_.show.call(this, container);
		this.value = '';
		this.input = dom.$('.tui-kbd-container', this.dom_);
		if (this.useKbd) {
			this.kbd = KBD.getInstance();
			this.kbd.show(this.input, bind(this.kbdSubmit, this));
			this.kbd.bindToElement(dom.$('.textarea', this.dom_), (this.type === 'password')?true:false);
		}
	};
	Input.prototype.kbdSubmit = function(value) {
		this.destroy();
		this.callback(value);
		this.dispose();
	};
	Input.prototype.eventHandler = function(key) {
		if (array.has(KBD.knownKeys_, key)) {
			this.kbd.eventHandler(key);
		} else  {
//			TODO: Handle the submit button on text area with ff fw
		}
	};

	return {
		OptionList: OptionSelector,
		Text: Input
	};
});
