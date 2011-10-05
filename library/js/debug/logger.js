/**
 * Module to wrap the debugging, debugging can be local, nodejs or none
 * @module logger Provides logging utility, configurable to use local or remote debugger
 */

//
// define(['dom/types', 'socket.io/socket.io.js'],function(types) {
// 
define(['dom/types'], function(types){
	var dbg, logs;
	function reconstruct(o) {
		var k, newO = {};
		for (k in o) {
			if (o.hasOwnProperty(k)) {
				if (typeof o[k] === 'function') {
					//
					// newO[k] = o[k].toString();
					// 
					newO[k] = 'Function';
				} else if (types.getType(o[k]) === 'array') {
					newO[k] = o[k];
				} else if (types.getType(o[k]) === 'object' ) {
					newO[k] = reconstruct(o[k]);
				} else {
					newO[k] = o[k];
				}
			} else {
				newO[k] = '__protolink__';
			}
		}
		return newO;
	}
	if (window.tui.options.debug) {
		if (window.tui.options.nodejs) {
			dbg = io.connect(window.location.protocol + '//' + window.location.host);
			dbg.on('reload', function() {window.location.reload(true);});
			dbg.emit('logger', {id: 'myid'});
			logs =  {
				type: 'nodejs',
				log: function(o) {
					if (types.getType(o) === 'object') {
						dbg.emit('log', reconstruct(o));
					} else {
						dbg.emit('log', o);
					}
				}
			};
		} else {
			logs = {
				type: 'local',
				log: function(o) {
					console.log(o);
				}
			};
		}
	} else {
		logs = {
			type: 'none',
			log: function(o){}
		};
	}
	window.pcli = logs.log;
	return logs;
	/**
	 * @method log Logs a message to the configured debugger
	 * @param {Any} The log message (preferrably - JSON.stringifyable)
	 */
	/**
	 * @method type The type of the logger utilized
	 */
});
