define([
	'tpl/popups',
	'dom/dom',
	'ui/vkbd',
	'dom/attributes',
	'shims/bind'

], function (tpl, dom, KBD, domattr, bind){
	var Dialog = function(type, opt_usekbd) {
		this.type = type || this.type;
		this.useKbd = opt_usekbd || this.useKbd;
		this.kbd;
	};
	
	Dialog.prototype.type = 'input';
	Dialog.prototype.useKbd = true;

	Dialog.prototype.callback = function(value) {
		//Do other stuff here, like hiding the DOM and disposing
		if (typeof this.originalCallback === 'function') {
			this.originalCallback(value);
			delete this.originalCallback;
		}
	};
	
	Dialog.prototype.eventHandler = function(key) {
		if (this.useKbd) {
			this.kbd.eventHandler(key);
		}
	};
	
	Dialog.prototype.Show = function(container, callback) {
		this.originalCallback = callback;
		this.container = container || document.body;
		this.dom_ = dom.create('div', {
			classes: 'multi-select-wrapper',
			style: domattr.get(this.container, 'style').cssText
		});
		this.dom_.innerHTML = tpl.render({
			title: 'Static String Here',
			type: this.type,
			addKbdContainer: this.useKbd			
		});
		this.value = '';
		this.input = dom.$('.tui-kbd-container', this.dom_);
		if (this.useKbd) {
			this.kbd = KBD.getInstance();
			console.log(this.kbd)
			this.kbd.show(this.input, bind(this.callback, this));
			this.kbd.bindToElement(dom.$('.textarea', this.dom_), (this.type === 'password')?true:false);
		}
		this.dom_.style.top = '-' +window.innerHeight + 'px';
		dom.adopt(this.container, this.dom_);
	};
	
	return Dialog;
});
