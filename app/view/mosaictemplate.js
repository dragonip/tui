define(['tpl/mosaiclist','text!css/mosaic.css','loader/loader','oop/idisposable','oop/inherit'
], function(template, css, loader, Disposable, inherit) {
	loader.loadCSSFromText(css);
	
	var View = function(iWidth, iHeight) {
		Disposable.call(this);
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.iw = iWidth || this.iw;
		this.ih = iHeight || this.ih;
		this.vh = window.innerHeight - 60 - 10;
	};
	inherit(View, Disposable);
	View.prototype.iw = 160;
	View.prototype.ih = 140;
	View.prototype.getStep = function() {
		return Math.floor(this.w / this.iw);
	};
	View.prototype.getULWidth = function() {
		return this.w - (this.w % this.iw);
	};
	View.prototype.getULLeft = function() {
		return ((this.w % this.iw) / 2) + 'px';
	};
	View.prototype.getItemHeight = function() {
		return this.ih;
	};
	View.prototype.rasterize = function(templateFills, name) {
		return template.render({
			things: templateFills,
			id: name,
			w: this.getULWidth()
		});
	};
	View.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.w;
		delete this.h;
		delete this.iw;
		delete this.ih;
		delete this.vh;
	};
	return View;
});
