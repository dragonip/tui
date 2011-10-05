/**
 * @module data Provides means to retrieve data from the STB device. Shim provided for browsers, setters will not work
 */
define(['dmc/dmc', 'data/parsers'], function(dmc, parsers) {
	function makeRequest(a, b) {
		var r = new XMLHttpRequest();
		r.open('GET', a, true);
		r.onreadystatechange = function(aEvt) {
			if (r.readyState == 4) {
				if (r.status == 200) {
					b(r.responseText.substring(r.responseText.indexOf('{') - 1, r.responseText.lastIndexOf('}') + 1));
				} else {
					b(null);
				}
				r.onreadystatechange = null;
			}
		};
		r.send(null);
	}
	//
	// get data from remote location, parse it to meaningful JSON and return it
	// 
	return {
		/**
		 * @method get Retrieves the related data
		 * @param {Object} Options, should contain the type of data and a callback
		 */
		get: function(opts) {
			pcli('Getting data per request with attrs:');
			pcli(opts);
			var url = tui.options.paths.getPath(opts.type);
			pcli('resolved url is ' + url);
			makeRequest(url, function(text) {
				var res, ret;
				if (text === null) {
					opts.callback(null);
					return;
				}
				
				res = eval('(' + text + ')');
				ret = {
					body: res.body,
					dirs: res.dirs || {}
				};
				opts.callback(parsers.parse(ret, opts.type));
			});
		}
	};
});
