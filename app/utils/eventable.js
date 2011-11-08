define([
	'oop/inherit',
	'oop/idisposable',
	'utils/events'
], function(inherit, Disposable, events){
	var Eventable = function() {
		Disposable.call(this);
	};
	inherit(Eventable, Disposable);
	Eventable.prototype.isAttachedWithEvents = false;
	Eventable.prototype.attachEvents = function(bool) {
		if (typeof this.appEvents  === 'object') {
			if (bool) {
				this.isAttachedWithEvents = true;
				events.addHandlers(this.appEvents);
			} else { 
				this.isAttachedWithEvents = false;
				events.removeHandlers(this.appEvents);
			}
		}
	};
	/**
	* @deprecated
	*/
	Eventable.prototype.detachEvents = function() {
		this.attachEvents(false);
	};
	Eventable.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.isAttachedWithEvents;
		if (this.tainted && this.tainted.length > 0) {
			this.untaint();
			delete this.tainted;
		}
		delete this.appEvents;
	};
	Eventable.prototype.emptyEventFunction = function(){};
	Eventable.prototype.taint = function(list) {
		this.tainted = list;
		var eventlist = {}, i, len = list.length;
		for (i = 0; i < len; i++) {
			//Do not taint function that are defined in our domain
			if (this.appEvents[list[i]]) continue;
			this.appEvents[list[i]] = {
				name: list[i],
				func: this.emptyEventFunction,
				attached: false
			};
		}
	};
	Eventable.prototype.untaint = function() {
		var i;
		for (i = 0; i < this.tainted.length; i++ ) {
			delete this.appEvents[this.tainted[i]];
		}
	}
	return Eventable;
});
