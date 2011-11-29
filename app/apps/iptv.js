define([
	'utils/listwithepg',
	'data/static-strings'
], function(App, strings){
	return new App({
		name: 'iptv',
		listType: 'list',
		shouldJump: true,
		hints: {
			ok: strings.screens.iptv.panels.bottom.ok,
			info: strings.screens.iptv.panels.bottom.info,
			playPause: strings.screens.iptv.panels.bottom.playPause
		}
	});	
});
