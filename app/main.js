//(function() {
require.config({
	baseUrl: "app",
	paths: {
		"types": "../library/js/types",
		"window": "../library/js/window",
		"utils/autoid": "../library/js/utils/autoid",
		"templates/compiler": "../library/js/templates/compiler",
		"support": "../library/js/support",
		"shims": "../library/js/shims",
		"oop": "../library/js/oop",
		"nls": "../library/js/nls",
		"net": "../library/js/net",
		"json": "../library/js/json",
		"loader": "../library/js/loader",
		"host": "../library/js/host",
		"env/exports": "../library/js/env/exports",
		"dom": "../library/js/dom",
		"debug": "../library/js/debug",
		"array": "../library/js/array",
		"text": "../library/js/text"
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
//Requere the minimum set of dependencies and decorate the page with loading message

//Require the response first because it provides global function that will be called from player and should be defined when calling request or player
require(['transport/response'], function (response) {
	window.transportReceiver = function(j) {
		response.recall(j);
	};
});

/**
 * Require the interface now
 * Basically we want to load the minimum set first to assure user notification for loading and then load everything needed
 * to start processing the user input and display things on screen
 */
require(['ui/throbber'], function(t) {
	var options = {
		debug: true,
		nodejs: false,
		version: '0.1',
		useScale: false
	};
//	Fix the document dimenations and show loader first
	document.body.style.width = window.innerWidth + 'px';
	document.body.style.height = window.innerHeight + 'px';
	loadIndicator = {
		show: function(text) {
			t.start({
				element: document.body,
				text: text || 'Loading TUI...'
			});
		},
		hide: function() {
			t.stop();
		}
	};
	loadIndicator.show();
	
	
//	After we are done with the loader, require some helpers and the main event dispatcher and start building the app
	require([
		'utils/events', 
		'dom/classes', 
		'dom/dom', 
		'ui/popup', 
		'shims/bind', 
		'ui/player',
		'transport/response',
		'appdebug/preload',
		'utils/osd'
	], function(globalevents, classes, dom, Dialogs, bind, player, response, preloads, OSD ) {
//		Let the response handler for transport layer know where to direct key presses on the remote
		response.setRemoteKeyHandler(globalevents.defaultEventAccepter);
//		Load images offscreen after we have loaded the deps to avoid trapping the JS in the max Concurent Reqs of the browsser
		dom.adopt(dom.create('div', {
			classes: 'tui-component tui-preloader',
			html: '<img src="app/imgs/icon_set.png">'
		}));
//		Now, while the images are loading, create the TUI
//		Create the main container
		dom.adopt(dom.create('div', {
			id: 'maincontainer',
			style: 'height: ' + window.innerHeight + 'px; width: ' + window.innerWidth + 'px; margin-top: 0; margin-bottom: 0'
		}));
		var tNow = (new Date()).getTime();
		//Create the main Controller
		window.tui = {
			DATA_TS: {
				CONFIG: tNow,
				LISTS: tNow
			},
			signals: {
				listingApp: ['iptv', 'vod', 'ppv', 'aod', 'radio'],
				refreshConfig: function() {
					tui.DATA_TS.CONFIG = (new Date()).getTime();
					if (tui.currentActiveApp.name === 'setup') {
						tui.currentActiveApp.reload();
					}
				},
				refreshLists: function() {
					tui.DATA_TS.LISTS = (new Date()).getTime();
					if (this.listingApp.indexOf(tui.currentActiveApp.name) !== -1) {
						tui.appModuleAdded(tui.currentActiveApp);
					}
				},
				restoreEventTree: function() {
					response.setRemoteKeyHandler(globalevents.defaultEventAccepter);
					this.eventsAreFetched = false;
				},
				eventsAreFetched: false

			},
			osdInstance: new OSD(),
			keyboardIgnoredKeys: [34, 8, 46, 37, 38, 39, 40, 13, 36],
			defaultKeyboardInputHandler: function(ev) {
				console.log(String.fromCharCode(ev.charCode));
			},
			keyboardInputHandler_: function() {},
			resetKeyboardInputHandler: function() {
				this.keyboardInputHandler_ = this.defaultKeyboardInputHandler;
			},
			setKeyboardInputHandler: function(method) {
				this.keyboardInputHandler_ = method;
			},
			fastSwitchChannels: function(up_down) {
				if (up_down === 'down')
					this.currentActiveApp.model.activateNextItem();
				else 
					this.currentActiveApp.model.activatePreviousItem();
			},
			globalPlayer: new player(),
			mainContainer: dom.$('#maincontainer'),
			loadIndicator: loadIndicator,
			options: options,
			currentActiveApp: null,
			appRequested: false,
			appModuleAdded: function(app) {
				this.currentActiveApp = app;
				if (!window.exportedSymbols['appselector'].getState())
					app.Start();
			},
			systemConfirm: function(options) {
				// TODO: make those confirm panels work
				var header = options.header.html;
				this.rerouteEventsToPanel();
			},
			stealEvents: function(newManager) {
				response.setRemoteKeyHandler(newManager);
				this.signals.eventsAreFetched = true;
			},
			createDialog: function(type, options, callback, title, defaultOption ) {
				var dialog;
				if (type === 'optionlist') {
					dialog = new Dialogs.OptionList(type, options, callback, title, defaultOption);
				} else if (['input', 'password', 'text'].indexOf(type) !== -1  ) {
					dialog = new Dialogs.Text(type, options, callback, title);
				} else if (type === 'confirm') {
					dialog = new Dialogs.Confirm(type, true, callback, title);
				} else if (type === 'ip') {
					dialog = new Dialogs.IPBox(type, undefined, callback, title);
				} else if (type === 'message') {
					dialog = new Dialogs.MessageBox(type, title);
				}

				dialog.show();
				this.stealEvents(bind(dialog.eventHandler, dialog));
			},
			setPanels: function(top, bottom, opt_topContent, opt_bottomContent) {
				if (top) {
	//				if (opt_topContent) {
	//					this.panels.top.innerHTML = opt_topContent;
	//				}
					this.panels.top.style.top = '0px';
					this.mainContainer.style.marginTop = '60px';
				} else {
					this.panels.top.style.top = '-60px';
					this.mainContainer.style.marginTop = '0px';
					//this.panels.top.innerHTML = '';
				}
				if (bottom) {
					if (opt_bottomContent) {
						this.panels.infoBlock.innerHTML = opt_bottomContent;
					}
					this.panels.bottom.style.bottom = '0px';
					this.mainContainer.style.marginBottom = '60px';
				} else {
					this.panels.bottom.style.bottom = '-60px';
					this.mainContainer.style.marginBottom = '0px';
					this.panels.infoBlock.innerHTML = '';
				}
			},
			scaleContainer: function(bool) {
				if (bool) {
					//calculate for 20%
					if (this.options.useScale) {
						console.log('SET SCALE');
						this.mainContainer.className = 'scaled';
						var x = parseInt(this.mainContainer.style.width, 10);
						var y = parseInt(this.mainContainer.style.height, 10);
						var x1 = parseInt(((x * 20) / 100), 10);
						var y1 = parseInt(((y * 20) / 100), 10);
						var moveX = parseInt(x / 2, 10) - parseInt(x1 / 2, 10);
						//var moveY = parseInt(y/2) - parseInt(y1/2);
						var res = "scale(0.2) translateX(" + moveX * 5 + "px)"; //  + "translateY(-" + moveY * 5 + "px)"
						this.mainContainer.style.webkitTransform = res;
						this.mainContainer.style.MozTransform = res;
					} else {
						this.mainContainer.style.visibility = 'hidden';
					}
				} else {
					if (this.options.useScale) {
						this.mainContainer.className = '';
						this.mainContainer.style.MozTransform = 'scale(1)';
						this.mainContainer.style.webkitTransform = "scale(1)";

					} else {
						this.mainContainer.style.visibility = '';
					}
				}
			},
			setContainerVisibility: function(bool) {
				if (bool) {
					this.mainContainer.style.opacity = 0.2;
				} else {
					this.mainContainer.style.opacity = 1;
				}
			},
			apps: {
				signals: function(signaltype, opts) {
					switch (signaltype) {
					case 'ready':
						if (tui.currentActiveApp.name === opts.name) {
							tui.logger.log('my currentlyactve app is ready, time to hide the throbber and call draw on my app');
							tui.loadIndicator.hide();
							tui.setContainerVisibility(false);
							tui.currentActiveApp.Show(tui.mainContainer);
						}
						break;
					case 'restore-event-stack':
						tui.signals.restoreEventTree();
						break;
					default: 
						break;
					}
				}
			},
			loadApp: function(appobj) {
				this.loadIndicator.show('Loading ' + appobj.name + '...');
				if (this.currentActiveApp !== null) {
					if (typeof this.currentActiveApp.Pause === 'function') {
						this.currentActiveApp.Pause();
					} else {
						this.currentActiveApp.Stop();
					}
				}
				require([appobj.module], function(appmodule) {
					tui.appModuleAdded(appmodule);
				});
			}
		};
		
		
//		Setup global return key to check for the player and route to it 
//		This should be used when the user wants to use the UI while the player is playing, once done and he wants toLowerCase
//		return to the player, he presses return, if return is not bound in the UI (which it should not be)
//		the global return will hit, it will check if the player is active and reroute the events to it and hide the UI
		
		globalevents.addHandlers({
			globalreturn: {
				name: 'return',
				func: function() {
					if (tui.globalPlayer.getState() !== player.STATES.STOPPED) {
						tui.stealEvents(tui.globalPlayer.keyHandler);
					}
				},
				attached: false
			}//,
//			displaykey: {
//				name: 'display',
//				func: function() {
//					if (tui.signals.eventsAreFetched) {
//						if (tui.globalPlayer.getState() !== player.STATES.STOPPED) {
//							tui.signals.restoreEventTree();
//						}
//					}
//				}
//			}
		});

/**
 * Setup global window event for keyboard input and always route this to tui handlers
 */
		window.addEventListener('keypress', function(ev) {
			tui.keyboardInputHandler_(ev);
		}, false);
//		tui.setKeyboardInputHandler(function(ev){
//			console.log(String.fromCharCode(ev.charCode));
//		});
		window.addEventListener('keydown', function(ev) {
			var key;
			console.log(ev.keyCode);
			switch (ev.keyCode) {
				case 8:
					//backspace
					key = 'return';
					break;
				case 46:
					key = 'delete';
					break;
				case 37:
					key = 'left';
					break;
				case 38:
					key = 'up';
					break;
				case 39:
					key = 'right';
					break;
				case 40:
					key = 'down';
					break;
				case 13:
					key = 'ok';
					break;
				case 36:
					key = 'home';
					break;
				case 33:
					// page up
					key = 'chup';
					break;
				case 34: 
					// page down
					key = 'chdown';
					break;
				default:
					return;
			}
			window.transportReceiver({ 
		        "header": { 
		        "type": "event", 
		        "tag": "0000000000", 
		        "method": "remote", 
		        "tstamp": 1322144158.278165   
		        }, 
		        "event": { 
		            "key": key 
		        }    
		    });
		});
		if (tui.options.debug) {
			window.DEBUG = {
				popup: false
			};
		}
		//Self invoking with timeout function to update the clock every minute
		//TODO: Export it as it might need to be reset from the backend
		var updateClock = (function() {
			var clockElementRer = null;
			var timeout;
			function format(txt) {
				var mysecs = (txt % 60).toString();
				if (mysecs.length < 2) mysecs = "0" + mysecs;
				return mysecs;
			}
			return function(el) {
				if (el) clockElementRer = el;
				if (timeout) {
					clearTimeout(timeout);
				}
				var d = new Date();
				var timestring = d.getDate() + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear() + '&nbsp;' + d.getHours() + ':' + format(d.getMinutes());
				clockElementRer.innerHTML = timestring;
				timeout = setTimeout(updateClock, 60000);
			};
		})();


		
		tui.panels = {
			top: dom.create('div', {
				classes: 'tui-component panels top-panel',
				style: 'top : -60px;'
			}),
			bottom: dom.create('div', {
				classes: 'tui-component panels bottom-panel',
				style: 'bottom: -60px'
			})
		};
		//Setup clock 
		tui.panels.bottom.appendChild(dom.create('div', {
			html: '<h1></h1>',
			classes: 'tui-component tui-systemclock'
		}));
		//Start clock
		updateClock(dom.$('.tui-systemclock h1', tui.panels.bottom));		
		
		//Setup info block in panel
		tui.panels.infoBlock = dom.create('div', {
			classes: 'tui-component tui-infoblock'
		});
		tui.systemClock = updateClock;
		//Attach pannels
		dom.adopt(tui.panels.bottom, tui.panels.infoBlock);
		dom.adopt(tui.panels.top);
		dom.adopt(tui.panels.bottom);
		function preloadApps() {
			console.log(preloads);
			require(preloads.preloadsModules, function(varargs) {
				console.log('Modules loaded...');
			});
		}
		
		function loadTUI() {
			require(['ui/simplescreenselector'], function(Mappsel) {
				require(['transport/response'], function(response) {
//					window.transportReceiver = function(JSONString) {
//						response.recall(JSONString);
//					};
					require(['app/paths/jsonpaths.js', 'data/applist', 'ui/player', 'tpl/infobuttons', 'ui/telephone'], function(paths, apps, player, itpl, Phone) {
						tui.player = player;
						tui.options.paths = paths;
						tui.phone = Phone;
						preloadApps();
						console.log("we are ready, go now....");
						tui.loadIndicator.hide();						
//						Signal to backend that we are ready to receive signals
						alert("app://dmcready");
						tui.loadApp({
							name: 'Start',
							apptag: 'start',
							module: 'apps/start',
							icon: 'imgs/start_screen_icon.png'
						});
						tui.setPanels(false, true, false, itpl.render({
							things: {
								home: 'Select App'
							}
						}));
					});
				});

			});
		}
		//Request our logger utility and then the static loader
		require(['debug/console'], function(logger) { 
			tui.logger = logger.getInstance('main');
			tui.logger.log('Load the intrinsic loader now..');
			require(['loader/loader'], function(loader) {
				tui.logger.log(['Loaded intrinsic loader', 'Should switch to jquery and net/xrh to be browser independent']);
				loader.loadCSS(['app/css/reset.css', 'app/css/appselector3.css', 'app/css/infobuttons.css'], loadTUI);
			});
		});
	});
});

