define(['types/types',
	'utils/baseapp', 
	'dom/dom', 
	'utils/events', 
	'dom/attributes',
	'text!css/start.css', 
	'text!tpl/start.txt', 
	'loader/loader'], function(types, appeng, dom, events, domattr, css, html, loader) {
	loader.loadCSSFromText(css, 'startCSS');
	var APP = appeng({
		config: {
			name: 'start',	
			container: null
		}
	},{
		tuiLoaderSubscribe: true
	});

	//Lock events for internal comunication
	APP.on('start-requested', function() {
		this.fire("start-ready");
	});
	APP.on('show-requested', function() {
		this.config.container.innerHTML = html;
	})

	APP.on('stop-requested', function() {
		this.config.container.innerHTML = '';
		dom.dispose(dom.$('#startCSS'));
	});
	//Provide public interface (Start, Stop, Show, Pause/Hide)
	return {
		name: APP.config.name,
		Start: function() {
			APP.fire('start-requested');
		},
		Show: function(cont) {
			if (cont) {
				APP.config.container = cont;
				APP.fire('show-requested');
			}
		},
		Stop: function() {
			APP.fire('stop-requested');			
		}
	};
});
