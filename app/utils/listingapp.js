define(['oop/inherit', 'utils/visualapp', 'model/listmodel2', 'view/mosaicpresentation', 'shims/bind',
// 'net/simplexhr',
'data/static-strings', 'transport/request', 'transport/response',
'json/json'], 
function(inherit, VisualApp, ListModel, MosaicPresentation, bind, strings, request, response, json) {
	var ListApp = function(options) {
		VisualApp.call(this, options);
		this.numericTimeout_ = null;
		this.selectChannelIndex = '';
		if(options.datamodel) {
			this.model = new options.datamodel(this);
		} else {
			this.model = new ListModel(this);
		}
		this.presentation = new MosaicPresentation(this, options.listType, options.itemWidth, options.itemHeight, options.shouldJump);
		this.canResume = options.canResume;
		this.registerDisposable(this.model);
		this.registerDisposable(this.presentation);
		this.generateDefaultEvents();
		this.appEvents.play = {
			name : 'play',
			func : bind(this.handlePlayButton, this),
			attached : false
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
	ListApp.remoteKeys_ = ['left', 'right', 'up', 'down', 'chup', 'chdown', 'ok', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'return'];
	ListApp.prototype.onShowComplete = function() {
		this.attachEvents(true);
	};
	ListApp.prototype.onPlayRequest = function(resume) {
		tui.globalPlayer.play(this.model.getItem(), resume);
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
		if(data.type === 'list') {
			this.fire('start-ready');
		} else if(data.type === 'folder') {
			this.presentation.show(undefined, true);
			if( typeof data.index !== 'undefined')
				this.presentation.activate(data.index);
			else if (this.model.pointer.length > 1)
				this.presentation.activate(1);
		}
	};
	ListApp.prototype.onShowScreen = function() {
		this.presentation.show(this.container);
	};
	ListApp.numerics_ = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	ListApp.prototype.defaultRemoteKeyHandler = function(key) {
		if(ListApp.numerics_.indexOf(key) !== -1) {
			this.handleNumerics(key);
		} else {
			if(this.numericTimeout_ !== null) {
				window.clearTimeout(this.numericTimeout_);
				this.numericTimeout_ = null;
				this.selectChannelIndex = '';
			}
			this.model.acceptEvent({
				type : 'remote',
				action : key
			});
		}
	};
	ListApp.prototype.handleNumerics = function(digit) {
		var nDigit = ListApp.numerics_.indexOf(digit);
		window.clearTimeout(this.numericTimeout_);
		this.selectChannelIndex += nDigit.toString();
		tui.osdInstance.setContent(this.selectChannelIndex, 3);
		this.numericTimeout_ = window.setTimeout(bind(this.goToChannel, this), 3000);
	};
	ListApp.prototype.goToChannel = function(channelIndex) {

		console.log('Executing timeout');
		var find = this.selectChannelIndex;
		this.selectChannelIndex = '';
		this.numericTimeout_ = null;
		var data = this.model.get();
		var i;
		for( i = 0; i < data.length; i++) {
			if(data[i].id == find) {
				this.model.selectByIndex(i);
				this.fire('try-play', this.model.getItem());
				break;
			}
		}
	};
	ListApp.prototype.defaultStartRequested = function() {
		if(!this.model.isLoaded) {
			this.model.loadData({
				name : this.name,
				type : 'list'
			});
		} else {
			this.fire('start-ready');
		}
	};
	//Add default events for mosaic, can be then overwritten by children
	ListApp.prototype.generateDefaultEvents = function(list, boundFunction) {
		if(!this.appEvents)
			this.appEvents = {};
		if(!list)
			list = ListApp.remoteKeys_;
		if(!boundFunction)
			boundFunction = bind(this.defaultRemoteKeyHandler, this);
		list.forEach(bind(function(item) {
			this.appEvents[item] = {
				name : item,
				func : boundFunction,
				attached : false
			};
		}, this));
	};
	ListApp.prototype.handlePlayButton = function() {
		var objIndex = this.model.currentIndex;
		var item = this.model.getItem(objIndex);
		var options = [];
		var actions = [];
		if (this.canResume === true) {
			options.push(strings.lists.resumePlay);
			actions.push('resume');
		}
		if(item.isBookmarked) {
			options.push(strings.lists.unbookmark);
			actions.push('unbookmark');
		} else {
			options.push(strings.lists.bookmark);
			actions.push('bookmark');
		}
		if(item.rating !== 'X') {
			if(item.isLocked) {
				options.push(strings.lists.unlock);
				actions.push('unlock');
			} else {
				options.push(strings.lists.lock);
				actions.push('lock');
			}
		}
		options.push(strings.components.dialogs.cancel);
		this.dialogInstance = {
			index : objIndex,
			object : item,
			options : options,
			actions : actions
		};
		tui.createDialog('optionlist', this.dialogInstance.options, bind(this.handleDialogSelection, this), strings.components.dialogs.select);
	};
	ListApp.prototype.handleDialogSelection = function(selectedIndex) {
		var action;
		if(this.dialogInstance) {
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
				case 'resume':
					this.fire('try-play', true);
					this.dialogInstance = null;
					delete this.dialogInstance;
					break;
					
			}
		}
	};
	ListApp.prototype.acceptPass = function(val) {
		var urlconf = tui.options.paths.getPath(this.dialogInstance.action);
		var url = {
			'run' : urlconf.run,
			'sig' : urlconf.sig,
			'type' : this.name.toUpperCase(),
			'id' : this.dialogInstance.object.id,
			'newif': 1
		};
		if(['lock', 'unlock'].indexOf(this.dialogInstance.action) !== -1) {
			url["password"] = val;
		}
		var req = request.create('calld', url);
		response.register(req, bind(this.handleUpdate, this, this.dialogInstance.index, this.dialogInstance.action));
		req.send();
		this.dialogInstance.object = null;
		delete this.dialogInstance;
	};
	ListApp.prototype.handleUpdate = function(index, action, result) {
		var obj = this.model.getItem(index);
		var status = json.parse(result.content);
		if(status && status.status === 'OK') {
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
			tui.createDialog('optionlist', [strings.components.dialogs.ok], function() {
			}, strings.lists.actionFailed);
		}

	};
	ListApp.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.appEvents;
		delete this.numericTimeout_;
	};
	return ListApp;
});
