/**
 * @module applist List of all working applications for the TUI environment
 */
define({
	// In general this should be generated on the fly by the server,
	// however we currently do not have this capability ready, so we will use static provide
	iptv: {
		name: 'IPTV',
		apptag: 'iptv',
		module: 'apps/iptv',
		icon: 'imgs/start_screen_icon.png'
	},
	vod: {
		name: 'VOD',
		apptag: 'vod',
		module: 'apps/vod',
		icon: 'imgs/start_screen_icon.png'
	},
	ppv: {
		name: 'PPV',
		apptag: 'ppv',
		module: 'apps/ppv',
		icon: 'imgs/ppv_screen_icon.png'
	},
	aod: {
		name: 'AOD',
		apptag: 'aod',
		module: 'apps/aod',
		icon: 'imgs/ppv_screen_icon.png'
	},
	start: {
		name: 'Start',
		apptag: 'start',
		module: 'apps/start',
		icon: 'imgs/start_screen_icon.png'
	},
	uvideo: {
		name: 'user videos',
		apptag: 'uvideo',
		module: 'apps/start',
		icon: 'imgs/start_screen_icon.png'
	},
	podcast: {
		name: 'podcasts',
		apptag: 'podcast',
		module: 'apps/start',
		icon: 'imgs/start_screen_icon.png'
	},
	radio: {
		name: 'RADIO',
		apptag: 'radio',
		module: 'apps/radio',
		icon: 'imgs/radio_screen_icon.png'
	},
	games: {
		name: 'GAMES',
		apptag: 'games',
		module: 'apps/games',
		icon: 'imgs/radio_screen_icon.png'
	}
});
