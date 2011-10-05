/**
 * Module to work with element classes
 * @module domattributes setters and getters for the dom
 * @requires domclasses
 */
define(['dom/classes'], function(classes) {
	function resolve(prop) {
		switch (prop) {
		case 'html':
			return 'innerHTML';
		case 'text':
			return 'textContent';
		default:
			return prop;
		}
	}
	return {
		/**
		 * @method set Sets property to element
		 * @param {HTMLElement} The html element to set to
		 * @param {String} The property to set (can be classes, html, text or any directly accessible property (i.e. dot notation property)
		 * @param {String} Value to set on the property
		 */
		set: function(element, prop, value) {
			switch (prop) {
			case 'classes':
				var a = value.split(/\s+/);
				classes.addClasses(element, a);
				return;
			case 'style':
				element.setAttribute('style', value);
				return;
			default:
				element[resolve(prop)] = value;
			}
		},
		/**
		 * @method get Returns the value of the property if set
		 * @param {HTMLElement} Element to look up prpeprty for
		 * @param {String} Property/Attribute to look up
		 */
		get: function(element, prop) {
			switch (prop) {
			case 'classes':
				return classes.getClasses(element).join(' ');
			default:
				return element[resolve(prop)];
			}
		},
		/**
		 * @method remove Removes the property from element
		 * @param {HTMLElement} Element to clear from attribute
		 * @param {String} The property to remove
		 */
		remove: function(element, prop) {
			element.removeAttribute(prop);
		}
	};
});
