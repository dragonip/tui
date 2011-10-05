/**
 * @module view/mosaic This is the default mosaic view layer, used in video listing, it uses the mosaiclist template and css/mosaic.css to display the grid with videos
 * */

define(['dom/dom',
	    'dom/attributes',
	    'dom/classes',
	    'tpl/mosaiclist',
	    'text!css/mosaic.css',
	    'loader/loader'
	    ], 
function(dom, attr, classes, tpl, css, loader) {
	loader.loadCSSFromText(css);
	var R = (function() {
		var w = window.innerWidth,
			h = window.innerHeight,
			iw = 160,
			ih = 140,
			vh = h - 60 - 10;
		return {
			ulWidth: w - (w % iw),
			ulLeft: ((w % iw) / 2) + 'px',
			step: Math.floor(w / iw),
			itemHeight : ih,
			update: function(x, y) {
				this.ulWidth = w - (w % x);
				this.ulLeft = ((w % x) / 2) + 'px';
				this.itemHeight = y;
				this.step = Math.floor(w / x);
			}
		};
	}());
	
	function getContainerRestrains(container) {
		var s = window.getComputedStyle(container, null);
		return {
			w: s.getPropertyValue('width'),
			h: s.getPropertyValue('height')
		};
	}
	function getStep() {
		return R.step;
	}
	function rasterize(idx) {
		if (typeof idx === 'undefined') idx = 0;
		if (this.container === null) {

			return;
		}
		var res = tpl.render({
			things: this.app.model.get('list'),
			id: this.app.config.name,
			w: R.ulWidth + 'px'
		});
		this.container.innerHTML = res;
		this.dom = this.container.firstChild;
		this.activate(idx);
	}
	function activate(i) {
		var a = dom.$('.item.current', this.container);
		var collxn = dom.$$('.item', this.container);
		if (a !== null) classes.removeClasses(a, 'current');
		classes.addClasses(collxn[i], 'current');
		//add checks here for scxroll into view
		var mosaicContainer = dom.$('.tui-mosaic.list-container');
		var offsetTop = collxn[i].offsetTop;
		var parentTop = parseInt(mosaicContainer.style.top, 10)  || 0;
		if (Math.abs(parentTop) + window.innerHeight < offsetTop + R.itemHeight ) {
			mosaicContainer.style.top = '-' + (offsetTop + R.itemHeight - window.innerHeight) + 'px';
		} else if ( Math.abs(parentTop) > offsetTop ) {
			mosaicContainer.style.top = '-' + offsetTop + 'px';
		}
		//done movement
		this.app.fire('selection-changed', { index: i });
	}
	function show(cont) {
		this.app.fire('show-start');
		this.container = cont;
		this.rasterize();
		this.app.fire('show-complete');
	}
	function unload() {
		//If we do not want to keeo menory we can just remove the html if it is still there (i.e. not overwritten by another app already)
		if (dom.dataGet(this.container.firstChild, 'appid') === this.app.config.name) {
			//dom.dispose(this.container.firstChild);
		}
		/*
		if (!this.dom) return;
		dom.dispose(this.dom);
		delete this.dom;
		*/
	}
	/**
	 * @method {Module} The module method should be aplpied to your controller/app and provides public interface to interact with the view layer
	 * */
	return function(app) {
		var rasterizer = {
			app: app,
			rasterize: rasterize,
			show: show,
			activate: activate,
			getStep: getStep,
			unload: unload
		};
		return rasterizer;
	};
});
