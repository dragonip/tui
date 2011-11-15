define({
	general: ['lock', 'unlock', 'bookmark', 'unbookmark'],
	prefix: "/cgi-bin/voip.cgi?",
	suffix: "&newif=1",
	urls : {
		lock: "run=add_json_lock&sig=lock&type=", //id, password
		unlock: "run=add_json_lock&sig=unlock&type=", //id, password
		bookmark: "run=add_json_favorites&sig=bookmark&type=", //id
		unbookmark: "run=add_json_favorites&sig=bookmark&type=", //id
		vod: {
			list: "run=vod_json_list"
		},
		iptv: {
			list: "run=iptv_json_list",
			epg: "run=epg_json_list"
		},
		radio: {
			list: "run=radio_json_list"
		},
		ppv: {
			list: "run=ppv_json_list"
		},
		aod: {
			list: "run=aod_json_list"
		},
		games: {
			skipParametrize: true,
			list: "app/apps/games/list.js"
		}
	},
	getPath: function (name, type) {
		var result;
		if (typeof type === 'undefined') {
			type = 'list';
		}
		if (this.general.indexOf(type) != -1) {
			result = this.urls[type] + name.toUpperCase();
		} else {
			result = this.urls[name][type];
		}
		if (this.urls[name].skipParametrize) return  result;
		return this.prefix + result + this.suffix;
	}
});
