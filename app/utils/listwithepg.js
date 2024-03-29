define([
	'oop/inherit',
	'oop/idisposable',
	'utils/listingapp',
	'utils/epg',
	'shims/bind',
	'tpl/infobuttons'
], function(inherit, Disposable, ListApp, Epg,bind, infobuttonstpl){
	var App = function(opts){
		ListApp.call(this, opts);
		this.epgInstance = new Epg(this.model, ListApp.remoteKeys_);
		this.hints = opts.hints || null;
		this.appEvents['info'] = {
			name: 'info',
			func: bind(function() {
				if (this.epgInstance.isAttachedToDom()) {
					this.epgInstance.exitDom();
				} else {
					this.epgInstance.load();
					this.epgInstance.enterDom();					
				}
			},this),
			attached: false
		};
		//Override the OK event to handle EPG also
		this.appEvents['ok'] = {
			name: 'ok',
			func: bind(function() {
				if (this.epgInstance.isAttachedToDom()) {
					this.epgInstance.enterListing(true);
					this.epgInstance.attachEvents(true);
				} else {
					this.model.acceptEvent({
						action: 'ok'
					});
				}
			},this), 
			attached: false
		};
		this.on('show-complete', this.showHints);
	};
	inherit(App, ListApp);
	App.prototype.showHints = function() {
		if (this.hints) {
			tui.setPanels(false, true, undefined, infobuttonstpl.render({
				things: this.hints
			}));
		}
	};
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
	App.prototype.onStopRequested = function() {
		if (this.epgInstance.isAttachedToDom()) {
			this.epgInstance.exitDom();
		}
		App.superClass_.onStopRequested.call(this);
	};
	return App;
	
});
