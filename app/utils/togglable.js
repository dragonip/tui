define([
	'oop/inherit',
	'utils/eventable',
	'dom/dom'
], function(inherit, Eventable, dom){
	var Togglable = function(container) {
		Eventable.call(this);
		this.container = container || document.body;
	};
	inherit(Togglable, Eventable);
	
	/**
	* Default state for the components
	* @private
	*/ 
	Togglable.prototype.attachedToDom_ = false;
	Togglable.prototype.enterDom = function() {
		this.attachedToDom_ = true;
		dom.adopt(this.container, this.dom);
	};
	Togglable.prototype.exitDom = function() {
		this.attachedToDom_ = false;
		dom.dispose(this.dom);
	};
	Togglable.prototype.isAttachedToDom = function() {
		return this.attachedToDom_;
	};
	Togglable.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.container;
		delete this.attachedToDom_;
	};
	return Togglable;
});
