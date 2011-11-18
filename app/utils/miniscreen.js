define([
	'oop/inherit',
	'oop/ievent', 
	'dom/dom',
	'shims/bind',
	'utils/visualapp'
], function (inherit, Parent, dom, bind, VisualApp) {
	var Mini = function(options) {
		console.log(arguments)
		Parent.call(this);
		this.name = options.name;
		this.template_ = options.template;
		this.appEvents = {};
		var bound = bind(this.eventReceiver, this);
		Mini.remoteKeys_.forEach(bind(function(item){
			this.appEvents[item] = {
				name: item,
				func: bound,
				attached: false
			};
		}, this));
	};
	inherit(Mini, Parent);
	Mini.remoteKeys_ = ['left', 'right', 'up', 'down', 'ok'];
	Mini.prototype.render = function (renderIn) {
		if (this.template_ !== null) {
			this.dom_ = dom.getInnerNodes(this.template_.render());
		}
		dom.adopt(renderIn, this.dom_);
	};
	Mini.prototype.attachEvents = function(bool) {
		VisualApp.prototype.attachEvents.call(this, bool);
		if (bool) {
			this.fire('activated');
		}
	};
	Mini.prototype.eventReceiver = function(key) {
		console.log('Mini has received an event routed from multiscreen', key)
		this.fire('remote-key', key);
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
		delete this.name;
		delete this.appEvents;
	}
	return Mini;
})
