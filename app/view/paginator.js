define(function() {

/* START MODULE */

/**
 * Construction to facilitate calculations on rows and columns in containers
 * This class should probably be extended if you use containers, by default it binds to the window as container
 * @constructor
 * @param {HTMLNode} container The cnotainer to bind to, optional
 */
var Paginator = function(container) {
	this.container = container || window;
	this.update_();
};
/**
 * Calculates how many items fit on your 'page' / container
 *
 * @param {number} itemWidth The widths of your item
 * @param {number} itemHeight The height of your item
 * @return {number} The number of items you can fit in one page/container
 */
Paginator.prototype.getItemsPerPage_ = function( itemWidth, itemHeight ) {
	var on_row = this.getItemsPerRow_( itemWidth, itemHeight );
	var per_column = this.getItemsPerColumn_( itemWidth, itemHeight );
	return on_row * per_column;
};

/**
 * Calculates how many items fit on one row in your container
 *
 * @param {number} iw The widths of your item
 * @param {number} ih The height of your item
 * @return {number} The number of items you can fit in one page/container
 */
Paginator.prototype.getItemsPerRow_ = function(iw, ih) {
	return Math.floor(this.w/iw);
};
/**
 * Calculates how many items fit on one column in your container
 *
 * @param {number} iw The widths of your item
 * @param {number} ih The height of your item
 * @return {number} The number of items you can fit in one page/container
 */
Paginator.prototype.getItemsPerColumn_ = function(iw, ih) {
	return Math.floor(this.h/ih);
};
/**
 * Updates the internal storage of window dimaentions, called internally
 * @private
 */
Paginator.prototype.update_ = function() {
	this.w = this.container.innerWidth;
	this.h = this.container.innerHeight;
};
/**
 * Public method to update, call when your window/container resizes
 */
Paginator.prototype.update = function() {
	this.update_();
};
/* END MODULE */
return new Paginator();
});
