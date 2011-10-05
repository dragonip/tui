/**
 * @module Model Basic model to implement the data processing in STB, it should be used as constructor function with one argument
 */
 
/**
 * @method {native} (i.e. the method is the module itself, i.e. augmentor) - provides 
 * @param {Object} The application object that should use data models
 * @return {Object} the data model object
 * */
define(['data/parsersnew'], function(parsers) {
	function makeRequest(a, b) {
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

	function makeGroupRequest(list, cb) {}

	function loadData(o) {
		var url = o.url || tui.options.paths.getPath(this.app.config.name, o.type);
		makeRequest(url, (function(that) {
			return function(text) {
				var res, ret;
				if (text === null) {
					pcli('Null?');
					throw {
						name: 'NetworkError',
						message: 'Cannot get requested URL : ' + url
					};
				}
				res = eval('(' + text + ')');
				if (res.config !== 'undefined') {
					delete res.config;
				}
				ret = parsers.parse(res, that.app.config.name);
				if (o.type === 'list') {
					that.data.list = ret;
				} else if (o.type === 'epg') {
					that.data.epg = ret;
				}
				if (typeof o.callback === 'function') {
					o.callback(ret);
				}
				that.app.fire('data-load-end', {
					type: o.type
				});
			};
		}(this)));
		this.app.fire('data-load-start');
	}

	function sortData(sortType) {
		return;
	}
	function getData(what) {
		if (typeof what !== 'string') {
			what = 'list';
		}
		return this.data[what];
	}
	function selection(ev) {
		var step = this.app.presentation.getStep();
		switch(ev.action) {
		case 'right':
			if (step === 1) return;
			if (this.selectedIndex + 1 < this.data.list.length) {
				this.app.presentation.activate(this.selectedIndex + 1);
			}
			break;
		case 'left':
			if (step === 1) return;
			if (this.selectedIndex > 0 ) {
				this.app.presentation.activate(this.selectedIndex -1 );
			}
			break;
		case 'down':
			if (this.selectedIndex + step < this.data.list.length) {
				this.app.presentation.activate(this.selectedIndex + step);
			}
			break;
		case 'up':
			if (this.selectedIndex - step > -1) {
				this.app.presentation.activate(this.selectedIndex - step);
			}
			break;

		}
	}
	function getItem(index) {}
	function unload() {
		
	}
	/**
	 * The app object should have the fololowing properties:
	 *{
		config: {
			name: String
		}
		fire: Function,
		on: Function
	}*
	 * the following singals are fired:
	 * 'data-load-start', 'data-load-end'
	 * */
	return function(app) {
		var obj = {
			app : app, 
			data: {},
			selectedIndex: null,
			/**
			 * Accepts Object with following props
			 * 
			 * {
			 * type: 'list'||'epg'||'other'
			 * callback: function (optional)
			 * */
			
			load: loadData,
			/**
			 * returns the data (list or epg or other) - first argument should be 'list' - optional
			 * */
			get: getData,
			acceptEvent: selection,
			unload: unload
		};
		return obj;
	};
});
