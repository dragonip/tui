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
		version: '0.1'
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
		setPanels: function(top, bottom, opt_topContent) {
			if (top) {
				this.panels.top.style.top = '0px';
				this.mainContainer.style.marginTop = '60px';
			} else {
				this.panels.top.style.top = '-60px';
				this.mainContainer.style.marginTop = '0px';
			}
			if (bottom) {
				this.panels.bottom.style.bottom = '0px';
				this.mainContainer.style.marginBottom = '60px';
			} else {
				this.panels.bottom.style.bottom = '-60px';
				this.mainContainer.style.marginBottom = '0px';	
			}
		},
		scaleContainer: function(bool) {
			if (bool) {
				//calculate for 20%
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
				this.mainContainer.className = '';
				this.mainContainer.style.MozTransform = 'scale(1)';
				this.mainContainer.style.webkitTransform = "scale(1)"
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
	require(['ui/appselector', 'dmc/dmc'], function (Mappsel, Mdmc) {
		require([(Mdmc.isNative()) ? 'app/paths/stb.js' : 'app/paths/browser.js', 'data/applist'], function (paths, apps) {
			tui.options.paths = paths;
			tui.loadIndicator.hide();
			tui.loadApp({
				name: 'Start',
				apptag: 'start',
				module: 'apps/start',
				icon: 'imgs/start_screen_icon.png'
			});
		});
	});
}
if (tui.options.debug) {
	window.DEBUG = {
		popup: true
	};
}
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
	tui.panels = { 
		top: document.createElement('div'),
		bottom: document.createElement('div')
	};
	tui.panels.top.className = 'tui-component panels top-panel';
	tui.panels.top.style.top = '-60px';
	tui.panels.bottom.className = 'tui-component panels bottom-panel';
	tui.panels.bottom.style.bottom = '-60px';
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
			loader.loadCSS(['app/css/reset.css', 'app/css/appselector.css'], loadTUI);
		});
	});
});
//}());

