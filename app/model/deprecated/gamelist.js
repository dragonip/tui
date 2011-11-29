/**
 * @module Model Basic model to implement the data processing in STB, it should be used as constructor function with one argument
 */
 
/**
 * @method {native} (i.e. the method is the module itself, i.e. augmentor) - provides 
 * @param {Object} The application object that should use data models
 * @return {Object} the data model object
 * */
define([], function() {
	function makeRequest(a, b) {
		var r = new XMLHttpRequest();
		r.open('GET', a, true);
		r.onreadystatechange = function(aEvt) {
			if (r.readyState == 4) {
				if (r.status == 200) {
					b(r.responseText);
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
		var url = 'app/apps/games/list.js';
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
				ret = JSON.parse(text);
				that.data.list = ret;
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
			if (this.currentIndex + 1 < this.data.list.length) {
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
			if (this.currentIndex + step < this.data.list.length) {
				this.app.presentation.activate(this.currentIndex + step);
			}
			break;
		case 'up':
			if (this.currentIndex - step > -1) {
				this.app.presentation.activate(this.currentIndex - step);
			}
			break;

		}
	}
	function getItem(index) {}
	function unload() {
		
	}
	return function(app) {
		var obj = {
			app : app, 
			data: {},
			currentIndex: null,
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
