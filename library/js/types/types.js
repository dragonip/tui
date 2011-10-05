/**
 * ToType module, define type operations
 * @module types/types Provides better JS types support
 * @provides toType, getType, assert
 * */

define({
	toType: (function toType(win) {
	    /*return function(obj) {
	        if (obj === win) {
	            return "Global";
	        }
	        if ((function() {
	            return obj && (obj !== this);
	        }).call(obj)) {
	            return typeof obj;
	        }
	        var a = ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1];
	    };*/
	    return function(obj) {
	    	var a = typeof obj;
	    	if (a === 'object') {
	    		if ( obj instanceof Array) {
	    			return 'array';
	    		}
	    		else if (typeof a.tagName !== 'undefined' ) {
	    			return 'htmlelement';
	    		}
	    	}
	    	return a;
	    }
	})(window),
	/**
	 * @method getType Returns the type of the passed argument in lower case
	 * @param {Any} the item to get the type of
	 */
	getType: function(object) {
		return this.toType(object).toLowerCase();
	},
	/**
	 * @method assert Returns true if the type of the passed item matchies the required on, otherwise returns false
	 * @param {Any} The item to test
	 * @param {String} The type to match
	 */
	assert: function(object, type) {
		return this.getType(object) === type;
	}
});
