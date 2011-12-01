/**
 * @module domclasses Allows browser independent work with class names (the preferred method to change DOM properties at once instead of settings it one by one)
 */
define(['types/types', 'array/array'], function(types, array) {
	return {
		/**
		 * @method getClasses Retirns Array with all classes currently set on the element
		 * @param {HTMLElement} The element to query
		 */
		getClasses: function(element) {
			var classes = element.className;
			return classes && typeof classes.split == 'function' ? classes.split(/\s+/) : [];
		},
		/**
		 * @method hasClass Returns true/flase depending on the element class 
		 * @param {HTMLElement} Element to query
		 */
		hasClass: function(element, classname) {
			return (this.getClasses(element).indexOf(classname) === -1) ? false : true;
		},
		/**
		 * @method addClasses Adds one or more classes to an element
		 * @param {HTMLElement} The element to add the classes to
		 * @param {Array|String} Supported are two type of parameters, array that contains the strings for class names to be added or arbitary length of arguments as strings
		 */
		addClasses: function(element, var_arg) {
			if (element === null) return;
			var args;
			if (!types.assert(var_arg, 'array')) {
				args = Array.prototype.slice.call(arguments, 1);
			} else {
				args = var_arg;
			}
			var classes = this.getClasses(element);
			array.addMissing(classes, args);
			element.className = classes.join(' ');
		},
		/**
		 * @method removeClasses Removes classes from element
		 * @param {HTMLElement} The element to alter
		 * @param {Array|String} Excpects array with strings or variable length of arguments as string
		 */
		removeClasses: function(element, var_args) {
			var args;
			if (!types.assert(var_args, 'array')) {
				args = Array.prototype.slice.call(arguments, 1);
			} else {
				args = var_arg;
			}
			var classes = this.getClasses(element);
			array.removeExisting(classes, args);
			element.className = classes.join(' ');
		},
		/**
		 * @method addRemoveClasses Adds and removes classes as one step (i.e. alter the DOM once)
		 * @param {HTMLElement} The element to alter
		 * @param {Array} List of classes to add
		 * @param {Array} List of classes to remove
		 */
		addRemoveClasses: function(element, classesToAdd, classesToRemove) {
			var classes = this.getClasses(element);
			if (typeof classesToRemove == 'string') {
				array.remove(classes, classesToRemove);
			} else {
				array.removeExisting(classes, classesToRemove);
			}
			if (typeof classesToAdd == 'string') {
				if ( classes.indexOf(classesToAdd) === -1 ) {
					classes.push(classesToAdd);
				}
			} else {
				array.addMissing(classes, classesToAdd);
			}
			element.className = classes.join(' ');
		},
		/**
		 * @method radioClass Adds class name to element and removes it from its siblings
		 * @param {HTMLElement} The element to add the class to
		 * @param {String} Class name to set and remove from all siblings 
		 */
		radioClass: function(element, classname) {
			this.addClasses(element, classname);
			element.parentNode.children.forEach(function(el) {
				this.removeClasses(el, '.'+classname);
			});
		}
	};
});
