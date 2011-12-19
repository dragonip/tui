define([
	'transport/request',
	'transport/response',
	'shims/bind',
	'data/static-strings',
	'utils/events'
], function(request, response, bind, strings, events) {
	/**
	* Global player object to handle all playback in DSP
	* @consructor
	*/
	var Player = function() {
		this.state = Player.STATES.STOPPED;
		this.keyHandler = bind(this.handleKeys, this);
		this.timeout_ = null;
		this.history_ = null;
		this.current_ = null;
		this.playlist_ = null;
		this.shufflePlayList_ = false;
	};
	Player.prototype.parentalPassword = '';
	/**
	* Internal player statuses, translated from DSP signals
	* @define
	* @static
	* @private
	*/
	Player.STATES = {
		STOPPED: 0,
		PLAYING: 1,
		PAUSED: 2
	};
	/**
	* The strings returned by transport layer as player status
	* @define
	* @static
	* @private
	*/
	Player.dspStates = {
		stopped: Player.STATES.STOPPED,
		started: Player.STATES.PLAYING,
		finished: Player.STATES.STOPPED,
		nodata: Player.STATES.STOPPED,
		paused: Player.STATES.PAUSED,
		unpaused: Player.STATES.PLAYING,
		buffering: Player.STATES.PLAYING,
		playing: Player.STATES.PLAYING,
		error: Player.STATES.STOPPED
	};
	Player.prototype.audioPlayerSetup = function(options) {
		this.audioPlayerState = options.status;
		
	};
	Player.prototype.autioPlayerUpdate = function(options) {
		
	};
	Player.prototype.setOSDState = function(state) {
		var item = this.current_[0], id = '';
		if (item.id.length < 5)
			id = '[' + item.id + '] ';
		switch (state) {
			case 'started':
			case 'playing':
				tui.osdInstance.setContent(strings.player.states.playing + id + item.publishName, 5, 'play');
				break;
			case 'buffering':
				tui.osdInstance.setContent(strings.player.states.buffering + id +  item.publishName, 5, 'buffering');
				break;
			case 'paused':
				tui.osdInstance.setContent(strings.player.states.paused, 5, 'pause');
		}
	};
	/**
	* Sets the current status of the player, act on change
	* @private 
	* @param {Player.dspStates.*} state A state representation from DSP 
	*/
	Player.prototype.setState = function(state) {
		var old_state = this.state;
		this.setOSDState(state);
		this.state = Player.dspStates[state];
		console.log('**************PLAYER STATE UPDATE : ' + this.state);
		if (old_state !== this.state) {
			if (this.state === Player.STATES.STOPPED) {
				tui.signals.restoreEventTree();
			} else if (this.state === Player.STATES.PLAYING) {
				tui.stealEvents(this.keyHandler);
			}
		}
	};

	Player.fastSwitchKeys = ['zero', 'one','two','three','four','five','six','seven','eight','nine'];
	/**
	* Handler for the remote events when they are routed to the played (i.e. state is playing/paused)
	* @param {!String} key The remote key issued in remote/kbd
	*/
	Player.prototype.handleKeys = function(key) {
		if (Player.fastSwitchKeys.indexOf(key)!==-1) {
			events.defaultEventAccepter(key);
		}
		switch (key) {
			case 'up':
			case 'down':
				if (key === 'up') {
					tui.currentActiveApp.model.activatePreviousItem();
				} else {
					tui.currentActiveApp.model.activateNextItem();
				}
				if (this.timeout_ !== null) {
					window.clearTimeout(this.timeout_);
				}
				this.timeout_ = window.setTimeout(function() { 
					tui.currentActiveApp.fire('try-play', tui.currentActiveApp.model.getItem());
				}, 500);
				break;
			case 'stop':
				this.stop();
				break;
			case 'play':
				this.pause();
				break;
			case 'display':
				if (this.state !== Player.STATES.STOPPED) {
					tui.signals.restoreEventTree();
				}
				break;
			case 'recall':
				this.alterChannels();
				break;
			case 'power': 
//				var DEBUG = document.createElement('div');
//				var log = '';
//				for (var i = 0; i < this.log.length; i++) {
//					log += this.log[i];
//					log += '<br>';
//				}
//				DEBUG.innerHTML = log;
//				DEBUG.style.position = 'absolute',
//				DEBUG.style.top = 0;
//				DEBUG.style.width = '640px';
//				DEBUG.style.height = '480px';
//				DEBUG.style.left = 0;
//				DEBUG.style.backgroundColor = 'black';
//				document.body.appendChild(DEBUG);
				break;
			case 'rec':
				this.record();
			default:
//				console.log('This is the player now accepting all events');
				return;
		}
	};
	Player.prototype.defaultRecordingPath = '/mnt/usb/';
	Player.prototype.pathSeparator = '/';
	Player.prototype.record = function(AVObject) {
		if (!AVObject) {
			object = this.current_[0];
		} else {
			object = AVObject;
		}
		if (object.personalRecordingOptions && object.personalRecordingOptions.canRecord) {
			var now = new Date();
			var path = this.defaultRecordingPath + now.getFullYear();
			path += this.pathSeparator;
			path += (now.getMonth() + 1);
			path += this.pathSeparator;
			path += now.getDate();
			path += this.pathSeparator;
			path += object.publishName;
			path += this.pathSeparator;
			path += (now.getHours() + ':' + now.getMinutes());
			path += this.pathSeparator;
			console.log('Configured path', path);
		//
		// var newreq = request.create('record',{
		// 	'status':'start',
		// 	'path': path
		// });
		// 
		} else {
			return;
		}
	};
	Player.prototype.alterChannels = function() {
		console.log(JSON.stringify(this.history_));
		if (this.history_ && this.history_.length === 2) {
			this.stop();
			this.play.apply(this, this.history_);
		}
	};
	/**
	* Returns the current state, should be compared to Player.STATES
	* @return {Player.STATES.!}
	*/
	Player.prototype.getState = function() {
		return this.state;
	};
	Player.prototype.playAll = function(dataSource, shuffle) {
		this.playlist_ = dataSource;
		this.shufflePlayList_ = shuffle;
	};
	/**
	* Try to play object from listings
	* @param {Object} obj A channel/Video/Audio object with playURI property
	* @param {?String} password The password the user has enetered when queried about the parental lock pass
	*/
	Player.prototype.play = function(obj, resume, password) {
		console.log('Try to play uri: '+ obj.playURI + ' , pass:' + password);
		if (obj.isLocked) {
			//Prevent event stealing, set state manually so that when the event comes it 
			//does not restore the event handler but leave it to the lock screen
			if (this.state !== Player.STATES.STOPPED) {
				this.state = Player.STATES.STOPPED;
				this.stop();
			}
			if (this.parentalPassword === '') {
				var newreq = request.create('calld', {
					run: 'get_cfgval_json',
					section: 'streaming',
					'var': 'lockpass'
				});
				response.register(newreq, bind(this.setParentalPass, this));
				newreq.send();
			}
			if (typeof password !== 'string') {
				tui.createDialog('password', true, bind(this.play, this, obj, resume), strings.components.dialogs.lock);
				return;
			}
			else if ( password !== this.parentalPassword ) {
				tui.createDialog('optionlist', [strings.components.dialogs.ok], function(){}, strings.components.dialogs.wrongPassword);
				return;
			}
		}
		var play_command = (obj.player ? 'play_youtube':'play');
		this.addToHistory( [obj, password] );
		var newreq = request.create(play_command, {"url": obj.playURI, 'resume': resume});
		response.register(newreq, bind(this.requestResultHandle, this, obj.publishName, 'play') );
		newreq.send();
	};
	Player.prototype.addToHistory = function(newSet) {
		this.history_ = this.current_;
		this.current_ = newSet;
	};
	/**
	* Set the parent lock password to the one provided by the backend
	* @private
	* @param {Object} obj Object containting the content returned and the status
	*/
	Player.prototype.setParentalPass = function(obj) {
		if (obj.content) {
			this.parentalPassword = obj.content;
		}
	};
	/**
	* Check status and if it is different from internal stopped, attempt stop signal on transport layer
	*/
	Player.prototype.stop = function() {
//		if (this.state !== Player.STATES.STOPPED) {
			var newreq = request.create('stop', {});
			newreq.send();
//		}
	};
	/**
	* Handle pause / unpause
	*/
	Player.prototype.pause = function() {
		var newreq = request.create('pause',{ });
		newreq.send();

	};
	/**
	* Handle for the request result (i.e. transport layer debug, no useful application yet)
	* @param {JSONObject} data The data returned by transport layer response
	*/
	Player.prototype.requestResultHandle = function(title, icon) {
		tui.osdInstance.setContent(strings.player.states.starting + title, 10, icon);
	};
	/**
	* Handles the events coming from transport layer communication, called via tui.globalPlayer.handleEvent, no need for context
	* @param {JSONObject} JSONObj The event object comming from transport layer ({event>state}-the player state)
	*/
	Player.prototype.handleEvent = function(JSONObj) {
		switch (JSONObj['header']['method']) {
		case 'media':
			this.setState(JSONObj.event.state);
			break;
		case 'player':
			this.handlePlaybackInfo(JSONObj['event']);
		}
	};
	Player.prototype.handlePlaybackInfo = function(event) {
		var audio = event['has_audio'] || false;
		var video = event['has_video'] || false;
		//Handle this further
	};
	
	return Player;
});
