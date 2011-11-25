/**
 * NATIVESMJS wrapper, i.e. we will provide 1:1 interface for browser as the one we have in STB
 * @module smjs DOCS COMMING SOON Wrapper for the native code implementation in the STBs, wraps most of the commands to make them work in browser environemtn where smjs C code is not available
 */
define(['window/window', 'net/socket'], function(windows, socket) {
//	Use this to specify the global transport entry point, used only in emulated environment
	var defaultTransport_ = window.transportReceiver;
	if (typeof window.smjs != 'undefined') {
		document.querySelector('html').className='m55';
		return window.smjs;
	} else {
		document.querySelector('html').className='browser';
		windows.create('app/support/remote.html');
		window.smjs = {
			socket: null,
			set_json_handler: function(string) {
				this.socket.send('{ "header" : { "transport":"socket", "mode":"async", "method":"set_global_callback", "type":"request", "tag":"0000" }, "request": { "name": "'+ string +'" } }') 
	
			},
			emulated: true,
			initapi: function(){
				console.log('Init API');
			}
		};
		window.smjs.socket = socket.create('ws://192.168.2.64:7681', 'stb-json-protocol', defaultTransport_);
		window.smjs.jsoncmd = function(JSONString) {
			if (this.socket !== null) {
				this.socket.send(JSONString);
			} else {
				console.log('No socket created');
			}
		}
		return window.smjs;
	}
});
//		
//		window.smjs = (function() {
//			var STORAGE = {};
//			var smjs = {};
//			smjs.emulated = true;
//			smjs.initapi = function () {};
//			smjs.getSerialNumber = function () {
//				return 'RuN1N6!NBR0WZ3R';
//			};
//			//Sync file getter, will not work cross domain, we will proxy this via node in future
//			//Also conider flash getter
//			smjs.url_get = function (url) {
//				var req = new XMLHttpRequest();
//				req.open('GET', url, false);
//				req.send(null);
//				if (req.status == 200) {
//					return req.responseText;
//				}
//				else {
//					throw {
//						name: 'Network error',
//						message: 'Cannot get ' + url
//					};
//				}
//			};
//			smjs.onEvent = function (f) {};
//			smjs.onFirmwareEvent = function (f) {};
//			smjs.onMessageListenerEvent = function (f) {};
//			smjs.browseLocalDevice = function (f) {
//				throw {
//					name: 'System',
//					message: 'Local storage is not yet supported in Browser environment'
//				};
//			};
//			//
//			// console.log('Using summy function');
//			// 
//	/*	console.log('HUH?');
//				f = f.replace('/mnt/usb/', '');
//				console.log('1');
//				if (f === '') f = 'index';
//				console.log('2');
//				return dummyDevice[f];
//			};
//			*/
//			smjs.onHotplugEVenet = function (f) {}
//			smjs.getSubtitleIDList = function () {}
//			smjs.getSubtitleID = function () {}
//			smjs.setSubtitleID = function () {}
//			smjs.playYouTubeVideo = function (a) {}
//			smjs.play_youtube = function () {};
//			smjs.onKeyPress = function (f) {
//				if (typeof f === 'function') {
//					STORAGE.onKeyPressFunction = f;
//				}
//				else {
//					delete STORAGE.onKeyPressFunction;
//				}
//			};
//			var digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
//			var kbdInputsMap = function (code) {
//				if (code >= 48 && code <= 57) {
//					return digits[code - 48];
//				}
//				switch (code) {
//				case 8:
//					//backspace
//					return 'return';
//				case 37:
//					return 'left';
//				case 38:
//					return 'up';
//				case 39:
//					return 'right';
//				case 40:
//					return 'down';
//				case 13:
//					return 'ok';
//				case 73:
//					return 'info';
//				case 36:
//					return 'home';
//				case 33:
//					// page up
//					return 'chup';
//				case 34: 
//					// page down
//					return 'chdown';
//				case 77:
//					//m
//					return 'mute';
//				case 67:
//					//c used as re-C-all
//					return 'recall';
//				case 80:
//					//p for play/pause
//					return 'play';
//				case 83:
//					//s for stop
//					return 'stop';
//				case 68:
//					//d for display
//					return 'display';
//				default:
//					//log the codes we do not track
////					console.log('Keyboard key not bound to remote key, keyboard key hase code :', code);
//					return;
//				}
//			};
//			window.addEventListener('keydown', function (ev) {
//				// allow the Crtl+R reload
//				if (ev.keyCode == 82 && ev.ctrlKey) {
//					return;
//				}
//				ev.preventDefault();
//				ev.stopPropagation();
//				if (STORAGE.onKeyPressFunction) {
//					STORAGE.onKeyPressFunction(kbdInputsMap(ev.keyCode));
//				}
//			}, false);
//			smjs.play = function () {return 0;}
//			smjs.pause = function () {return 0;}
//			smjs.stop = function () {return 0;}
//			smjs.resume = function () {return 0;}
//			smjs.setPosition = function () {}
//			smjs.getPosition = function () {}
//			smjs.getStreamDuration = function () {}
//			smjs.upgrade = function () {}
//			smjs.getStorageValue = function () {}
//			smjs.setStorageValue = function () {}
//			smjs.loadURL = function () {}
//			smjs.closeNavigationWindow = function () {}
//			smjs.getSTBModel = function () {}
//			smjs.getSoftwareBuildTime = function () {}
//			smjs.getDate = function () {}
//			smjs.getSoftwareVersion = function () {}
//			smjs.getSoftwareBootloaderVersion = function () {}
//			smjs.getPowerMode = function () {}
//			smjs.setPowerMode = function () {}
//			smjs.getTimeZone = function () {}
//			smjs.setTimeZone = function () {}
//			smjs.setSubtitleLanguage = function () {}
//			smjs.removeSubtitles = function () {}
//			smjs.addSubtitleURL = function () {}
//			smjs.setSubtitleURL = function () {}
//			smjs.unsetSubtitleURL = function () {}
//			smjs.setSubtitleEncoding = function () {}
//			smjs.getSubtitleURL = function () {}
//			smjs.clearSubtitleURL = function () {}
//			smjs.getStreamVideoInformation = function () {}
//			smjs.getStreamAudioInformation = function () {}
//			smjs.setVideoSize = function () {}
//			smjs.getVideoSize = function () {}
//			smjs.setAspectRatio = function () {}
//			smjs.getAspectRatio = function () {}
//			smjs.setScreenMode = function () {}
//			smjs.getScreenMode = function () {}
//			smjs.setOutputResolution = function () {}
//			smjs.getOutputResolution = function () {}
//			smjs.getAlpha = function () {}
//			smjs.setAlpha = function () {}
//			smjs.isMacrovisionEnabled = function () {}
//			smjs.setChromaKey = function () {}
//			smjs.getChromaKey = function () {}
//			smjs.setUI3D = function () {}
//			smjs.getVolume = function () {}
//			smjs.setVolume = function () {}
//			smjs.isMute = function () {}
//			smjs.setMute = function () {}
//			smjs.setAudioDualMonoMode = function () {}
//			smjs.getAudioDualMonoMode = function () {}
//			smjs.setDolbyDownmixMode = function () {}
//			smjs.getDolbyDownmixMode = function () {}
//			smjs.setDolbyDRCMode = function () {}
//			smjs.getDolbyDRCMode = function () {}
//			smjs.getPlayingFilePosition = function () {}
//			smjs.getStorageState = function () {}
//			smjs.debugMsg = function (a, b, c) {};
//			smjs.setDebugLevel = function (a) {};
//			smjs.setSyslogServer = function (a, b) {};
//			smjs.reboot = function () {};
//			smjs.startMessageListener = function (a) {}
//			smjs.stopMessageListener = function () {}
//			// Implementation for browser
//			smjs.fireEvent = function (ev) {
//				if (onEventFunctionCall !== null) {
//					onEventFunctionCall(ev);
//				}
//			}
//			return smjs;
//		})();
//		return window.smjs;
//	}
//});
