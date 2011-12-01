define([
	'types/types', 
	'array/array',
	'oop/idisposable',
	'oop/inherit',
	'json/json',
	'net/simplexhr',
	'shims/bind'
], function(types, array, Disposable, inherit, json, xhr, bind) {
	
	var Storage = function(app) {
		Disposable.call(this);
		this.app = app;
		this.history = [];
		this.currentIndex = 0;
		this.data = {
			list: [],
			dirs: {},
			epg: null
		};
		this.isLoaded = false;
		this.pointer = null;
		this.isLoading = false;
		this.bound = bind(this.loadDir, this)
	};
	inherit(Storage, Disposable);
	Storage.prototype.loadData = function(o) {
//		debugger;
		var url = o.url || tui.options.paths.getPath(o.name, o.type);
//		url = url + "&newif=1";
		var that = this;
		xhr.get(url, function(text) {
			that.load(text, o);
		}, {
			parse: true
		});
		this.app.fire('data-load-start')
	};
	Storage.prototype.acceptEvent = function(ev) {
		if (this.isLoading) return;
		var step = this.app.presentation.getStep();
		switch(ev.action) {
		case 'right':
			if (step === 1) return;
			if (this.currentIndex + 1 < this.pointer.length) {
				this.app.presentation.activate(this.currentIndex + 1);
			}
			break;
		case 'left':
			if (step === 1) return;
			if (this.currentIndex > 0 ) {
				this.app.presentation.activate(this.currentIndex -1 );
			}
			break;
		case 'down':
			if (this.currentIndex + step < this.pointer.length) {
				this.app.presentation.activate(this.currentIndex + step);
			}
			break;
		case 'up':
			if (this.currentIndex - step > -1) {
				this.app.presentation.activate(this.currentIndex - step);
			}
			break;	
		case 'ok':
			if (this.enterDir() === false) {
				if (this.getItem().id === null) {
					this.outDir();
				} else {
					this.app.fire('try-play', this.getItem());
				}
			}
		}
		
	};
	Storage.prototype.outDir = function() {
		var toLoad = this.history.pop();
		this.pointer = toLoad.dir;
		this.app.fire('data-load-end', {
			type: 'folder',
			index: toLoad.index
		});		
	};
	Storage.prototype.enterDir = function() {
		var item = this.getItem();
		var url = {};
		if (types.assert(item.isDir,'object')) {
			this.isLoading = true;
			for (var k in item.isDir) {
				url[k] = item.isDir[k]
			};
			url.run = 'folder_list_json';
			url.newif = 1;
			this.loadData({
				url: url,
				type: 'folder',
				callback: this.bound
			});
			return true;
		} else {
			return false;
		}	
	};
	Storage.prototype.loadDir = function(data) {
		this.data.dirs[this.pointer[this.currentIndex].id] = data;
		this.history.push({
			dir: this.pointer,
			index: this.currentIndex
		});
		this.pointer = this.data.dirs[this.pointer[this.currentIndex].id];
		this.isLoading = false;
	};
	Storage.prototype.getItem = function(i) {
		var ii = (types.assert(i, 'number'))?i:this.currentIndex;
		return this.pointer[ii];
	}
	
	Storage.prototype.get = function(what) {
		what = (types.assert(what,'string'))? what : 'list';
		if (what === 'list') {
			return this.pointer;
		} else if ( what === 'epg') {
			return this.data.epg;
		}
	}
	Storage.prototype.load = function(res, o) {
		if (res === null ) {
			throw {
				name: 'NetworkError',
				message: 'Cannot get requested URL : '
			};
			return;
		}
		switch (o.type) {
			case 'list':
				this.data.list = res;
				if (array.isEmpty(this.history)) this.pointer = this.data.list;
				this.isLoaded = true;
				break;
			case 'folder':
				res.unshift({
					id: null,
					sortIndex: 0,
					publishName: "up",
					type: "",
					time: "",
					cost: 0.00,
					currency: null,
					genre: "FOLDER",
					thumbnail: "app/imgs/mosaic-folder.png",
					settings: function(){
						return false;
					},
					isLocked: false,
					isBookmarked: false,
					personalRecordingOptions: {canRecord: false},
					isDir: false
				});
				break;
			case 'epg':
				console.log('JUST LOADED EPG DATA FROM SERVER')
				this.data.epg = res;
				break;
		}
		if (typeof o.callback === 'function') {
			o.callback(res);
		}
		this.app.fire('data-load-end', {
			type: o.type,
			app: this.app.name
		});
	};
	Storage.prototype.getPropertyFromItem = function(item, index) {
		var found = this.getItem(index);
		return found[item];
	};
	Storage.prototype.getEPGForItem = function(index) {
		if (this.data.epg === null) {
			console.log('There is no EPG records for this data');
			return null;
		}
		var itemByID = this.getPropertyFromItem('id',index);
		if (itemByID && this.data.epg[itemByID]) {
			return this.data.epg[itemByID].body;
		} else {
			return [];
		}
	};
	Storage.prototype.unload = function(){};
	Storage.prototype.disposeInternal = function() {
		Storage.superClass_.disposeInternal.call(this);
		
	}
	return Storage;
});
	
