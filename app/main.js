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
var options, initmodules, assets = {
	initCSS: ['app/css/reset.css', 'app/css/appselector.css'],
	initModules: ['ui/appselector', 'utils/events', 'dmc/dmc'],
	clearActions: {}
},
	options = {
		debug: true,
		nodejs: false,
		version: '0.1',
		useScale: false
	}

	window.tui = {
		loadIndicator: null,
		options: options,
		currentActiveApp: null,
		appRequested: false,
		appModuleAdded: function (app) {
			this.logger.log(['Setting current active app to', app]);
			this.currentActiveApp = app;
			app.Start();
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
				if (this.useScale){
					this.mainContainer.className = 'scaled'
					var x = parseInt(this.mainContainer.style.width, 10);
					var y = parseInt(this.mainContainer.style.height, 10);
					var x1 = parseInt(((x * 20)/100), 10);
					var y1 = parseInt(((y*20)/100), 10);
					var moveX = parseInt(x/2) - parseInt(x1/2);
					//var moveY = parseInt(y/2) - parseInt(y1/2);
					var res = "scale(0.2) translateX(" + moveX * 5 + "px)"//  + "translateY(-" + moveY * 5 + "px)"
					this.mainContainer.style.webkitTransform = res;
					this.mainContainer.style.MozTransform = res;
				} else {
					this.mainContainer.style.visibility = 'hidden';					
				}
			} else {
				if (this.useScale){
					this.mainContainer.className = '';
					this.mainContainer.style.MozTransform = 'scale(1)';
					this.mainContainer.style.webkitTransform = "scale(1)"
					
				} else {
					this.mainContainer.style.visibility = '';
				}
			}
		},
		setContainerVisibility: function (bool) {
			if (bool) {
				this.mainContainer.style.opacity = 0.2;
			} else {
				this.mainContainer.style.opacity = 1;
			}
		},
		apps: {
			signals: function (signaltype, opts) {
				switch (signaltype) {
				case 'ready':
					tui.logger.log(['TUI received signal ready for app', opts]);
					if (tui.currentActiveApp.name === opts.name) {
						tui.logger.log('my currentlyactve app is ready, time to hide the throbber and call draw on my app');
						tui.loadIndicator.hide();
						tui.setContainerVisibility(false);
						tui.currentActiveApp.Show(tui.mainContainer);
					}
					break;
				}
			}
		},
		loadApp: function (appobj) {
			this.loadIndicator.show('Loading ' + appobj.name + '...');
			if (this.currentActiveApp !== null) {
				if (typeof this.currentActiveApp.Pause === 'function') {
					this.currentActiveApp.Pause();
				} else {
					this.currentActiveApp.Stop();
				}
			}
			require([appobj.module], function (appmodule) {
				tui.appModuleAdded(appmodule);
			});
		}
	};
//Load the real TUI


function loadTUI() {
	require(['ui/simplescreenselector', 'dmc/dmc'], function (Mappsel, Mdmc) {
		require(['transport/response'], function(response) {
			window.transportReceiver = function(JSONString) {
				console.log("received message from server");
				response.recall(JSONString);
			};
			require(['app/paths/stb.js', 'data/applist', 'ui/player', 'tpl/infobuttons'], function (paths, apps, player, itpl) {
				tui.player = player;
				tui.options.paths = paths;
				tui.loadIndicator.hide();
	//			Signal to backend that we are ready to receive signals
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
if (tui.options.debug) {
	window.DEBUG = {
		popup: false
	};
}

//Use this in tets as loggins slows down the app very very much!!
//window.DEBUG = undefined;
require(['ui/throbber'], function (t) {
	var a = document.createElement('div');
	a.setAttribute('id', 'maincontainer');
	a.style.height = window.innerHeight + 'px';
	a.style.width = window.innerWidth + 'px';
	a.style.marginTop = '0px';
	a.style.marginBottom = '0px';
	document.body.setAttribute('style', 'width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;');
	tui.mainContainer = a;
	document.querySelector('body').appendChild(a);
	tui.loadIndicator = {
		show: function (text) {
			t.start({
				element: document.body,
				text: text || 'Loading TUI...'
			});
		},
		hide: function () {
			//tui.logger.log(t);
			t.stop();
		}
	};
	tui.loadIndicator.show();
//	After we are ready with showing the loader indicator we can preload the images
//	We do not wait for the images to be loaded, we just hope they will be loaded on time...
//	this is because if the image is too larde the starting will be unacceptably slow
	var preload = document.createElement('div');
	preload.className = 'tui-component tui-preloader';
	document.body.appendChild(preload);
	preload.innerHTML = '<img src="app/imgs/icon_set.png"><img src="apps/imgs/activeScreenArrow.png">';
	var updateClock = (function() {
			var clockElementRer = null;

			function format(txt) {
				var mysecs = (txt % 60).toString();
				if (mysecs.length < 2) mysecs = "0" + mysecs;
				return mysecs;
			}
			return function(el) {
				if (el) clockElementRer = el;
				var d = new Date();
				var timestring = d.getDate() + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear() + '&nbsp;' + d.getHours() + ':' + format(d.getMinutes());
				clockElementRer.innerHTML = timestring;
				setTimeout(updateClock, 60000);
			};
		})();

	
	tui.panels = { 
		top: document.createElement('div'),
		bottom: document.createElement('div')
	};
	tui.panels.top.className = 'tui-component panels top-panel';
	tui.panels.top.style.top = '-60px';
	tui.panels.bottom.className = 'tui-component panels bottom-panel';
	tui.panels.bottom.style.bottom = '-60px';
	//Create System clock 
	var clock = document.createElement('div');
	clock.innerHTML = '<h1></h1>';
	clock.className = 'tui-component tui-systemclock';
	updateClock(clock.querySelector('h1'));
	tui.panels.bottom.appendChild(clock);
	tui.panels.infoBlock = document.createElement('div');
	tui.panels.infoBlock.className = 'tui-component tui-infoblock'
	
	tui.panels.bottom.appendChild(tui.panels.infoBlock);
	
	
	document.body.appendChild(tui.panels.top);
	document.body.appendChild(tui.panels.bottom);

	//Request our logger utility and then the static loader
	require(['debug/console'], function (logger) {
		//
		// just keep reference to the logger in case, otherwise use 'window.pcli browser wide
		// 
		tui.logger = logger.getInstance('main');
		tui.logger.log('Load the intrinsic loader now..');
		require(['loader/loader'], function (loader) {
			tui.logger.log(['Loaded intrinsic loader', 'Should switch to jquery and net/xrh to be browser independent']);
			loader.loadCSS(['app/css/reset.css', 'app/css/appselector3.css', 'app/css/infobuttons.css'], loadTUI);
		});
	});
});
//}());

