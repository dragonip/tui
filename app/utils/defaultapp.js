//Sets only this.name and handler for 'start-ready', Disposes of config and name

define(['oop/inherit', 'oop/ievent	'],function(inherit, EventBase){
	var App = function(options) {
		EventBase.call(this);
		this.setName(options?options.name:null);
		this.registerWithTUI();
	};
	inherit(App, EventBase);
	App.prototype.name = 'UnnamedApp';
	App.prototype.setName = function(name) {
		if (typeof name === 'string') {
			this.name = name;
		}
	};
	//Always add start-ready to signal to TUI
	App.prototype.registerWithTUI = function() {
		this.on('start-ready', this.setStateReady);
	};
	App.prototype.setStateReady = function() {
		tui.apps.signals('ready', {
			name: this.name
		});
	}
	App.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
//		App.superClass_.disposeInternal.call(this);
		delete this.name;
	};
	return App;
})
