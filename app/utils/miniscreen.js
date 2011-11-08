define([
	'oop/inherit',
	'oop/ievent', 
	'dom/dom'
], function (inherit, Parent, dom) {
	var Mini = function(template) {
		Parent.call(this);
		this.template_ = template;
		this.on('routed-event', this.eventReceiver);
	};
	inherit(Mini, Parent);
	
	Mini.prototype.render = function (renderIn) {
		if (this.template_ !== null) {
			this.dom_ = dom.getInnerNodes(this.template_.render());
		}
		dom.adopt(renderIn, this.dom_);
	};
	Mini.prototype.eventReceiver = function(key) {
		console.log('Mini has received an event routed from multiscreen', key)
	};
	Mini.prototype.getDom = function() {
		if (this.dom_) {
			return this.dom_;
		}
		return null;
	};
	Mini.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.template_;
		delete this.dom_;
	}
	return Mini;
})
