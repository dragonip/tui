/**
 * @module utils/autoid Provides means to have automatic IDs generated for your module
 */
define(function() {
	var instances = {};
	function autoID(prefix) {
		this.prefix = prefix;
		instances[prefix] = 0;
	}
	/**
	 * @method get Gets the next auto ID from the pool, you first need to create the ppol with getInstance(str)
	 * @return {String} The next ID from pool
	 * */
	autoID.prototype.get = function() {
		instances[this.prefix] += 1;
		return this.prefix + instances[this.prefix];
	};
	/**
	 * @method getInstance 
	 * @param {String} The name of module to support with auto IDs
	 * @returns {Object} An instance of the incrementor object
	 */
	return {
		getInstance: function(str) {
			return new autoID(str);
		}
	};
});
