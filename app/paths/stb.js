define(['dmc/dmc'], function(dmc) {
	var s  = 'sampledata/';
	
	var urls = {
		vod: {
			list: s+'vod.js'
		},
		iptv: {
			list: s+'iptv.js',
			epg: s+'iptvepg.js'
		}
	};

	
	return {
		getPath: function(name, type) {
			if (typeof type === 'undefined') {
				type = 'list';
			}
			return urls[name][type];
		}
	};
});
