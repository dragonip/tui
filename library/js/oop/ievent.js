define(['oop/inherit', 'oop/idisposable'], function(inherit, Disposable) {
	var EventBase = function() {
		Disposable.call(this);
		this.eventRegistry_ = [];
	};
	inherit(EventBase, Disposable);
	EventBase.prototype.on = function(type, method, parameters) {
		var Handler = {
			method: method,
			parameters: parameters
		};
		if (!this.eventRegistry_.hasOwnProperty(type)) {
			this.eventRegistry_[type] = [];
		}
		this.eventRegistry_[type].push(Handler);
	};
	EventBase.prototype.fire = function(event, params) {
		var array, func, handler, i, type = typeof event === 'string' ? event : event.type;

		if (this.eventRegistry_.hasOwnProperty(type)) {
			array = this.eventRegistry_[type];
			for (i = 0; i < array.length; i++ ) {
				handler = array[i];
				func = handler.method;
				if (typeof func === 'string') {
					func = this[func];
				}
				func.apply(this,  [params] || handler.parameters || [event]);
			}
		}
	};
	EventBase.prototype.removeAll = function() {
		
	};
	EventBase.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		this.removeAll();
		delete this.eventRegistry_;
	};
	return EventBase;
})

