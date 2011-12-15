define({
	general: ['lock', 'unlock', 'bookmark', 'unbookmark'],
//	prefix: "/cgi-bin/voip.cgi?",
//	suffix: {
//		newif: 1
//	},
	urls : {
		lock: {
			list: {
				"run": "add_json_lock",
				"sig": "lock"
			}
		},
		unlock: {
			 list: {
				"run": "add_json_lock",
				"sig": "unlock"
			}
		},
		bookmark: {
			list: {
				"run": "add_json_favorites",
				"sig": "bookmark"
			}
		},
		unbookaark: {
			list: {
				"run": "add_json_favorites",
				"sig": "unbookmark"
			}
		},
		vod: {
			list:  'vod_json_list'
		},
		iptv: {
			list: "iptv_json_list",
			epg: "epg_json_list"
		},
		radio: {
			list: "radio_json_list"
		},
		ppv: {
			list: "ppv_json_list"
		},
		aod: {
			list: "aod_json_list"
		},
		games: {
			skipParametrize: true,
			list: "app/apps/games/list.js"
		},
		uservideo: {
			list: "uvideo_json_list"
		},
		weather: {
			units: {
				run: 'get_cfgval_json',
				section: 'system',
				'var': 'temperature'
			},
			//"run=get_cfgval_json&section=system&var=temperature",
			city:{
				run: 'get_cfgval_json',
				section: 'system',
				'var': 'weather_code'
			} 
			//'run=get_cfgval_json&section=system&var=weather_code'
		}
	},
	getPath: function (name, type) {
		var result;
		if (typeof type === 'undefined') {
			type = 'list';
		}
		// Handle normal URLS that still need to be loaded with xhr
		if (this.urls[name].skipParametrize) {
			return this.urls[name][type];
		}
		if (typeof this.urls[name][type] === 'string') {
			result = {
				run : this.urls[name][type],
				newif: 1
			};
		} else {
			result = {};
			for (var k in this.urls[name][type]) {
				result[k] = this.urls[name][type][k];
			}
		}
//		return result;
		return  result;
	}
});
