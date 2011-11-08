define({
	prefix: "/cgi-bin/voip.cgi?",
	suffix: "&newif=1",
	urls : {
		vod: {
			list: "run=vod_json_list",
			lock : "run=add_json_lock&type=VOD", //parameter: id, password
			unlock : "run=add_json_lock&type=VOD", //parameter: id, password
			bookmark :"run=add_json_favorites&type=VOD", //parameter: id
			unbookmark : "run=add_json_favorites&type=VOD" //parameter: id
		},
		iptv: {
			list: "run=iptv_json_list",
			epg: "run=epg_json_list",
			lock : "run=add_json_lock&type=IPTV", //parameter: id, password
			unlock : "run=add_json_lock&type=IPTV", //parameter: id, password
			bookmark :"run=add_json_favorites&type=IPTV", //parameter: id
			unbookmark : "run=add_json_favorites&type=IPTV" //parameter: id
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
		return this.prefix + this.urls[name][type] + this.suffix;
	}
});
