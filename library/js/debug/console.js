/**
 * @module debug/console Provides simple debug console on all platrofms
 * @require types/types debug/eyes window/window env/exports
 * */
define([
	'types/types',
	'debug/eyes',
	'window/window',
	'env/exports'], function(types, eyes, win, env) {
	var levels = {};
	var logwin = null;
	var ready = false;
	var queue = [];

	function windowReady(winname) {
		if (winname === logwin.name) {
			ready = true;
			if (queue.length > 0) {
				for (var i = 0; i < queue.length; i++) {
					logwin.log(queue[i].name, queue[i].log);
				}
			}
		}
	}

	function chooseLogger() {
		if (typeof window.console !== 'undefined' && typeof window.DEBUG !== 'undefined' && !window.DEBUG.popup) {
			if (typeof window.console.group !== 'function') {
				window.console.group = function(name) {
					console.log('\n Stated in ');
				};
				window.console.groupEnd = function() {
					console.log('End Group \n');
				};
			}
			return function(logMessages, level) {
				var i;
				console.group(this.name);
				if (types.assert(logMessages, 'array')) {
					for (i = 0; i < logMessages.length; i++) {
						console.log(logMessages[i]);
					}
				} else {
					console.log(logMessages);
				}
				console.groupEnd();
			};
		} else if ( typeof window.DEBUG !== 'undefined' ) {
			//work things out without a console, furst rudimentary support
			env.exportSymbol('debug', {
				name: 'windowReady',
				symbol: windowReady
			});
			logwin = win.create('library/debug.html');
			return function(logMessages, level) {
				var a = '';
				if (types.assert(logMessages, 'array')) {
					for (var i = 0; i < logMessages.length; i++) {
						if (typeof logMessages[i] === 'string') {
							a = a + eyes.inspect(logMessages[i].split("&").join("&amp;").split( "<").join("&lt;").split(">").join("&gt;")) + '<br>';
						} else {
						a = a + eyes.inspect(logMessages[i]) + '<br>';
						}
					}
				} else {
					if ( typeof logMessages === 'string' ) {
						a = eyes.inspect(logMessages.split("&").join("&amp;").split( "<").join("&lt;").split(">").join("&gt;"));
					} else {
					a = eyes.inspect(logMessages);
					}
				}
				if (ready) {
					logwin.log(this.name, a);
				} else {
					queue.push({
						name: this.name,
						log: a
					});
				}
			};
		} else {
			return function() {};
		}
	}

	function logger(module) {
		this.name = module;
	}
	logger.prototype.log = chooseLogger();
	/**
	 * @method getInstance  Gets an instance from log pool , useful to log with name, this way you can log rom different modules and know which log comes from where, if debugger provides filtering it is also useful
	 * @param {String} instancename. The name of the log pool to use
	 * @return {Obj} Console object, use instance.log(obj) or instance.log([item, item2]) to log messages
	 * */
	return {
		getInstance: function(instancename) {
			return new logger(instancename);
		}
	};
});
