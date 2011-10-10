define(['dmc/dmc'], function(dmc) {
	var s  = 'app/sampledata/';
	
	var urls = {
		vod: {
			list: s+'vod.js'
		},
		iptv: {
			list: s+'iptv.js',
			epg: s+'iptvepg.js'
		},
		start: {
			list: s+'start.js'
		},
		radio: {
			list: s+'radio.js'
		},
		ppv: {
			list: s+'ppv.js'
		},
		aod: {
			list: s+'aod.js'
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
