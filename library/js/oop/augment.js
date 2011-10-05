/**
 * @module oop/augment Module to provide convenient access to the augmentors
 */
define(['oop/events'], function() {

	var augmentors = {
		events: arguments[0]
	};
	/**
	 * @method {Module} call the whole module with Constructor functions and the desired augmentation
	 * @param {Function} obj. Should be a constructor function (i.e. protptypal inheritance is used
	 * @param {String} augmentation. The name of the module used to augment, one of the augentors in oop/
	 * @return {undefined}
	 */
	return function(obj, augmentation) {
		if (typeof augmentors[augmentation] === 'function') {
			console.log('da');
			augmentors[augmentation](obj);
		}
	};
});
