define([
	'oop/inherit',
	'oop/ievent', 
	'dom/dom',
	'shims/bind',
	'utils/visualapp',
	'data/static-strings',
	'tpl/infobuttons'
], function (inherit, Parent, dom, bind, VisualApp, strings, infobuttonstpl) {
	var Mini = function(options) {
		Parent.call(this);
		this.name = options.name;
		this.template_ = options.template;
		this.deps_ = options.deps;
		this.appEvents = {};
		this.master = null;
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
	Mini.remoteKeys_ = ['left', 'right', 'up', 'down', 'ok', 'return', 'zero','one','two','three','four','five','six','seven','eight','nine', 'delete'];
	Mini.prototype.render = function (renderIn) {
		var mydom = dom.getInnerNodes(this.template_.render({
			things: this.master.getData(this.name),
			header: strings.screens[this.name].list.header,
			body: strings.screens[this.name].list.body
		}));
		if (this.dom_ && this.dom_.parentNode) {
			this.dom_.parentNode.replaceChild(mydom, this.dom_);
		} else {
			dom.adopt(renderIn, mydom);
		}
		this.dom_= mydom;
	};
	Mini.prototype.attachEvents = function(bool, options) {
		VisualApp.prototype.attachEvents.call(this, bool);
		if (bool) {
			this.fire('activated', options);
			if (this.panelSetup) {
				var things = {};
				for ( var i = 0; i <this.panelSetup.keys.length; i++) {
					things[this.panelSetup.keys[i]] = strings.screens[this.name].panels.bottom[this.panelSetup.keys[i]];
				}
				tui.setPanels(this.panelSetup.top, this.panelSetup.bottom, undefined,  infobuttonstpl.render({things:things}));
			}
		}
	};
	Mini.prototype.eventReceiver = function(key) {
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
