define([
	'oop/inherit',
	'oop/idisposable',
	'utils/listingapp',
	'utils/epg'
], function(inherit, Disposable, ListApp, Epg){
	var App = function(opts){
		ListApp.call(this, opts);
		this.epgInstance = new Epg(this.model, ListApp.remoteKeys_);
		this.appEvents['info'] = {
			name: 'info',
			func: function() {
				if (this.epgInstance.isAttachedToDom()) {
					this.epgInstance.exitDom();
				} else {
					this.epgInstance.load();
					this.epgInstance.enterDom();					
				}
			}.bind(this),
			attached: false
		};
		//Override the OK event to handle EPG also
		this.appEvents['ok'] = {
			name: 'ok',
			func: function() {
				if (this.epgInstance.isAttachedToDom()) {
					this.epgInstance.attachEvents(true);
				} else {
					this.model.acceptEvent({
						action: 'ok'
					});
				}
			}.bind(this), 
			attached: false
		};
	};
	inherit(App, ListApp);
	App.prototype.onSelectionChanged = function(obj) {
		this.constructor.superClass_.onSelectionChanged.call(this, obj);
		if (this.epgInstance.attachedToDom_) {
			this.epgInstance.load(obj.index);
		}
	};
	
	App.prototype.defaultStartRequested = function() {
		this.constructor.superClass_.defaultStartRequested.call(this);
		if (this.model.data.epg === null) {
			this.model.loadData({
				name: this.name,
				type: 'epg'
			});
		}
	};
//	App.prototype.disposeInternal = function() {
//		this.constructor.superClass_.disposeInternal.call(this);
//	};
	
	return App;
	
});
