define({
	prefix: "/cgi-bin/voip.cgi?",
	suffix: "&newif=1",
	urls : {
		vod: {
			list: "run=vod_json_list",
			lock : "run=add_json_lock&type=VOD&sig=lock", //parameter: id, password
			unlock : "run=add_json_lock&type=VOD&sig=unlock", //parameter: id, password
			bookmark :"run=add_json_favorites&type=VOD&sig=bookmark", //parameter: id
			unbookmark : "run=add_json_favorites&type=VOD&sig=unbookmark" //parameter: id
		},
		iptv: {
			list: "run=iptv_json_list",
			epg: "run=epg_json_list",
			lock : "run=add_json_lock&type=IPTV&sig=lock", //parameter: id, password
			unlock : "run=add_json_lock&type=IPTV&sig=unlock", //parameter: id, password
			bookmark :"run=add_json_favorites&type=IPTV&sig=bookamrk", //parameter: id
			unbookmark : "run=add_json_favorites&type=IPTV&sig=unbookmark" //parameter: id
		},
		radio: {
			list: "run=radio_json_list"
		},
		ppv: {
			list: "run=ppv_json_list",
			lock : "run=add_json_lock&type=PPV&sig=lock", //parameter: id, password
			unlock : "run=add_json_lock&type=PPV&sig=unlock", //parameter: id, password
			bookmark :"run=add_json_favorites&type=PPV&sig=bookmark", //parameter: id
			unbookmark : "run=add_json_favorites&type=PPV&sig=unbookmark" //parameter: id
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
		if (typeof type === 'undefined') {
			type = 'list';
		}
		if (this.urls[name].skipParametrize) return  this.urls[name][type]
		return this.prefix + this.urls[name][type] + this.suffix;
	}
});
