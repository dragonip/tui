// Here we will work differently, just fire the events from remote to the main 



(function() {
	var APPNAME = 'Tetris';
	
	var LeftOffset = ((window.innerWidth / 2) - 150) + 'px';
	
//	function go_up() {
//		var myurl = 'http://' + window.location.host + window.location.pathname.replace(APPNAME, 'Games');
//		window.location.assign(myurl);
//	}
	
	var WrapKeys = (function(){
		var directions = {
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		return function(dir) {
			KeyDown(directions[dir]);
		};
	})();
	
	window.ShowMessage = function(message) {
		var a = document.createElement('div');
		a.setAttribute('class','blocking_message');
		a.innerHTML = 'You\'ve got a score of ' + message + '<br>Press Play to play again.<br>Press Return to go back to the list of games or Home to go back to main menu';
		a.style.left = LeftOffset;
		document.querySelector('body').appendChild(a);
		
	}
	function handlePlay() {
		if (IsOver && document.querySelector('.blocking_message') !=  null) {
			document.querySelector('.blocking_message').parentNode.removeChild(document.querySelector('.blocking_message'));
			Init(true);
		}
	}
	var knownKeys = ['up', 'down', 'left', 'right', 'play'];
	window.remoteEvent = function(key) {
		console.log('Remote event received in frame');
		if (knownKeys.indexOf(key)!== -1) {
			if (key === 'play') {
				handlePlay();
			} else {
				WrapKeys(key);
			}
		}
	};

//	window.Init(true);
	window.onload = function() {window.Init(true);}
//	var App = {
//		appEvents: {},
//		Grab: [Dispatcher],
//		constructEvents: function() {
//			//instead of writing all events manually, use cycle when the handler is same
//			var keys = ['left', 'right', 'down', 'up'];
//			var i;
//			for (i = 0; i < keys.length; i++) {
//				this.appEvents[keys[i]] = {
//					name: keys[i],
//					func: WrapKeys,
//					attached: false
//				};
//			}
//			/*this.appEvents.okButton = {
//				name: 'ok',
//				func: ShowMessage,
//				attached: false
//			};*/
//			this.appEvents.playButton = {
//				name: 'play',
//				func: handlePlay,
//				attached: false
//			};
//			this.appEvents.homeButton = {
//				name: 'home',
//				func: function() {
//					if (window.location.host.indexOf('sysmaster') != -1) {
//						alert('app://close_youtube');
//					}
//					else {
//						Utils.goHome();
//					}
//				},
//				attached: false
//			};
//			this.appEvents.ret = {
//				name: 'return',
//				func: go_up,
//				attached: false
//			};
//		},
//		init: function() {
//			this.constructEvents();
//			window.Init(true);
//			this.addCustomHandlers(this.appEvents);
//		}
//	};		
//	App.Start();
})();
