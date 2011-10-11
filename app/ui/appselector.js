define(['tpl/appselector','data/applist', 'dom/dom', 'dom/classes', 'utils/events', 'debug/console'],
function(tpl,applist, dom, classes, Mevents, logger) {
	var pcli = logger.getInstance('appselector');
	var currenScreen;
	function obj2array(obj) {
		var a = [], k;
		for (k in obj) {
			if (obj.hasOwnProperty(k)) {
				a.push(obj[k]);
			}
		} 
		return a;
	}

	function triggerScreen(bool){
		var dir = (bool)?'nextElementSibling':'previousElementSibling';
		if ( currenScreen[dir] !== null && classes.hasClass(currenScreen[dir], 'approtator-item')) {
			if (bool) {
				classes.addRemoveClasses(currenScreen, 'off', 'active');
				classes.addClasses(currenScreen[dir], 'active' );
			} else {
				classes.removeClasses(currenScreen, 'active');
				classes.addRemoveClasses(currenScreen[dir], 'active', 'off');
			}
			currenScreen =  currenScreen[dir];
		}
	}
	function log(k) {
		pcli.log(k.toUpperCase() + 'button activated for module AppSelector');
	}
	var moduleEvent = {
		up: {
			name: 'up',
			func: function(key){
				log(key);
				triggerScreen(false);
			},
			attached: false
		},
		down: {
			name: 'down',
			func: function(key){
				log(key);
				triggerScreen(true);
			},
			attached: false
		},
		hide: {
			name: 'info',
			func: hideDOM,
			attached: false
		},
		loadApp: {
			name: 'ok',
			func: function(key) {
				pcli.log('load an app');
				var a1 = dom.$('.obscure');
				if (a1 !== null) classes.removeClasses(a1, 'obscure');
				var a  = dom.dataGet(currenScreen, 'appname');
				pcli.log(applist[a]);
				hideDOM();
				tui.loadApp(applist[a]);
			},
			attached: false
		}
	};
	function showAppSel() {
			tui.setContainerVisibility(true);
			Mevents.addHandlers(moduleEvent);
			dom.adopt(document.body, DOM);
			setTimeout(function() {
				classes.removeClasses(DOM.querySelector('div'), 'init');
			}, 50);
			var a = dom.$('#maincontainer');
			if (a !== null) classes.addClasses(a, 'obscure');
	}
	var selectorBindings = {
		appselector: {
			name: 'home',
			func: showAppSel,
			attached: false
		}
	};
	Mevents.addHandlers(selectorBindings);
	//
	// .cvar rendered = tpl.render({ apps: obj2array(applist) });
	// 
	var DOM = dom.getInnerNodes(tpl.render({
		apps: obj2array(applist)
	}));

	currenScreen = DOM.querySelector('.approtator-item')
	classes.addClasses(currenScreen, 'active');
	function hideDOM() {
		Mevents.removeHandlers(moduleEvent);
		classes.addClasses(DOM.querySelector('.rotator-circle'), 'init');
		setTimeout(function() {
			dom.dispose(DOM);
		}, 200);
	}
	/**
	 * @method show Shows the App selector widget, from then one the keys are managed by the widget
	 */
	return {
		show: showAppSel
	};
});
