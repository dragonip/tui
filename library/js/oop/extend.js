define(function() {
 	return function(target, var_args) {
		var key, source;
		for (var i = 1; i < arguments.length; i++) {
			source = arguments[i];
			for (key in source) {
				target[key] = source[key];
			}
			// For IE the for-in-loop does not contain any properties that are not
			// enumerable on the prototype object (for example isPrototypeOf from
			// Object.prototype) and it will also not include 'replace' on objects that
			// extend String and change 'replace' (not that it is common for anyone to
			// extend anything except Object).
			for (var j = 0; j < goog.object.PROTOTYPE_FIELDS_.length; j++) {
				key = [ 'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf' ][j];
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
	};
});

