/**
 * @module oop/events Module that provides custom events in objects, use on constructor functions to add 'on' and 'fire' events on the prototype chain. 
 */
define(['debug/console'], function(logger) {
	var pcli = logger.getInstance('event support');
	//assume we will work with the prototype of the object (i.e. call with Object.prototype)
	var registry = [];

	function getRegistrlyLink() {
		this._eventRegistryLink = registry.length;
		registry.push({});
	}
	function getEvents() {
		pcli.log(this._eventRegistryLink);
		pcli.log(registry[this._eventRegistryLink]);
	}

	function fire(event, params) {
		pcli.log('Fired event ' + event + ' in object with name ' + this.name);
		var array, func, handler, i = 0,
			type = typeof event === 'string' ? event : event.type,
			n = this._eventRegistryLink;
		if (registry[n][type]) {
			array = registry[n][type];
			for (;i < array.length; i += 1) {
				handler = array[i];
				func = handler.method;
				if (typeof func === 'string') {
					func = this[func];
				}
				func.apply(this, [params] || handler.parameters || [event]);
			}
		}
		return this;
	}
	function on(type, method, parameters) {
		if (typeof this._eventRegistryLink === 'undefined') {
			getRegistrlyLink.call(this);
		}
		var handler = {
			method: method,
			parameters: parameters
		},
			subscription = registry[this._eventRegistryLink][type] || (registry[this._eventRegistryLink][type] = []);
		subscription.push(handler);
	}
	return function(obj) {
		obj.prototype.on = on;
		obj.prototype.fire = fire;
		//leave this for debugging
		obj.prototype.getEvents = getEvents;
		return obj;
	}
});
