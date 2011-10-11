define(['types/types', 'utils/baseapp', 'dom/dom', 'utils/events', 'dom/attributes', 'debug/console', 'text!css/start.css', 'text!tpl/start.txt', 'loader/loader'], function(types, appeng, dom, events, domattr, logger, css, html, loader) {
	loader.loadCSSFromText(css, 'startCSS');
	var APP = appeng({
		config: {
			name: 'start',	
			container: null
		}
	},{
		tuiLoaderSubscribe: true
	}),	pcli = logger.getInstance('start screen');

	//Lock events for internal comunication
	APP.on('start-requested', function() {
		this.fire("start-ready");
	});

	APP.on('stop-requested', function() {
		
	});
	//Provide public interface (Start, Stop, Show, Pause/Hide)
	return {
		name: APP.config.name,
		Start: function() {
			APP.fire('start-requested');
		},
		Show: function(cont) {
			cont.innerHTML = html;
			pcli.log('Show called from tui in app ' + this.name);
		},
		Stop: function() {
			pcli.log('Stop called for application ' + this.appname);
			dom.dispose(dom.$('#startCSS'));
		}
	};
});
