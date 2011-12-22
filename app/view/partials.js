define([
	'oop/inherit',
	'oop/idisposable',
	'dom/dom',
	'view/paginator',
	'dom/classes',
	'tpl/partials',
	'loader/loader',
	'text!css/mosaic.css',
	'data/static-strings'
], function( inherit, Disposable, dom, paginator, classes, srcTemplate, loader, css, strings) {
	loader.loadCSSFromText( css );
	/* START MODULE */
/**
 * Implement the view component of an App with low end devices on mind, mosaic style
 * 
 * @param {Object} appReference Instance of the listingApp interface
 * @param {string} viewType View type to use, 'list' or 'mosaic', currently only using mosaic
 * @param {Number} opt_itemWidth The dezired width of an item in the lisintg
 * @param {Number} opt_itemHeight The desired height of an item in the listing
 * @param {Boolean} opt_shouldJump Ignored in this scenario, added for interface compiance
 * @param {Function} opt_template Jade template to use to rasterize the data
 */
var Partials = function(appReference, viewType, opt_itemWidth, opt_itemHeight, opt_shouldJump, opt_template) {
	Disposable.call(this);
	this.app = appReference;
	this.itemWidth = opt_itemWidth || this.itemWidth;
	this.itemHeight = opt_itemHeight || this.itemHeight;
	this.template = opt_template || this.defaultTemplate;
	this.registerDisposable(this.template);
	this.shouldJump = opt_shouldJump || this.shouldJump;
	this.dom_ = null;
};
inherit( Partials, Disposable );
/**
 * Data accessor, to be overridden if nessesairy
 * @protected
 */
Partials.prototype.getDataInternal = function ( ) {
	return this.app.model.get( 'list' );
};
/**
 * Public universal method to get the data linked to this presenation
 * @final
 */
Partials.prototype.getData = function() {
	return this.getDataInternal();
};
/**
 * Set the page we are on
 * @private
 */
Partials.prototype.setPage = function() {
	this.page_ = Math.floor( this.dataIndex / this.itemsPerPage_ );
};
/**
 * Returns the number of the curent page
 * @private
 * @return {number}
 */
Partials.prototype.getPage = function() {
	return this.page_;
};
/**
 * Method designed to be overridden by implementations, provides rasterization of the data
 * @param {number} data_index The index we are interested in seeing 
 * @protected
 */
Partials.prototype.rasterizeInternal = function ( data_index ) {
	if (this.container === null) return;
	if (typeof data_index != 'undefined') this.dataIndex = data_index;
	this.setPage();
	this.dom_ = dom.getInnerNodes( this.template.render({
		//Archeopterix
		//
		// TODO: remove dependency on this class in template
		// 
		alterClass: false,
		name: this.getAppName,
		data: this.getData(),
		startIndex: this.getStartIndex(),
		//
		// stop before that index, i.e. when you reach it do not process
		// 
		endIndex: this.getStartIndex() + this.itemsPerPage_,
		width: this.getULWidth() + 'px',
		nocontentstring: strings.lists.noContent
	}));
	this.container.innerHTML = '';
	dom.adopt( this.container, this.dom_ );
	this.activate(this.dataIndex);
};
/**
 * Use in calculating the styling, probably should be better off in separate class
 * @private
 * @return {number} How wide the UL constinaer for the template itself should be, belongs to a template class
 */
Partials.prototype.getULWidth = function() {
	return paginator.w - ( paginator.w % this.itemWidth );
};
/**
 * Returns the start index to be used with pagination rendering
 * @return {Number} The index
 */
Partials.prototype.getStartIndex = function() {
	return this.getPage() * this.itemsPerPage_;
};
//
// TODO: implement this
// 
Partials.prototype.unload = function () {

};
/**
 * Method that will find the active item on screen and activate it,
 * If it is not on screen a new page will be rasterized and the item activated (i.e. this function will be called again
 *
 * @protected
 */
Partials.prototype.activateItemInternal = function() {
	var current_item, all_items, next_item_internal_index;

	if (this.dataIndex >= this.getStartIndex() && this.dataIndex < this.getStartIndex() + this.itemsPerPage_) {
		current_item = dom.$(this.activateItemCSSSelector, this.container);
		all_items = dom.$$(this.itemCSSSelector, this.container);
		if (current_item !== null) {
			classes.removeClasses(current_item, this.activeCSSClass);
		}
		next_item_internal_index = this.dataIndex - this.getStartIndex();
		classes.addClasses(all_items[next_item_internal_index], this.activeCSSClass);
		this.app.fire('selection-changed', { index: this.dataIndex });
	} else {
		this.rasterizeInternal();
	}
};
/**
 * Call from outside to activate a certain item from the list, can call for index on screen or out of screen, the calss will rasterize the page if needed
 *
 * @param {Number} data_index The index of the data to activate in presentation
 */
Partials.prototype.activate = function( data_index ) {
	console.log('The new requested index in presenation coming from model is : ', data_index);
	if (this.getData().length > data_index ) {
		this.dataIndex = data_index;
		this.activateItemInternal();
	} else {
		throw Error("Data index out of bound");
	}
};
//
// TODO: implement this as in mosaic
// 
Partials.prototype.updateItem = function( data_index ) {

};
/**
 * Called only once to indicate that the presentation layer should become visible
 *
 * @param {HTMLElement} container The node to attach the presenation to
 * @param {boolean} force If the presentation should be forecefully updated even if it aready shows the correct content
 */
Partials.prototype.show = function(container, force) {
	this.app.fire('show-start');
	if (typeof container != 'undefined' && container !== null) {
		this.container = container;
		this.itemsPerPage_ = paginator.getItemsPerPage_(this.itemWidth, this.itemHeight);
	}
	this.rasterizeInternal(undefined, force);
	this.app.fire('show-complete');
};
/**
 * @override
 */
Partials.prototype.disposeInternal = function() {
	Partials.superClass_.disposeInternal.call(this);
	this.app = null;
	delete this.itemWidth;
	delete this.itemHeight;
	this.template = null;
	delete this.shouldJump;
	delete this.isRendered_;
	this.dom_ = null;
	delete this.itemsPerPage_;
	delete this.dataIndex;
	delete this.page_;
};
Partials.prototype.getStep = function() {
	return paginator.getItemsPerRow_(this.itemWidth, this.itemHeight);
};
Partials.prototype.getHStep = function() {
	return paginator.getItemsPerColumn_(this.itemWidth, this.itemHeight );
};
/**
 * The default item width if no other is provided to the constructor
 * @type {Number}
 */
Partials.prototype.itemWidth = 160;
/**
 * The default item height if none is provided to the contructor
 * @type {Number}
 */
Partials.prototype.itemHeight = 140;
/**
 * The jumoing is when screen end is reached
 * @deprecated
 * @type {boolean}
 */
Partials.prototype.shouldJump = false;
/**
 * Status of the rendering
 * @type {boolean}
 */
Partials.prototype.isRendered_ = false;
/**
 * The container to use to attach presenation to
 * @type {HTMLElement}
 */
Partials.prototype.container = null;
/**
 * The default jade template to use should no other is provided
 * @type {Function}
 */
Partials.prototype.defaultTemplate = srcTemplate;
/**
 * The page index the data is currently paginated to
 * @type {number}
 */
Partials.prototype.dataIndex = 0;
/**
 * Indicator on how many items we have per page
 * @type {number}
 */
Partials.prototype.itemsPerPage_;
/**
 * The query selector for the currently active item in the visible posrtion of the listing
 * @type {string}
 * @protected
 */
Partials.prototype.activateItemCSSSelector = '.item.current';
/**
 * The query selector for all items rendered
 * @type {string}
 * @protected
 */
Partials.prototype.itemCSSSelector = '.item';
/**
 * The query selector for the container that holds all items
 * @type {string}
 * @protected
 */
Partials.prototype.containerCSSSelector = '.list-container';
/**
 * The class name indicating that an item is currently active
 * @type {string}
 */
Partials.prototype.activeCSSClass = 'current';
/**
 * The page number we are on, 0 by default
 * @type {Number}
 * @private
 */
Partials.prototype.page_ = 0;

	/* END MODULE */
return Partials;
});
