define(['types/types', 'utils/baseapp', 'dom/dom', 'model/datastorage', 'utils/events', 'ui/epginfo', 'dom/attributes', 'view/list', 'debug/console', 'utils/defaultactions','utils/avapp'], function (types, appeng, dom, model, events, epg, domattr, presentation, logger, defaultevents, avapp) {
//	We use EPG in this screen, so support its visibility
	var	epgIsVisible = false,
		pcli = logger.getInstance('iptv screen');
//	construct new basic app with JSON lists
	var APP = avapp({
		name: 'iptv',
		container: null
	});
//	Add the EPG display support
	APP.appEvents.info = {
		name: 'info',
		func: function () {
			epgIsVisible = !epgIsVisible;
			tui.scaleContainer(epgIsVisible);
		},
		attached: false
	};
	
//	Add model and presentation levels, as configured in the define	
	APP.model = model(APP);
	APP.presentation = presentation(APP);
	
//	future support for play, shold be straigh forward with URL only
	APP.on('try-play', function (obj) {
		pcli.log(['Requested play for obj', obj]);
	});
	
//	handle hide EPG and normilize screen when unloading
	APP.on('stop-requested', function() {
		if (epgIsVisible) {
			epgIsVisible = !epgIsVisible;
			tui.scaleContainer(epgIsVisible);
		}
	});
	
	
	//Provide public interface (Start, Stop, Show, Pause/Hide)
	return {
		name: APP.config.name,
		Start: function () {
			APP.fire('start-requested');
		},
		Show: function (cont) {
			APP.fire('show-requested');
			pcli.log('Show called from tui in app ' + this.name);
			APP.presentation.show(cont);
		},
		Stop: function () {
			pcli.log('Stop called for application ' + this.appname);
			APP.fire('stop-requested');
		}
	};
});

