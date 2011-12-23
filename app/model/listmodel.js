define([
	'types/types', 
	'array/array',
	'oop/idisposable',
	'oop/inherit',
	'json/json',
	'net/simplexhr',
	'shims/bind',
	'ui/simplescreenselector',
	'transport/request',
	'data/static-strings'
], function(types, array, Disposable, inherit, json, xhr, bind, appsel, request, strings){
	
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
		this.bound = bind(this.loadDir, this);
		this.lastLoadedTS = null;
	};
	inherit(Storage, Disposable);
	Storage.prototype.loadData = function(o) {
		var url = o.url || tui.options.paths.getPath(o.name, o.type);
		var that = this;
		xhr.get(url, function(text) {
			that.load(text, o);
		}, {
			parse: true
		});
		this.app.fire('data-load-start');
	};
	Storage.prototype.acceptEvent = function(ev) {
		console.log('Received event from remote to datamodel', ev);
		if (this.isLoading) return;
		var step = this.app.presentation.getStep();
		var hstep = this.app.presentation.getHStep();

		switch(ev.action) {
		case 'chdown':
			if (this.currentIndex + (step * hstep) < this.pointer.length) {
				this.app.presentation.activate(this.currentIndex + (step * hstep));
			}
			break;
		case 'chup': 
			if (this.currentIndex - (step * hstep) >= 0) {
				this.app.presentation.activate(this.currentIndex - (step * hstep));
			}
			break;
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
			break;
		case 'return':
			if (this.pointer.length > 0  && this.pointer[0].id === null) {
				this.outDir();
			} else {
				appsel.show();
			}
			break;
		case 'recall':
			this.app.presentation.reset(true);
			this.app.Stop();
			var req = request.create('calld', {
				'run':'refresh_media_json'
			});
			req.send();
			tui.loadIndicator.show(strings.common.refresh + this.app.name.toUpperCase());
			//
			// this.isLoaded = false;
			// this.history = [];
			// this.app.presentation.reset(true);
			// this.app.defaultStartRequested();
			// 
			break;
		default: break;
		}

	};
	Storage.prototype.selectByIndex = function(index) {
		console.log('Selected index : ' +  index);
		if (index < this.pointer.length) {
			this.currentIndex = index;
			this.app.presentation.activate(this.currentIndex);
		}
	};
	/**
	 * Finds the next item that is not a dir and play it (should be called only
	 * in playback mode)
	 *
	 * Also skip folders and locked channels
	 *
	 * @private
	 */
	Storage.prototype.activateNextItem = function() {
		var index = this.currentIndex;
		var found = null;		
		for (index++ ; index < this.pointer.length; index++ ) {
			if (this.pointer[index].isDir === false && this.pointer[index].id !== null) {
				found = index;
				break;
			}
		}
		if (found === null) {
			index = 0;
			for (; index < this.currentIndex; index ++) {
				if (this.pointer[index].isDir === false && this.pointer[index].id !== null) {
					found = index;
					break;
				}
			}
		}
		if (found === null ) {
			console.log('There is no other channel available');
		} else {
			this.selectByIndex(found);
			
		}
	};
	Storage.sortById = function(a, b) {
		var ida = parseInt(a.id, 10);
		var idb = parseInt(b.id, 10);
		if (ida > idb) return 1;
		else if (ida < idb ) return -1;
		return 0;
	};
	Storage.sortByName = function(a,b) {
		var namea = a.publishName.toLowerCase();
		var nameb = b.publishName.toLowerCase();
		if (namea > nameb) {
			return 1;
		} else if (namea < nameb) return -1;
		else return 0;
	};
	Storage.sortByIndex = function(a, b) {
		var ba = (a.isBookmarked) ? 1 : 0;
		var bb = (b.isBookmarked) ? 1 : 0;
		var ia = parseInt(a.sortIndex, 10);
		var ib = parseInt(b.sortIndex, 10);
		if ( ba != bb ) {
			if ( ba < bb ) return 1;
			if ( ba > bb ) return -1;
			return 0;
		}
		if ( ia < ib ) return -1;
		if ( ia > ib ) return 1;
		return 0;
	};
	Storage.prototype.sort = function(byWhat) {
		if (this.pointer.length > 0 ) {
			this.pointer.sort(Storage[byWhat]);
			this.app.presentation.reset(true);
			this.app.fire('data-load-end', {
				type: (this.history.length > 0) ?  'folder': 'list'
			});
		}
	};
	Storage.prototype.activatePreviousItem = function() {
		var index = this.currentIndex - 1, found = null;
		for (; index >= 0; index--) {
			if (this.pointer[index].isDir === false && this.pointer[index].id !== null) {
				found = index;
				console.log(JSON.stringify(this.pointer[index]));
				break;
			}
		}
		if (found === null) {
			console.log('Not found, try from back ');
			index = this.pointer.length-1;
			for (; index > this.currentIndex; index--) {
				if (this.pointer[index].isDir === false && this.pointer[index].id !== null) {
					found = index;
					break;
				}
			}
		}
		if (found === null) {
			console.log('No prev channel to select');
		} else {
			this.selectByIndex(found);
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
		if (item.isDir !== false) {
			this.isLoading = true;
			for (var k in item.isDir) {
				url[k] = item.isDir[k];
			}
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
	};
	
	Storage.prototype.get = function(what) {
		what = (types.assert(what,'string'))? what : 'list';
		if (what === 'list') {
			return this.pointer;
		} else if ( what === 'epg') {
			return this.data.epg;
		}
	};
	Storage.prototype.load = function(res, o) {
		if (res === null ) {
			throw {
				name: 'NetworkError',
				message: 'Cannot get requested URL : '
			};
		}
		switch (o.type) {
			case 'list':
				this.data.list = res;
				if (array.isEmpty(this.history)) this.pointer = this.data.list;
				this.isLoaded = true;
				this.lastLoadedTS = (new Date()).getTime();
				if (this.lastLoadedTS > tui.DATA_TS.LISTS) {
					this.pointer = this.data.list;
				}
				break;
			case 'folder':
				res.unshift({
					id: null,
					sortIndex: 0,
					publishName: "..",
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
				console.log('JUST LOADED EPG DATA FROM SERVER');
				this.data.epg = res;
				break;
			default: break;
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
		
	};
	return Storage;
});
	
