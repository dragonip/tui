define([
	'types/types',
	'utils/oop',
	'utils/baseapp',
	'dom/dom',
	'model/default',
	'utils/events',
	'ui/epginfo',
	'dom/attributes',
	'view/mosaic',
	'debug/console'
	],
function(types, oop, appeng, dom, model, events, epg, domattr, presentation, logger) {
/*	var config = {
		name: 'vod'
	};
	
	var dataConfig = { 
		parser: parsers.vod,
		epgparser: null
	};
	*/
	//var datatype = 'vodlist';
	var pcli = logger.getInstance('app/apps/vod');
	var APP = appeng({
		tuiLoaderSubscribe: true
	}),
		commonKeys = ['left', 'right', 'up', 'down', 'chup', 'chdown'],
		appEvents = {};
	commonKeys.forEach(function(item) {
		appEvents[item] = {
			name: item,
			func: function(k) {
				APP.model.acceptEvent({
					type: 'remote',
					action: k
				});
			},
			attached: false
		};
	});
	APP.config = {
		name: 'vod',
		container: null
	};
	APP.model = model(APP);
	
	APP.presentation = presentation(APP);
	
	//Lock events for internal comunication
	APP.on('start-requested', function() {
		//pcli.log(types.getType(this.model.data.list));
		//var a = types.assert(this.model.data.list, 'undefined');
		//pcli.log(' Result of assert is ' + a );
		//pcli.log(' Result of regular typeof ' + typeof this.model.data.list);
		if (types.assert(this.model.data.list, 'undefined')) {
			//pcli.log('\n\na\n\n');
			APP.model.load({
				type: 'list'
			});
		}
		else {
			this.fire('start-ready');
		}
	});
	APP.on('data-load-start', function() {
		pcli.log('Started loading data via XHR');
	});
	APP.on('data-load-end', function(data) {
		pcli.log('data loaded end via XHR');
		APP.fire('start-ready');
	});
	APP.on('selection-changed', function(o) {
		this.model.selectedIndex = o.index;
	});
	APP.on('show-complete', function() {
		pcli.log('Attach events');
		events.addHandlers(appEvents);
	});
	APP.on('stop-requested', function() { 
		this.model.unload();
		this.presentation.unload();
		events.removeHandlers(appEvents);
	});
	
	//Provide public interface (Start, Stop, Show, Pause/Hide)
	return {
		name: APP.config.name,
		Start: function() {
			APP.fire('start-requested');
		},
		Show: function(cont) {
			APP.fire('show-requested');
			pcli.log('Show called from tui in app vod');
			APP.presentation.show(cont);
		},
		Stop: function() {
			pcli.log('Stop called for application ' + this.appname);
			APP.fire('stop-requested');
		}
	};
});
