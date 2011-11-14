define([
	'oop/inherit',
	'utils/visualapp',
	'model/listmodel',
	//'view/listpresentation',
	'view/mosaicpresentation',
	'shims/bind',
	'net/simplexhr'
], function(inherit, VisualApp, ListModel, MosaicPresentation, bind, xhr) {
	var ListApp = function(options) {
		VisualApp.call(this, options);
		this.model = new ListModel(this);
		this.presentation = new MosaicPresentation(this, options.listType, undefined, undefined, true );
		this.registerDisposable(this.model);
		this.registerDisposable(this.presentation);
		this.generateDefaultEvents();
		this.appEvents['play'] = {
			name: 'play',
			func: bind(this.handlePlayButton, this),
			attached: false
		};
		this.setFive= function(){this.presentation.activate(5-1);};
		this.appEvents['five'] = {
			name: 'five',
			func: bind(this.setFive, this),
			attached: false
		};

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
		ListApp.remoteKeys_.forEach(bind(function(item){
			this.appEvents[item] = {
				name: item,
				func: bind(this.defaultRemoteKeyHandler, this),
				attached: false
			};
		}, this));
	};
	ListApp.prototype.handlePlayButton = function() {
		var objIndex = this.model.currentIndex;
		var item = this.model.getItem(objIndex);
		var options = [];
		if (item.isBookmarked) {
			options.push('Unbookmark');
		} else {
			options.push('Bookmark');
		}
		if (item.isLocked) {
			options.push('Unlock');
		} else {
			options.push('Lock');
		}
		options.push('Cancel');
		this.dialogInstance = {
			index: objIndex,
			object: item,
			options: options
		};
		tui.createDialog('optionlist', this.dialogInstance.options, bind(this.handleDialogSelection, this), 'Select action');
	};
	ListApp.prototype.handleDialogSelection = function(selectedIndex) {
		var action;
		if (this.dialogInstance) {
			this.dialogInstance.action = this.dialogInstance.options[selectedIndex].toLowerCase();
			switch (this.dialogInstance.action) {
				case 'lock':
				case 'unlock':
					tui.createDialog('password', true, bind(this.acceptPass, this), 'Enter lock password');
					break;
					
				case 'bookmark':
				case 'unbookmark':
					this.acceptPass();
					break;
			}
		}
	};
	ListApp.prototype.acceptPass = function(val) {
		var url = tui.options.paths.getPath(this.name, this.dialogInstance.action) + '&id='+this.dialogInstance.object.id;
		if (['lock','unlock'].indexOf(this.dialogInstance.action)!== -1){
			url = url + '&password=' + val;
		}
		xhr.get(url, bind(this.handleUpdate, this, this.dialogInstance.index, this.dialogInstance.action), {
			parse: true
		});
		this.dialogInstance.object = null;
		delete this.dialogInstance;
	};
	ListApp.prototype.handleUpdate = function(index, action, result) {
		console.log(arguments);
		var obj = this.model.getItem(index);
		if (result && result.status === 'OK') {
			switch (action) {
				case 'lock':
				case 'unlock':
					obj.isLocked = !obj.isLocked;
					break;
				case 'bookmark':
				case 'unbookmark':
					obj.isBookmarked = !obj.isBookmarked;
					break;
			}
			this.presentation.updateItem(index, obj);
		} else {
//			TODO: display error messsage when action on object did not success
		}
	}
	ListApp.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.appEvents;
	};
	return ListApp;
});
