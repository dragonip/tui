define(['oop/events'], function(events) {
	var defaultOptions = {
		tuiLoaderSubscribe: true
	};
	function BaseApp(opts) {
		this.config = opts.config;
		this.name = opts.config.name || 'noname';
	}
	events(BaseApp);
	return function(appoptions, options) {
		if (typeof options === 'undefined') {
			options = defaultOptions;
		}
		var app = new BaseApp(appoptions);
		if ( options.tuiLoaderSubscribe ) {
			app.on('start-ready', function() {
				tui.apps.signals('ready', {name: this.config.name});
			});
		}
		return app;
	};
});
