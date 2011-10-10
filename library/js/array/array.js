/**
 * info bla bla
 * @module array/array Provides useful methods for arrays, mostly copied from closure
 * @requires shims/indexof
 */
define(['shims/indexof'], function() {
	return {
		/**
		 * @method has Checks if the array has the object in it
		 * @param {Array} The array to check
		 * @param {Any} The object to search for in the array
		 */
		has: function(arr, obj) {
			return (arr.indexOf(obj) > -1) ? true : false;
		},
		/**
		 * Remove an item from the array
		 * @method remove Removes item from array
		 * @param {Array} arr Array to operate on
		 * @param {Any} obj Object to remove from the array
		 **/
		remove: function(arr, obj) {
			var i = arr.indexOf(obj);
			var rv;
			if ((rv = i >= 0)) {
				arr.splice(i--, 1);
			}
		},
		/**
		 * removes items from array
		 * @method removeExisting Removes list of items from an array
		 * @param {Array} arr, The array that we will work on
		 * @param {Array} list, The list of items to remove from array
		 */
		removeExisting: function(arr, list) {
			for (var i = 0; i < arr.length; i++) {
				if (list.indexOf(arr[i]) !== -1) {
					arr.splice(i--, 1);
				}
			}
		},
		/**
		 * Adds missing items in array
		 * @method addMissing Adds missing items in array
		 * @param {Array} arr. Array to add items to
		 * @param {Array} list, List of items to add if not already present
		 */
		addMissing: function(arr, list) {
			for (var i = 0; i < list.length; i++) {
				if (arr.indexOf(list[i]) === -1) {
					arr.push(list[i]);
				}
			}
		},
		/**
		 * @method isEmpty Checks the length property of an array like object
		 * @param {Array|ArrayLikeObject} arr. The object to check
		 * @return {Boolean} True if the array has length 0
		 */
		isEmpty: function(arr) {
			if (arr.length && arr.length > 0) return false;
			return true;
		},
		/**
		 * @method last Gets the last element of an array
		 * @param {Array} the aaray to extract the last element from
		 */
		last: function(arr) {
			return arr[arr.length -1 ];
		}
	};
});
