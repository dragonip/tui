/**
* @module ui/simplescreenselector Simplified screen selector to work on older devices with less processing power, completely covers the functionality and can replace the original app selector, only it does not utilizes any transforamtion nor animations
* @requires 'tpl/appselector2','data/applist', 'dom/dom', 'dom/classes', 'utils/events', 'debug/console', 'utils/sizes'
*/

define(
	[ 'tpl/appselector2','data/applist', 'dom/dom', 'dom/classes', 'utils/events', 'utils/sizes',
	'env/exports'],
function(tpl,applist, dom, classes, Mevents, sizes, exports) {

	var currenScreen, itemSize = 90, internalAppList = obj2array(applist), 
		padding = sizes.pixelate(sizes.getSizesForAppselector(90).padding), 
		DOM = dom.getInnerNodes(tpl.render({
			apps: internalAppList
		}));
	
	DOM.style.height = sizes.pixelate(sizes.getSizesForWindow().height);
	var SelectorState = false;
	var fillers = dom.$$('.filler', DOM);
	for (var i1 = 0; i1 < fillers.length; i1++ ) {
		fillers[i1].style.height = padding;
	}
	dom.$('.screen-selector-pointer', DOM).style.top = sizes.depixelate(padding) - 12 + 'px';
	currenScreen = dom.$('.approtator-item', DOM);
	

	function obj2array(obj) {
		var a = [], k;
		for (k in obj) {
			if (obj.hasOwnProperty(k)) {
				a.push(obj[k]);
			}
		} 
		return a;
	}
	
	function relocateTo(seq) {
		DOM.scrollTop =  (itemSize * seq);
	}
	function triggerScreen(bool){
		var dir = (bool)?'nextElementSibling':'previousElementSibling';
		if ( currenScreen[dir] !== null && classes.hasClass(currenScreen[dir], 'approtator-item')) {
			currenScreen =  currenScreen[dir];
			relocateTo(dom.dataGet(currenScreen, 'sequence'));
		}
	}
	function getState() {
		return SelectorState;
	}
	exports.exportSymbol('appselector', {
		name: 'getState',
		symbol: getState
	});
	var moduleEvent = {
		up: {
			name: 'up',
			func: function(key){
				triggerScreen(false);
			},
			attached: false
		},
		down: {
			name: 'down',
			func: function(key){
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
				var a1 = dom.$('.obscure');
				if (a1 !== null) classes.removeClasses(a1, 'obscure');
				var a  = dom.dataGet(currenScreen, 'appname');
				hideDOM();
				tui.loadApp(applist[a]);
			},
			attached: false
		}
	};
	function showAppSel() {
			tui.setContainerVisibility(true);
			tui.setPanels(false, false);
			SelectorState = true;
			Mevents.addHandlers(moduleEvent);
			dom.adopt(document.body, DOM);
			relocateTo(dom.dataGet(currenScreen, 'sequence'));
			var a = dom.$('#maincontainer');
			if (a !== null) classes.addClasses(a, 'obscure');
	}
//	Create global selector binding (Home button) and subscribe it to the event handler, it should be always present
	var selectorBindings = {
		appselector: {
			name: 'home',
			func: showAppSel,
			attached: false
		}
	};
	Mevents.addHandlers(selectorBindings);
//	Hide the DOM from the screen, exposed in the context to allow calling from anywhere in the module
	function hideDOM() {
		Mevents.removeHandlers(moduleEvent);
		SelectorState =  false
		dom.dispose(DOM);
	}
//	Exports
	return {
		/**
		* @method remoteSelectScreen Exposes the app selection function to the global object to allow screen switch to occur on server side incentive
		* @param {String} apptag. The apptag as per applist for the desired screen
		* return {undefined}
		*/
//		TODO: Test the global screen switcher
		remoteSelectScreen: function(apptag) {
			for (var i = 0; i < internalAppList.length; i++ ) {
				if (internalAppList[i].apptag === apptag) {
					currenScreen = dom.$$('.approtator-item', DOM)[i];
					return;
				}
			}
		},
		/**
		* @method show Exposes the onScreen initialization function for the global object should this one be needed
		* @return {undefined}
		*/
		show: showAppSel
	};
});
