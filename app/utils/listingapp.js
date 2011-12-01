define([
	'oop/inherit',
	'utils/visualapp',
	'model/listmodel2',
	'view/mosaicpresentation',
	'shims/bind',
	'net/simplexhr',
	'data/static-strings'
], function(inherit, VisualApp, ListModel, MosaicPresentation, bind, xhr, strings) {
	var ListApp = function(options) {
		VisualApp.call(this, options);
		if (options.datamodel) {
			this.model = new options.datamodel(this)
		} else {
			this.model = new ListModel(this);	
		}
		this.presentation = new MosaicPresentation(this, options.listType, options.itemWidth, options.itemHeight, options.shouldJump );
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
		this.on('try-play', this.onPlayRequest);
	};
	inherit(ListApp, VisualApp);
	ListApp.remoteKeys_ = ['left', 'right', 'up', 'down', 'chup', 'chdown', 'ok'];
	ListApp.prototype.onShowComplete = function() {
		this.attachEvents(true);
	};
	ListApp.prototype.onPlayRequest = function() {
		tui.globalPlayer.play(this.model.getItem());
	};
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
			this.presentation.show(undefined, true);
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
	ListApp.prototype.generateDefaultEvents = function(list, boundFunction) {
		if (!this.appEvents) this.appEvents = {};
		if (!list) list = ListApp.remoteKeys_;
		if (!boundFunction) boundFunction = bind(this.defaultRemoteKeyHandler, this);
		list.forEach(bind(function(item){
			this.appEvents[item] = {
				name: item,
				func: boundFunction,
				attached: false
			};
		}, this));
	};
	ListApp.prototype.handlePlayButton = function() {
		var objIndex = this.model.currentIndex;
		var item = this.model.getItem(objIndex);
		var options = [];
		var actions = [];
		if (item.isBookmarked) {
			options.push(strings.lists.unbookmark);
			actions.push('unbookmark');
		} else {
			options.push(strings.lists.bookmark);
			actions.push('bookmark');
		}
		if (item.rating !== 'X') {
			if (item.isLocked) {
				options.push(strings.lists.unlock);
				actions.push('unlock');
			} else {
				options.push(strings.lists.lock);
				actions.push('lock');
			}
		}
		options.push(strings.components.dialogs.cancel);
		this.dialogInstance = {
			index: objIndex,
			object: item,
			options: options,
			actions: actions
		};
		tui.createDialog('optionlist', this.dialogInstance.options, bind(this.handleDialogSelection, this), strings.components.dialogs.select);
	};
	ListApp.prototype.handleDialogSelection = function(selectedIndex) {
		var action;
		if (this.dialogInstance) {
			this.dialogInstance.action = this.dialogInstance.actions[selectedIndex];
			switch (this.dialogInstance.action) {
				case 'lock':
				case 'unlock':
					tui.createDialog('password', true, bind(this.acceptPass, this), strings.components.dialogs.lock);
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
