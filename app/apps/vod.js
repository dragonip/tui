define(['types/types', 'utils/oop', 'utils/baseapp', 'dom/dom', 'model/datastorage', 'utils/events', 'ui/epginfo', 'dom/attributes', 'view/mosaic', 'debug/console', 'utils/defaultactions', 'utils/avapp'], function (types, oop, appeng, dom, model, events, epg, domattr, presentation, logger, defaultevents, avapp) {
	var pcli = logger.getInstance('app/apps/vod');
	var APP = avapp({
		name: 'vod',
		container: null
	}),
		epgIsVisible = false;

	APP.appEvents.info = {
		name: 'info',
		func: function () {
			epgIsVisible = !epgIsVisible;
			tui.scaleContainer(epgIsVisible);
		},
		attached: false
	};

	APP.model = model(APP);
	APP.presentation = presentation(APP);
	APP.on('stop-requested', function () {
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
			pcli.log('Show called from tui in app vod');
			APP.presentation.show(cont);
		},
		Stop: function () {
			pcli.log('Stop called for application ' + this.appname);
			APP.fire('stop-requested');
		}
	};
});

