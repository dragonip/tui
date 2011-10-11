define(['debug/console','model/gamelist', 'view/games', 'utils/baseapp','utils/events'], function(logger, model, presentation, appeng, events) {

	var pcli = logger.getInstance('apps/games');
	pcli.log('Parsing apps/games');

	var commonKeys = ['left', 'right', 'up', 'down', 'ok'],
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
	var APP = appeng({
		config: {
			name: 'games',	
			container: null
		}
	},{
		tuiLoaderSubscribe: true
	});
	APP.model = model(APP);
	APP.presentation = presentation(APP);
	APP.on('start-requested', function() {
		if (typeof this.model.data.list === 'undefined') {
			this.model.load({
				type: 'list'
			});
		} else {
			this.fire('start-ready');
		}
	});
	
	APP.on('data-load-end', function(data) {
		if (data.type === 'list') {
			this.fire('start-ready');
		}
	});
	APP.on('try-play', function(obj) {
		pcli.log(['Requested play for obj', obj]);
	});
	APP.on('selection-changed', function(o) {
		this.model.currentIndex = o.index;
	});
	APP.on('show-complete', function() {
		events.addHandlers(appEvents);
	});
	APP.on('stop-requested', function() { 
		this.model.unload();
		this.presentation.unload();
		events.removeHandlers(appEvents);
	});
	
	return {
		name: 'games',
		Start: function() {
			pcli.log('Start coming from main');
			APP.fire('start-requested');
		},
		Show: function(cont) {
			pcli.log('Show games list');
			APP.presentation.show(cont);
		},
		Pause: function() {},
		Stop: function() {}
	};
});

