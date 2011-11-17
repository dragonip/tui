define([
	'array/array',
	'model/listmodel',
	'oop/inherit',
	'json/json',
	'env/exports', 
	'shims/bind',
	'loader/loader'
], function(array, Listmodel, inherit, json, exports, bind, loader) {
	var YTData = function(app) {
		Listmodel.call(this, app);
		this.currentDataURL = YTData.urls.most_popular_url;
		exports.exportSymbol('youtube', {
			name: 'load',
			symbol:  bind(this.load, this)
		});
	};
	inherit(YTData, Listmodel);
	YTData.urls = {
		most_popular_url: 'http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?alt=jsonc&callback=exportedSymbols.youtube.load&v=2&max-results=15&prettyprint=true',
		toprated: 'http://gdata.youtube.com/feeds/api/standardfeeds/top_rated?alt=jsonc&callback=exportedSymbols.youtube.load&v=2&max-results=15&prettyprint=true',
		most_viewed: 'http://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?alt=jsonc&callback=exportedSymbols.youtube.load&v=2&max-results=15&prettyprint=true',
		recently_featured: 'http://gdata.youtube.com/feeds/api/standardfeeds/recently_featured?alt=jsonc&callback=exportedSymbols.youtube.load&v=2&max-results=15&prettyprint=true',
		search_url: 'http://gdata.youtube.com/feeds/api/videos?alt=jsonc&callback=exportedSymbols.youtube.load&v=2&max-results=15&prettyprint=true&q=',
	};
	YTData.prototype.loadData = function() {
		this.app.fire('data-load-start');
		loader.loadJSONP('youtubevideos', this.currentDataURL);
	};
	YTData.prototype.load = function(data) {
		console.log('data from youtube', data);
		var items = data.data.items;
		var i, item;
		for (i = 0; i < items.length; i++) {
			item = items[i];
			if ( item.accessControl && item.accessControl.list === 'allowed'  ) {
				item.playURI = item.id;
				this.data.list.push(item);
			}
		}
		this.pointer = this.data.list;
		this.app.fire('data-load-end', {
			type: (data.data.startIndex === 1?'list':'append'),
			app: this.app.name
		});
	};
	YTData.prototype.disposeInternal = function(){
		YTData.superClass_.disposeInternal.call(this);
		delete this.currentDataURL;
	};
	
	return YTData;
});
