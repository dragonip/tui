/**
 * Module to provide some oop utils
 * @module oop provides some OOP utilities
 * */
define({
	/**
	 * @method beget Returns inherit object from a parent object keeping reference to it
	 * @param {Object} The parent object to use
	 */
	beget: function(parent) {
		var result;
		function F(){}
		F.prototype = parent;
		result = new F();
		result.superClass = parent;
		return result;
	},
	/**
	 * @method enhance Augments object with additional methods
	 * @param {Object} Object to augment
	 * @param {Array} List of augmentors to apply (see augmentors.js - functions that acept object and return the same object augmented)
	 */
	enhance: function(obj, aug_list) {
		var i;
		for (i = 0; i < aug_list.length; i++) {
			aug_list[i](obj);
		}
		return obj;
	},
	/**
	 * @method setOptions Augmentor that adds the missing properties to an object copying from another object
	 * @param {Object} Object to augment
	 * @param {Object} Object to copy from
	 */
	setOptions: function(obj, opts) {
		var k;
		for (k in opts) {
			if (typeof obj[k] === 'undefined') {
				obj[k] = opts[k];
			}
		}
	},
	exists: function(object, method) {
		return (typeof object[method] == 'undefined') ? false : true;
	},
	/**
	 * @method events Classical augmentor function, accepts an object and augments it, then returns the same object, this method adds even support withing the object ('on' and 'fire'), Afer that the object can have event listeners (on('eventname', {Function}) and event triggers (fire('eventName')))
	 * @param {Object} The object to augment
	 */
	events: function(that) {
		var registry = {};
		if (this.exists(that, 'fire') || this.exists(that, 'on')) {
			return that;
		}
		that.fire = function(event, params) {
			pcli(event + ' fired');
			var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
			if (registry.hasOwnProperty(type)) {
				array = registry[type];
				for (i = 0; i < array.length; i += 1) {
					handler = array[i];
					func = handler.method;
					if (typeof func === 'string') {
						func = this[func];
					}
					func.apply(this, handler.parameters || [params] || [event]);
				}
			}
			return this;
		};
		that.on = function(type, method, parameters) {
			var handler = {
				method: method,
				parameters: parameters
			};
			if (registry.hasOwnProperty(type)) {
				registry[type].push(handler);
			} else {
				registry[type] = [handler];
			}
			return this;
		};
		return that;
	}
});
