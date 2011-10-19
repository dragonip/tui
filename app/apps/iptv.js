define(['types/types', 'utils/baseapp', 'dom/dom', 'model/datastorage', 'utils/events', 'ui/epginfo', 'dom/attributes', 'view/list', 'debug/console', 'utils/defaultactions','utils/avapp', 'utils/empty'], function (types, appeng, dom, model, events, epg, domattr, presentation, logger, defaultevents, avapp, empty) {
//	We use EPG in this screen, so support its visibility
	var	epgIsVisible = false,
		pcli = logger.getInstance('iptv screen');
//	construct new basic app with JSON lists
	var APP = avapp({
		name: 'iptv',
		container: null
	});
	var epgMove = function(key) {};
	//GEt tainted events for default actions so we can fly with EPG
	var epgEvents = empty.getTainted(['left', 'right', 'chup', 'chdown', 'ok']);
	epgEvents.up = {
		name: 'up',
		func: epgMove,
		attached: false
	};
	epgEvents.down = {
		name: 'down',
		func: epgMove,
		attached: false
	};
	
	
	
//	Add model and presentation levels, as configured in the define	
	APP.model = model(APP);
	APP.presentation = presentation(APP);
	
//	Add the EPG display support
	APP.appEvents.info = {
		name: 'info',
		func: function () {
			epgIsVisible = !epgIsVisible;
			tui.scaleContainer(epgIsVisible);
			if (epgIsVisible) {
				epg.show();
				APP.updateEPG();	
			} else {
				epg.hide();
			}

		},
		attached: false
	};
	
	APP.updateEPG = function() {
		var it = this.model.getItem();
		epg.display({ 
			icon: it.thumbnail,
			title: it.publishName,
			things: (this.model.data.epg[it.id] ? this.model.data.epg[it.id].body : [])
		});
	};
	
//	Currently only IPTV supports EPG
	APP.on('start-requested', function() {
//		if (this.model.data.epg === null) {
			pcli.log('Loading EPG data for IPTV')
			this.model.loadData({
				type: 'epg',
				url: 'app/sampledata/iptv_epg.js'
			});
//		}
	});
	APP.on('selection-changed', function() {
		if (epgIsVisible) this.updateEPG();
	});
	
	
//	future support for play, shold be straigh forward with URL only
	APP.on('try-play', function (obj) {
		pcli.log(['Requested play for obj', obj]);
	});
	
//	handle hide EPG and normilize screen when unloading
	APP.on('stop-requested', function() {
		if (epgIsVisible) {
			epgIsVisible = !epgIsVisible;
			epg.hide();
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

