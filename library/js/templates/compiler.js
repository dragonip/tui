/**
 * @module templates/compiler Client side support for Jade templates, include if you intend to build templates from text on the client, otherwise always prefer the pre-built templates as they run much faster on the client
 * @requires support/jade net/xhr
 * */
define(["support/jade", 'net/xhr'], function(jade, net) {
	var cache = {};
	function getTemplate(name, cb) {
		if (cache[name]) {
			cb(cache[name]);
		}
		else {
			loadTemplate(name, function() {
				cb(cache[name]);
			});
		}
	}

	function loadTemplate(name, ret) {
		net.get('templates/' + name + '.jade', {
			callback: function(data) {
				cache[name] = jade.compile(data);
				ret(name);
			}
		});
	}
	/**
	 * @method getTemplate Get a text template from the server
	 * @param {String} name. The file name of the template without the extention
	 * @param {Function} cb. The callback function to execute when ready, should accept one parameter - the compiled template
	 * @returns {undefined}
	 * */
	return {
		getTemplate: function(name, cb) {
			getTemplate(name, cb);
		}
	};
});
