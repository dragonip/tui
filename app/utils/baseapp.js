/**
 * @module appengine Basic module to inherit from when creating apps, the modules does not provide any methods and should be used as base object (i.e var myclass = moduleReference({options});)
 */
define(['utils/oop'], function(oop) {
	var defaults = {
		tuiLoaderSubscribe: true
	};
	return function(opts) {
		if (typeof opts === 'undefined') {
			opts = defaults;
		}
		//All applications should have events in them for internal comunication ''on the fly''
		var app = oop.events({});
		//Should we subscribe to TUI loader (probably YES!), this is bound to the APP object that is returned
		//The interface is tui.apps.signals, for list of signals in tui.apps.signals view main.js
		if (opts.tuiLoaderSubscribe) {
			app.on('start-ready', function() {
				tui.apps.signals('ready', {name: this.config.name});
			});
		}
		return app;
	};
});
