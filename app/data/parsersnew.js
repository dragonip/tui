//Assumed data model for presentation layout
/*
item =  {
	id: Number,
	sortIndex: Number,
	publishName: String,
	cost: Number-as-currency,
	currency: String-as-NNN,
	genre: String,
	thumbnail: String-as-url,
	isLocked: Boolean,
	isBookmarked: Boolean,
	personalRecordingOptions: Array	
};
*/
define([], function(){
	var mode = {
		cost: function(a) {
			var b = parseFloat(a);
			if (isNaN(b)) return 0.00;
			return b;
		},
		currency: function(a) {
			if (a.length < 4) return null;
			return a.trim().substr(-3);
		},
		genre: function(a) {
			if (a.length <= 3) return null;
			return a;
		},
		thumbnail: function(a) {
			if (a.length <= 5) return this.model.defThumb;
			return a;
		},
		locked: function(a) {
			var b = parseInt(a, 10);
			if (b === 0) return false;
			else return true;
		},
		bookmarked: function(a) {
			var b = parseInt(a, 10);
			if (b === 0) return false;
			else return true;
		},
		//personal recording options
		pro: function(a) {
			a = a.split(',');
			if (a.length < 3) {
				return {
					canRecord: true	
				};
			}
			return {
				canRecord: (parseInt(a[0], 10) === 1) ? true : false,
				canWatchTimes: parseInt(a[1], 10),
				expiresInDays: parseInt(a[2], 10)
			};
		},
		isDir: function(a, dirs) {
			if (typeof dirs === 'undefined' || typeof dirs[a] === 'undefined') {
				return false;
			} else {
				if (dirs[a].location && dirs[a].location.url) {
					return dirs[a].location.url;
				} else {
					return false;
				}
			}
		}
	};
	var types =  {
		iptv: {
			model: {
				defThumb: null
			},
			converter:function(data){
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						type: "iptv",
						time: null,
						cost: null,
						currency: null,
						genre: mode.genre(cd[7].genre),
						thumbnail: mode.thumbnail.apply(this, [cd[3]]),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: mode.locked(cd[4]),
						isBookmarked: mode.bookmarked(cd[5]),
						personalRecordingOptions: mode.pro(cd[6]),
						isDir: mode.isDir(cd[0], data.dirs)
					});
				}
				return obj;
			}
		},
		vod: {
			model: {
				defThumb: 'http://www.sysmaster.com/demo/M55/Apps/VOD/imgs/default.png'
			},
			converter: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						type: "vod",
						time: null,
						cost: mode.cost(cd[3].cost),
						currency: mode.currency(cd[3].cost),
						genre: mode.genre(cd[3].genre),
						thumbnail: mode.thumbnail.apply(this, [cd[3].thumb_url]),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: mode.locked(cd[4]),
						isBookmarked: mode.bookmarked(cd[5]),
						personalRecordingOptions: mode.pro(cd[6]),
						isDir: mode.isDir(cd[0], data.dirs)
					});
				}
				return obj;
			}
		},
		ppv: {
			model: {
				defThumb: 'http://www.sysmaster.com/demo/M55/Apps/VOD/imgs/default.png'
			},
			converter: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						type: "ppv",
						time: cd[3],
						cost: mode.cost(cd[4]),
						currency: null,
						genre: mode.genre(cd[5].genre),
						thumbnail: mode.thumbnail.apply(this, [cd[5].thumb_url]),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: mode.locked(cd[6]),
						isBookmarked: mode.bookmarked(cd[7]),
						personalRecordingOptions: mode.pro(cd[8]),
						isDir: false
					});
				}
				return obj;
			}
		},
		categorylist: {
			model: {

				defThumb: 'http://www.sysmaster.com/demo/M55/Apps/VOD/imgs/default.png'
				
			},
			converter: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: null,
						publishName: cd[1],
						type: 'video_cats',
						time: null,
						cost: null,
						currency: null,
						genre: null,
						thumbnail: mode.thumbnail.apply(this, [cd[3].thumb_url]),
						isLocked: mode.locked(cd[4]),
						isBookmarked: mode.bookmarked(cd[5]),
						personalRecordingOptions: null,
						isDir: false
					});
				}
				return obj;
			}
		},		
		radio: {
			model: {

				defThumb: ''
				
			},
			converter: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						type: "radio",
						time: null,
						cost: null,
						currency: null,
						genre: mode.genre(cd[3].genre),
						thumbnail: mode.thumbnail.apply(this, [cd[3].thumb_url]),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: mode.locked(cd[4]),
						isBookmarked: mode.bookmarked(cd[5]),
						personalRecordingOptions: mode.pro(cd[6]),
						isDir: false
					});
				}
				return obj;
			}
		},
		aod: {
			model: {

				defThumb: ''
				
			},
			converter: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						type: 'aod',
						time: null,
						cost: mode.cost(cd[4]),
						currency: null,
						genre: null,
						thumbnail: mode.thumbnail.apply(this, [cd[8]]),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: mode.locked(cd[5]),
						isBookmarked: mode.bookmarked(cd[6]),
						personalRecordingOptions: mode.pro(cd[7]),
						isDir: mode.isDir(cd[0], data.dirs)
					});
				}
				return obj;
			}
		}

	};
	return {
		parse: function(obj, type) {
			if (types[type]) {
				return types[type].converter(obj);
			} else {
				throw {
					name: 'RuntimeError',
					message: 'No suitable parser for the data type requested'
				};
			}
		}
	};
	
});
