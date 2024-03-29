define(['data/parsersnew', 'debug/console', 'types/types', 'array/array'], function(parsers, logger, types, array) {

	var pcli = logger.getInstance('model/datastorage');
	var xhr = {
		get: function xhr(a, b) {
			var r = new XMLHttpRequest();
			r.open('GET', a, true);
			r.onreadystatechange = function(aEvt) {
				if (r.readyState == 4) {
					if (r.status == 200) {
						b(r.responseText.substring(r.responseText.indexOf('{') - 1, r.responseText.lastIndexOf('}') + 1));
					} else {
						b(null);
					}
					r.onreadystatechange = null;
				}
			};
			r.send(null);
		}
	};
	
	function Storage(app) {
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
	}
	Storage.prototype.loadData = function(o) {
		var url = o.url || tui.options.paths.getPath(this.app.config.name, o.type);
		var that = this;
		pcli.log(['Storage is loading data now', o.url]);
		xhr.get(url, function(text) {
			that.load(text, o);
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
		if (types.assert(item.isDir,'string')) {
			this.isLoading = true;
			this.loadData({
				url: item.isDir,
				type: 'folder',
				callback: (function(self) {
					return function(data) {
						//Store the data array
						self.data.dirs[self.pointer[self.currentIndex].id] = data;
						//Store the history entry
						self.history.push( {
							dir: self.pointer,
							index: self.currentIndex
						});
						//Change current position
						self.pointer = self.data.dirs[self.pointer[self.currentIndex].id];
						self.app.fire('data-load-end', {
							type: 'folder'
						});
						self.isLoading = false;
						item.isDir = true;
					}
				}(this))
			});
			return true;
		} else if (item.isDir === true ){ 
			//dir is already loaded, just show it
			this.history.push({
				dir: this.pointer,
				index: this.currentIndex
			});
			this.pointer = this.data.dirs[this.pointer[this.currentIndex].id];
			this.app.fire('data-load-end', {
				type: 'folder'
			});
		} else {
			return false;
		}	
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
	
	Storage.prototype.load = function(text, o) {
		var res, ret;
		if (text === null) {
			pcli.log('Null?');
			throw {
				name: 'NetworkError',
				message: 'Cannot get requested URL : ' + url
			};
		}
		res = window.eval('('+text+')');
		
		if (typeof res.config !== 'undefined') {
			delete res.config;
		}
		if (o.type !== 'epg')
			ret = parsers.parse(res, this.app.config.name);
		switch (o.type) {
			case 'list':
				this.data.list = ret;
				if (array.isEmpty(this.history)) this.pointer = this.data.list;
				this.isLoaded = true;
				break;
			case 'folder':
				ret.unshift({
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
				pcli.log('Setting EPG data as property of this data');
				this.data.epg = res;
				break;
		}
		if (typeof o.callback === 'function') {
			o.callback(ret);
		}
		this.app.fire('data-load-end', {
			type: o.type,
			app: this.app.config.name
		});
	};
	Storage.prototype.unload = function(){};
	
	return function(app) {
		return new Storage(app);
	}
});
	
