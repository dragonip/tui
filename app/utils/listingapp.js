define([
	'oop/inherit',
	'utils/visualapp',
	'model/listmodel',
	//'view/listpresentation',
	'view/mosaicpresentation'
], function(inherit, VisualApp, ListModel, MosaicPresentation) {
	var ListApp = function(options) {
		VisualApp.call(this, options);
		this.model = new ListModel(this);
		//this.presentation = options.listType && options.listType === 'list'? new ListPresentation(this) : new MosaicPresentation(this);
		this.presentation = new MosaicPresentation(this);
		this.registerDisposable(this.model);
		this.registerDisposable(this.presentation);
		this.generateDefaultEvents();
		this.on('start-requested', this.defaultStartRequested);
		this.on('show-requested', this.onShowScreen);
		this.on('selection-changed', this.onSelectionChanged);
		this.on('show-complete', this.onShowComplete);
		this.on('stop-requested', this.onStopRequested);
		this.on('data-load-end', this.onDataLoadEnd);
	};
	inherit(ListApp, VisualApp);
	ListApp.remoteKeys_ = ['left', 'right', 'up', 'down', 'chup', 'chdown', 'ok'];
	ListApp.prototype.onShowComplete = function() {
		this.attachEvents(true);
	}
	ListApp.prototype.onSelectionChanged = function(objectWithIndex) {
		console.log('Calling original onSelectionChanged methos in ListApp')
		this.model.currentIndex = objectWithIndex.index;
	};
	ListApp.prototype.onStopRequested = function() {
		this.model.unload();
		this.presentation.unload();
		this.attachEvents(false);
	};
	ListApp.prototype.onDataLoadEnd = function(data) {
		if (data.type === 'list') {
			this.fire('start-ready');
		} else if (data.type === 'folder') {
			this.presentation.show();
			if (typeof data.index !== 'undefined') this.presentation.activate(data.index);
		}
	};
	ListApp.prototype.onShowScreen = function() {
		this.presentation.show(this.container);
	}
	ListApp.prototype.defaultRemoteKeyHandler = function(key) {
		console.log('Caller default handler in listingapp');
		console.log(this);
		this.model.acceptEvent({
			type: 'remote',
			action: key
		});
	};
	ListApp.prototype.defaultStartRequested = function() {
		if (!this.model.isLoaded) {
			this.model.loadData({
				name: this.name,
				type: 'list'
			});
		} else {
			this.fire('start-ready');
		}
	};
	//Add default events for mosaic, can be then overwritten by children
	ListApp.prototype.generateDefaultEvents = function() {
		this.appEvents = {};
		ListApp.remoteKeys_.forEach(function(item){
			this.appEvents[item] = {
				name: item,
				func: this.defaultRemoteKeyHandler.bind(this),
				attached: false
			};
		}.bind(this));
	};
	ListApp.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
	};
	return ListApp;
});
