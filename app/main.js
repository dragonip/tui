//(function() {
	require.config({
		baseUrl: "app",
		paths: {
			"types" : "../library/js/types",
			"window": "../library/js/window",
			"utils/autoid": "../library/js/utils/autoid",
			"templates/compiler" :"../library/js/templates/compiler",
			"support": "../library/js/support",
			"shims" : "../library/js/shims",
			"oop" : "../library/js/oop",
			"nls" : "../library/js/nls",
			"net" : "../library/js/net",
			"loader" : "../library/js/loader",
			"host" : "../library/js/nost",
			"env/exports" : "../library/js/env/exports",
			"dom" : "../library/js/dom",
			"debug" : "../library/js/debug",
			"array" : "../library/js/array",
			"text" : "../library/js/text",
		},
		urlArgs: "bust=" +  (new Date()).getTime()
	});
	var options, initmodules,
		assets = {
			initCSS: ['app/css/reset.css', 'app/css/appselector.css'],
			initModules: ['ui/appselector', 'utils/events', 'dmc/dmc'],
			clearActions: {}
		},
		options = {
			debug: true,
			nodejs: false,
			version: '0.1'
		}
	
	window.tui = {
		loadIndicator: null,
		options: options,
		currentActiveApp: null,
		appRequested: false,
		appModuleAdded: function(app) {
			this.logger.log(['Setting current active app to', app]);
			this.currentActiveApp = app;
			app.Start();
		},
		apps: {
			signals: function(signaltype, opts) {
				switch (signaltype) {
				case 'ready':
					tui.logger.log(['TUI received signal ready for app', opts]);
					if (tui.currentActiveApp.name === opts.name) {
						tui.logger.log('my currentlyactve app is ready, time to hide the throbber and call draw on my app');
						tui.loadIndicator.hide();
						tui.currentActiveApp.Show(tui.mainContainer);
					}
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
	//Load the real TUI
	function loadTUI() {
		require(['ui/appselector', 'dmc/dmc'], function(Mappsel, Mdmc) {
			require([(Mdmc.isNative())?'app/paths/stb.js':'app/paths/browser.js','data/applist'], function(paths, apps) {
				tui.options.paths = paths;
				tui.loadIndicator.hide();
			});
		});
	}
	if (tui.options.debug) {
		window.DEBUG = {
			popup: true
		};
	}
	require(['ui/throbber'], function(t) {
		var a = document.createElement('div');
		a.setAttribute('id', 'maincontainer');
		a.style.height = window.innerHeight + 'px';
		a.style.width = window.innerWidth + 'px';
		document.body.setAttribute('style', 'width: '+ window.innerWidth + 'px; height: ' + window.innerHeight + 'px;');
		tui.mainContainer = a;
		document.querySelector('body').appendChild(a);
		tui.loadIndicator = {
			show: function(text) {
				t.start({
					element: document.body,
					text: text || 'Loading TUI...'
				});
			},
			hide: function() {
				tui.logger.log(t);
				t.stop();
			}
		};
		tui.loadIndicator.show();

		//Request our logger utility and then the static loader
		require(['debug/console'], function(logger) {
			//
			// just keep reference to the logger in case, otherwise use 'window.pcli browser wide
			// 
			tui.logger = logger.getInstance('main');
			tui.logger.log('Load the intrinsic loader now..');
			require(['loader/loader'], function(loader) {
				tui.logger.log(['Loaded intrinsic loader', 'Should switch to jquery and net/xrh to be browser independent']);
				loader.loadCSS(['app/css/reset.css', 'app/css/appselector.css'], loadTUI);
			});
		});
	});
//}());
