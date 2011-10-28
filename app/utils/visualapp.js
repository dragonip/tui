// Sets container, Show, Stop and Start, as well as attachEvents

define([
	'oop/inherit',
	'utils/defaultapp',
	'utils/events'
], function(inherit, App, events) {
	var VisualApp = function(options) {
		App.call(this, options);
	};
	inherit(VisualApp, App);
	
	VisualApp.prototype.container = null;
	VisualApp.prototype.Start = function() {
		this.fire('start-requested');
	};
	VisualApp.prototype.Show = function(container) {
		this.container = container;
		this.fire('show-requested');
	};
	VisualApp.prototype.Stop = function(){
		this.fire('stop-requested')
	};
	VisualApp.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		if (this.container !== null) {
			delete this.container;
		}
	};
	VisualApp.prototype.attachEvents = function(bool) {
		console.log('Calling attachEvents');
		console.log(bool);
		if (typeof this.appEvents  === 'object') {
			if (bool)
				events.addHandlers(this.appEvents);
			else { 
				events.removeHandlers(this.appEvents);
			}
		}
	};
	return VisualApp;
});
