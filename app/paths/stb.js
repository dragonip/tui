define({
	prefix: "/cgi-bin/voip.cgi?",
	urls : {
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
		}
	},
	getPath: function (name, type) {
		if (typeof type === 'undefined') {
			type = 'list';
		}
		return this.prefix + this.urls[name][type];
	}
});
