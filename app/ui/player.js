define(['transport/request', 'transport/response', 'shims/bind'], function(request, response, bind) {
	/**
	* Global player object to handle all playback in DSP
	* @consructor
	*/
	var Player = function() {
		this.state = Player.STATES.STOPPED;
		this.keyHandler = bind(this.handleKeys, this);
	};
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
	/**
	* Sets the current status of the player, act on change
	* @private 
	* @param {Player.dspStates.*} state A state representation from DSP 
	*/
	Player.prototype.setState = function(state) {
		var old_state = this.state;
		this.state = Player.dspStates[state];
		if (old_state !== this.state) {
			if (this.state === Player.STATES.STOPPED) {
				tui.signals.restoreEventTree();
			} else if (this.state === Player.STATES.PLAYING) {
				tui.stealEvents(this.keyHandler);
			}
		}
	};
	/**
	* Handler for the remote events when they are routed to the played (i.e. state is playing/paused)
	* @param {!String} key The remote key issued in remote/kbd
	*/
	Player.prototype.handleKeys = function(key) {
		switch (key) {
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
			default:
//				console.log('This is the player now accepting all events');
				return;
		}
	};
	/**
	* Returns the current state, should be compared to Player.STATES
	* @return {Player.STATES.!}
	*/
	Player.prototype.getState = function() {
		return this.state;
	};
	/**
	* Try to play object from listings
	* @param {Object} obj A channel/Video/Audio object with playURI property
	*/
	Player.prototype.play = function(obj) {
		console.log('Try to play uri:', obj);
		var newreq = request.create('play', {url: obj.playURI});
//		response.register(newreq, bind(this.requestResultHandle, this) );
		newreq.send();
	};
	/**
	* Check status and if it is different from internal stopped, attempt stop signal on transport layer
	*/
	Player.prototype.stop = function() {
		if (this.state !== Player.STATES.STOPPED) {
			var newreq = request.create('stop', {});
//			response.register(newreq, bind(this.requestResultHandle, this) );
			newreq.send();
		}
	};
	/**
	* Handle pause / unpause
	*/
	Player.prototype.pause = function() {
//		if (this.state === Player.STATES.PAUSED) {
//			this.play();
//		} else {
			var newreq = request.create('pause',{ });
//			response.register(newreq, bind(this.requestResultHandle, this) );
			newreq.send();
//		}
	}
	/**
	* Handle for the request result (i.e. transport layer debug, no useful application yet)
	* @param {JSONObject} data The data returned by transport layer response
	*/
	Player.prototype.requestResultHandle = function(data) {
		console.log(data, this);
	};
	/**
	* Handles the events coming from transport layer communication, called via tui.globalPlayer.handleEvent, no need for context
	* @param {JSONObject} JSONObj The event object comming from transport layer ({event>state}-the player state)
	*/
	Player.prototype.handleEvent = function(JSONObj) {
		console.log("Received JSON Obj for event in player", JSONObj, this);
		this.setState(JSONObj.event.state);
	};
	
	return Player;
});
