define(['debug/console', 'dmc/dmc', 'utils/events'], function(logger, dmc, events) {
	var pcli = logger.getInstance('player'),
	STATES = {
		MEDIA_STARTED: 2000,
		MEDIA_FINISHED: 2001,
		MEDIA_STOPPED: 2002,
		MEDIA_NODATA: 2003,
		MEDIA_PAUSED: 2004,
		MEDIA_UNPAUSED: 2005,
		MEDIA_BUFFERING: 2006,
		MEDIA_PLAYING: 2007,
		MEDIA_STARTERROR: 2008
	}, currentlyPlayedObject = null, previousPlayedObject = null;
//	
//	function pushObject(avObject) {
//		if (!avObject.url) {
//			return false;
//		}
//		previousPlayedObject = currentlyPlayedObject;
//		currentlyPlayedObject = avObject;
//		return true;
//	}

	var Player = {
		pushObject: function(avObject) {
			if (!avObject.playURI) {
				return false;
			}
			previousPlayedObject = currentlyPlayedObject;
			currentlyPlayedObject = avObject;
			return true;
		},	
		play: function(obj) {
			if (this.pushObject(obj)) {
				pcli.log(['Playing object now!', obj.playURI, 'Result is:', dmc.play(obj.url)]);
				//dmc.play(obj.url);
			}
		},
		stop: function() {
			pcli.log(['Stopping player', dmc.stop()]);
			//dmc.stop();
		}
	};
	events.addHandlers({
		stop: {
			name: 'stop',
			func: Player.stop,
			attached: false
		},
		pause: {
			name: 'pause',
			func: function(){},
			attached:false
		}
	});
	return Player;
});
