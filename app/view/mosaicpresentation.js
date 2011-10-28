/**
 * @module view/mosaic This is the default mosaic view layer, used in video listing, it uses the mosaiclist template and css/mosaic.css to display the grid with videos
 * */
define([
	'dom/dom',
	'dom/attributes',
	'dom/classes',
	'view/mosaictemplate',
	'loader/loader',
	'oop/idisposable',
	'oop/inherit'
], function(dom, attr, classes, MosaicTemplate, loader, Disposable, inherit) {	
	function getContainerRestrains(container) {
		var s = window.getComputedStyle(container, null);
		return {
			w: s.getPropertyValue('width'),
			h: s.getPropertyValue('height')
		};
	}
	//The real constructor
	var MosaicPresentation = function(app, viewType, itemWidth, itemHeight) {
		Disposable.call(this);
		this.app = app;
		if (viewType === 'mosaic' || !viewType) {
			this.template = new MosaicTemplate(itemWidth, itemHeight);
		} else {
			this.template = new ListTemplate(itemWidth, itemHeight);
		}
		this.registerDisposable(this.template);
	};
	inherit(MosaicPresentation, Disposable);
	MosaicPresentation.prototype.show = function(cont) {
		this.app.fire('show-start');
		if (typeof cont !== 'undefined' && cont !== null)
			this.container = cont;
		this.rasterize_();
		this.app.fire('show-complete');
	};
	MosaicPresentation.prototype.rasterize_ = function(idx) {
		if (typeof idx === 'undefined') idx = 0;
		if (this.container === null) {
			return;
		}
		this.container.innerHTML = this.template.rasterize(this.app.model.get('list'),this.app.name);
		this.dom = this.container.firstChild;
		this.activate(idx);
	};
	MosaicPresentation.prototype.activate = function(i) {
		console.log('Activating item: ', i);
		var a = dom.$('.item.current', this.container);
		var collxn = dom.$$('.item', this.container);
		if (a !== null) classes.removeClasses(a, 'current');
		classes.addClasses(collxn[i], 'current');
		//add checks here for scxroll into view
		var margint = parseInt(tui.mainContainer.style.marginTop, 10);
		var marginb = parseInt(tui.mainContainer.style.marginBottom, 10);
		var mosaicContainer = dom.$('.list-container');
		var offsetTop = collxn[i].offsetTop;
		var parentTop = parseInt(mosaicContainer.style.top, 10)  || 0;
		var itemHeight = this.template.getItemHeight();
		if (Math.abs(parentTop) + window.innerHeight < offsetTop +itemHeight + margint + marginb ) {
			mosaicContainer.style.top = '-' +( (offsetTop + itemHeight - window.innerHeight) +  margint + marginb) + 'px';
		} else if ( Math.abs(parentTop) > offsetTop ) {
			mosaicContainer.style.top = '-' + offsetTop + 'px';
		}
		//done movement
		this.app.fire('selection-changed', { index: i });
	};
	MosaicPresentation.prototype.getStep = function() { return this.template.getStep(); };
	MosaicPresentation.prototype.unload = function() {};
	MosaicPresentation.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.container;
	};
	return MosaicPresentation;
});
