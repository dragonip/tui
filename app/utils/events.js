/**
 * @module events Provides keyboard/remote key bindings for the TUI 
 */
define(['types/types', 'array/array', 'dmc/smjs'], function(Mtypes, Marray, smjs){
	var events = [
		'display',
		'volup', 'voldown', 'mute',
		'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero',
		'pound', 'star',
		'recall', 'home', 'info', 'return', 'ok',
		'left', 'right', 'up', 'down',
		'chup', 'chdown',
		'play', 'stop', 'ff', 'rw', 'rec', 'save',
		'power',
		'delete'
	];
	var defHandler = function(useraction) {};
	var internalEventList = {};
	events.forEach(function(useraction) {
		internalEventList[useraction] = [defHandler];
	});
	function addEventHandler(name, func) {
		if (Mtypes.assert(func,'function') && Marray.has(events, name)) {
			internalEventList[name].push(func);
			return true;
		}
		return false;
	}
	function removeEventHandler(name, func) {
		var i;
		if (Mtypes.assert(func, 'function') && Marray.has(events, name)) {
			for ( i = internalEventList[name].length - 1; i > 0; i--) {
				if (internalEventList[name][i] === func) {
					internalEventList[name].splice(i, 1);
					return false;
				}
			}
		}
		return true;
	}
	var dispatchEvent = function(keycode) {
		if (keycode) {
			internalEventList[keycode][internalEventList[keycode].length -1](keycode);
		}
	};
	
	var initEvents = function() {
		smjs.initapi();
		smjs.set_json_handler('window.transportReceiver');
	};
	initEvents();
	

	return {
		/**
		 * @method addHandlers Adds handlers for keys on top of the existing ones
		 * @param {Object} Object representing the handlers {name: keyname, func: function(keyname){toexec}, attached: boolean}
		 */
		addHandlers: function(ev_list) {
			var k;
			for (k in ev_list) {
				if (ev_list[k].attached === false ) {
					ev_list[k].attached = addEventHandler(ev_list[k].name, ev_list[k].func);					
				}

			}
		},
		/**
		 * @method removeHandlers removes handlers for keys from the handler stack
		 * @param {Object} Object representing the handlers {name: keyname, func: function(keyname){toexec}, attached: boolean}
		 */
		removeHandlers: function(ev_list) {
			var k;
			for (k in ev_list) {
				if (ev_list[k].attached === true) {
					ev_list[k].attached = removeEventHandler(ev_list[k].name, ev_list[k].func);
				}
			}
			ev_list;
		},
		showAll: function(){
			console.log(internalEventList);
		},
		defaultEventAccepter: dispatchEvent,
		initEvents: initEvents
	};
});
