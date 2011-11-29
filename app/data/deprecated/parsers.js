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

	var types =  {
		vod: {
			model: {
				defThumb: 'http://www.sysmaster.com/demo/M55/Apps/VOD/imgs/default.png',
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
					if (a.length <= 5) return this.defThumb;
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
				isDir: function(id, dirs) {
					if (typeof dirs[id] === 'undefined') {
						return false;
					} else {
						if (dirs[id].location && dirs[id].location.url) {
							return dirs[id].location.url;
						} else {
							return false;
						}
					}
				}
			},
			convert: function(data) {
				var i = 0;
				var obj = [];
				var r;
				for (; i < data.body.length; i++) {
					cd = data.body[i];
					obj.push({
						id: cd[0],
						sortIndex: cd[1],
						publishName: cd[2],
						cost: this.model.cost(cd[3].cost),
						currency: this.model.currency(cd[3].cost),
						genre: this.model.genre(cd[3].genre),
						thumbnail: this.model.thumbnail(cd[3].thumb_url),
						settings: function(){
							var res = false;
							if (this.isLocked || this.isBookmarked || this.personalRecordingOptions.canRecord ) {
								res = true;
							}
							return res;
						},
						isLocked: this.model.locked(cd[4]),
						isBookmarked: this.model.bookmarked(cd[5]),
						personalRecordingOptions: this.model.pro(cd[6]),
						isDir: this.model.isDir(cd[0], data.dirs)
					});
				}
				return obj;
			}
		}
	};
	return {
		parse: function(obj, type) {
			if (types[type]) {
				return types[type].convert(obj);
			} else {
				throw {
					name: 'RuntimeError',
					message: 'No suitable parser for the data type requested'
				};
			}
		}
	};
});
