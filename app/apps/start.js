define([
	'dom/types', 
	'utils/oop', 
	'utils/baseapp', 
	'dom/dom',
	'utils/presentation', 
	'utils/events', 
	'data/data', 
	'ui/epginfo',
	'dom/attributes'], 
function (types, oop, appeng, dom, presentation, Mevents, dget, epg, domattr) {
	var datatype = 'vodlist';
	var APP = appeng({
		tuiLoaderSubscribe: true
	}),
		commonKeys = ['left', 'right', 'up', 'down', 'chup', 'chdown'],
		DOM = null,
		moduleEvents = {};
	//Define the UI presentation layer
	presentation.mosaic(APP);

	commonKeys.forEach(function (item) {
		moduleEvents[item] = {
			name: item,
			func: function (k) {
				APP.fire('userkey', {
					key: k
				});
			},
			attached: false
		};
	});

	APP.appname = 'start';
	APP.container = null;
	APP.view = {};
	APP.rowData = null;

	return {
		name: APP.appname,
		Start: function () {
			pcli('App started');
			APP.fire('started');
			if (APP.rowData === null) {
				pcli('Get data for this screen');
				dget.get({
					type: datatype,
					callback: function(data) {
						APP.rawData = data;
						pcli('Parsed data is ...');
						pcli(data);
						APP.fire('ready');
					}
				});
			} else {
				APP.fire('ready');
			}
		},
		Stop: function () {
			pcli('App stopped');
		},
		ShowIn: function (cont) {
			/*if (DOM === null) {
				DOM = dom.create('div', {
					classes: 'colorfulbg'
				});
			}
			*/
			APP.container = cont;
			
			domattr.set(cont, 'html', APP.rasterizeData(APP.rawData));
			
			Mevents.addHandlers(moduleEvents);
			/*setTimeout(function () {
				pcli('Showing epg');
				epg.show('<div style="width: 400px; height: 400px; background-color: blue;"></div>');
			}, 4000);*/

		},
		Pause: function () {
			pcli('Removing from DOM');
			if (DOM !== null) dom.dispose(DOM);
			APP.container = null;
			Mevents.removeHandlers(moduleEvents);
		}
	};
});