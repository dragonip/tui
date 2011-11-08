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
		"host": "../library/js/nost",
		"env/exports": "../library/js/env/exports",
		"dom": "../library/js/dom",
		"debug": "../library/js/debug",
		"array": "../library/js/array",
		"text": "../library/js/text",
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
//Requere the minimum set of dependencies and decorate the page with loading message
require(['ui/throbber'], function(t) {
	var options = {
		debug: true,
		nodejs: false,
		version: '0.1',
		useScale: false
	};
	//Fix the document dimenations and show loader first
//	document.body.setAttribute('style', 'width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;');
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
	//After we are done with the loader, require some helpers and the main event dispatcher and start building the app
	require(['utils/events', 'dom/classes', 'dom/dom', 'ui/popup', 'dmc/dmc', 'shims/bind'], function(globalevents, classes, dom, Dialogs, dmc, bind ) {
		//Load images offscreen after we have loaded the deps to avoid trapping the JS in the max Concurent Reqs of the browsser
		dom.adopt(dom.create('div', {
			classes: 'tui-component tui-preloader',
			html: '<img src="app/imgs/icon_set.png"><img src="apps/imgs/activeScreenArrow.png">'
		}));
		// Now, while the images are loading, create the TUI
		//Create the main container
		dom.adopt(dom.create('div', {
			id: 'maincontainer',
			style: 'height: ' + window.innerHeight + 'px; width: ' + window.innerWidth + 'px; margin-top: 0; margin-bottom: 0'
		}));
		//Create the main Controller
		window.tui = {
			signals: {
				restoreEventTree: function() {
					dmc.onKeyPress(globalevents.defaultEventAccepter);
				}
			},
			mainContainer: dom.$('#maincontainer'),
			loadIndicator: loadIndicator,
			options: options,
			currentActiveApp: null,
			appRequested: false,
			appModuleAdded: function(app) {
				this.currentActiveApp = app;
				app.Start();
			},
			systemConfirm: function(options) {
				// TODO: make those confirm panels work
				var header = options.header.html;
				this.rerouteEventsToPanel();
			},
			stealEvents: function(newManager) {
				dmc.onKeyPress(newManager);
			},
			createDialog: function(type, options, callback, title, defaultOption ) {
				var dialog;
				if (type === 'optionlist') {
					dialog = new Dialogs.OptionList(type, options, callback, title, defaultOption);
				} else if (['input', 'password', 'text'].indexOf(type) !== -1  ) {
					dialog = new Dialogs.Text(type, options, callback, title);
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
					if (this.useScale) {
						this.mainContainer.className = 'scaled'
						var x = parseInt(this.mainContainer.style.width, 10);
						var y = parseInt(this.mainContainer.style.height, 10);
						var x1 = parseInt(((x * 20) / 100), 10);
						var y1 = parseInt(((y * 20) / 100), 10);
						var moveX = parseInt(x / 2) - parseInt(x1 / 2);
						//var moveY = parseInt(y/2) - parseInt(y1/2);
						var res = "scale(0.2) translateX(" + moveX * 5 + "px)" //  + "translateY(-" + moveY * 5 + "px)"
						this.mainContainer.style.webkitTransform = res;
						this.mainContainer.style.MozTransform = res;
					} else {
						this.mainContainer.style.visibility = 'hidden';
					}
				} else {
					if (this.useScale) {
						this.mainContainer.className = '';
						this.mainContainer.style.MozTransform = 'scale(1)';
						this.mainContainer.style.webkitTransform = "scale(1)"

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
						dmc.onKeyPress(globalevents.defaultEventAccepter);
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
		//Attach pannels
		dom.adopt(tui.panels.bottom, tui.panels.infoBlock);
		dom.adopt(tui.panels.top);
		dom.adopt(tui.panels.bottom)
		function loadTUI() {
			require(['ui/simplescreenselector', 'dmc/dmc'], function(Mappsel, Mdmc) {
				require(['transport/response'], function(response) {
					window.transportReceiver = function(JSONString) {
						response.recall(JSONString);
					};
					require(['app/paths/stb.js', 'data/applist', 'ui/player', 'tpl/infobuttons'], function(paths, apps, player, itpl) {
						tui.player = player;
						tui.options.paths = paths;
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


