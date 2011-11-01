define([
	'oop/inherit',
	'oop/idisposable',
	'dom/dom'
], function (inherit, Disposable, dom) {

	var Scrollable = function(containerSelector, elementSelector) {
		Disposable.call(this);
		this.setContainerSelector( containerSelector );
		this.setElementSelector( elementSelector );
	};
	inherit(Scrollable, Disposable);
	/**
	* @private
	*/
	Scrollable.prototype.containerSelector_;
	Scrollable.prototype.setContainerSelector = function(containerSelector) {
		if (typeof containerSelector === 'string')
			this.containerSelector_ = containerSelector;
	};
	/**
	* @private
	*/
	Scrollable.prototype.elementSelector_;
	Scrollable.prototype.setElementSelector = function( elementSelector ) {
		this.elementSelector_ = elementSelector;
	};
	
	Scrollable.prototype.scroll = function() {
		var element = dom.$(this.elementSelector_);
		var container = dom.$(this.containerSelector_);
		if (element ===  null) return;
		var elementTopOffset = element.offsetTop;
		var elementHeight = element.scrollHeight;
		var containerScrollTop = container.scrollTop;
		var containerHeight = container.clientHeight;
		
		if (elementTopOffset + elementHeight > containerScrollTop + containerHeight ) {
			container.scrollTop = elementTopOffset - containerHeight + elementHeight;
		} else if ( containerScrollTop > elementTopOffset + elementHeight ) {
			container.scrollTop = elementTopOffset;
		}
	};
	
	Scrollable.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.containerSelector_;
		delete this.elementSelector_;
	};
	return Scrollable;
});
