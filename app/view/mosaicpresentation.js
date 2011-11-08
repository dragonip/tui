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

	/**
	* @constructor
	* @param {!Object} Application to bind to
	* @param {String} View type to use, mosaic or list are currently supported
	* @param {Number} Settings for item width in mosaic view
	* @param {Number} Settings for item height in mosaic view
	* @param {Boolean} Should the list "jump" when border of screen is reached (true) or scroll row by row (false)
	* @return {MosaicPresentation}
	*/
	var MosaicPresentation = function(app, viewType, itemWidth, itemHeight, opt_shouldJump) {
		Disposable.call(this);
		this.app = app;
		if (viewType === 'mosaic' || !viewType) {
			this.template = new MosaicTemplate(itemWidth, itemHeight);
		} else {
			this.template = new ListTemplate(itemWidth, itemHeight);
		}
		this.registerDisposable(this.template);
		this.shouldJump = opt_shouldJump || this.shouldJump;
	};
	inherit(MosaicPresentation, Disposable);
	/**
	* @private 
	*/
	MosaicPresentation.prototype.shouldJump = false;
	MosaicPresentation.prototype.isRenered_ = false;
	/**
	* Resets the rendered state and enforce re-rendering of the template on the next 'show' request
	*/
	MosaicPresentation.prototype.reset = function() {
		this.isRenered_ = false;
	};
	/**
	* @param {?HTMLElement} The container to bind to, will be reset to the new one if submitted
	*/
	MosaicPresentation.prototype.updateItem = function(index, item) {
		var element = dom.$('div[data-sequence="'+ index + '"]');
		var opts = dom.$('.channel-settings-icons', element);
		var locked = dom.$('.locked', opts);
		var bm = dom.$('.bookmarked', opts);
		if (item.isLocked && locked === null) {
			dom.adopt( opts , dom.create('li', {
				classes: 'icon locked'
			}));
		} else if ( !item.isLocked && locked !== null ) {
			dom.dispose(locked);
		}
		if (item.isBookmarked && bm === null) {
			dom.adopt( opts , dom.create('li', {
				classes: 'icon bookmarked'
			}));
		} else if ( !item.isBookmarked && bm !== null ) {
			dom.dispose(bm);
		}
	};
	MosaicPresentation.prototype.show = function(cont) {
		this.app.fire('show-start');
		if (typeof cont !== 'undefined' && cont !== null)
			this.container = cont;
		this.rasterize_();
		this.app.fire('show-complete');
	};
	MosaicPresentation.prototype.rasterize_ = function(idx) {
		if (!this.isRenered_) {
			if (typeof idx === 'undefined') idx = 0;
			if (this.container === null) {
				return;
			}
			this.container.innerHTML = this.template.rasterize(this.app.model.get('list'),this.app.name);
			this.dom = this.container.firstChild;
			this.activate(idx);
			this.isRenered_ = true;			
		}
	};
	MosaicPresentation.prototype.activate = function(i) {

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
		var tempVal1 = 0;
		if (Math.abs(parentTop) + window.innerHeight < offsetTop +itemHeight + margint + marginb ) {
			if (this.shouldJump)
				mosaicContainer.style.top = '-' + offsetTop + 'px';
			else {
				mosaicContainer.style.top = '-' +( (offsetTop + itemHeight - window.innerHeight) +  margint + marginb) + 'px';				
			}

		} else if ( Math.abs(parentTop) > offsetTop ) {
//			mosaicContainer.style.top = '-' + offsetTop + 'px';
			if (this.shouldJump) {
				tempVal1 = (offsetTop + itemHeight - window.innerHeight) +  margint + marginb;
				if (tempVal1 < 0 ) tempVal1 = 0;
				else tempVal1 = '-'+tempVal1;
				tempVal1 = tempVal1 + 'px';
			} else {
				tempVal1 = '-' + offsetTop + 'px';
			}
			mosaicContainer.style.top = tempVal1;
		}
		//done movement
		this.app.fire('selection-changed', { index: i });
	};
	MosaicPresentation.prototype.getStep = function() { return this.template.getStep(); };
	MosaicPresentation.prototype.unload = function() {
		this.isRenered_ = false;
	};
	MosaicPresentation.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.container;
		delete this.shouldJump;
		delete this.dom;
	};
	return MosaicPresentation;
});
