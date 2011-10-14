/**
* @module net/simplexhr Implements getters for same domain via XHR in supported browsers
*/

define(function(){
	function getInstance(opt) {
		return new XMLHttpRequest();
	}
	function stripLoaderJSON(text) {
		return substring(text.indexOf('{') - 1, text.lastIndexOf('}') + 1);
	}
	return {
		/**
		* @method get Get URL via Ajax, optionally strip from JSONP wrapper
		* @param {String} url. URL to retrieve
		* @param {Function} cb. Callback function to execute, parameter will be the response text or null
		* @param {Object} opts. Additional configuration options, supported are: stripJSON {Boolean}
		*/
		get: function(url, cb, opts) {
			opts = opts || { stripJSON: false};
			if (typeof opts.stripJSON === 'undefined' ) opts.stripJSON = false;
			var r = getInstance();
			r.open('GET', url, true);
			r.onreadystatechange = function(aEvt) {
				var result;
				if (r.readyState == 4) {
					if (r.status == 200) {
						result = opts.stripJSON ? stripLoaderJSON(r.responseText) : r.responseText;
						cb(result);
					} else {
						cb(null);
					}
					r.onreadystatechange = null;
					r = null;
				}
			};
			r.send(null);
		},
		/**
		* @method getMany Gets list of urls and execute callback after all have completed
		* @param {Array.String} urlList Array of URLs to retrieve
		* @param {Function} callback. Callback function to execute once all requests complete, array containing the results will be subbmitted as parameter to this function
		* @param {Object} opts. Additional configuration options, supported are: stripJSON {Boolean}
		*/
		getMany: function(urlList, callback, opts) {
			opts = opts || { stripJSON: false};
			if (typeof opts.stripJSON === 'undefined' ) opts.stripJSON = false;
			
			var complete = 0;
			var all = urlList.length;
			var Req = [], Res = [];
			var that = this;
			var executeTheCallback = function() {
				callback( Res );
			};
			
			var receiveResponse = function(requestNumber, responseText) {
				if (opts.stripJSON === true) {
					responseText = opts.stripJSON ? stripLoaderJSON(responseText) : responseText;
				}
				Res[requestNumber] = responseText;
				complete += 1;
				if (complete == all) {
					executeTheCallback();
				}
			}
			
			for (var i = 0; i < all; i++) {
				(function( requestNum ) {
					that.get(urlList[requestNum], function(text){
						receiveResponse(requestNum, text);
					});
				}(i))
			}
			
		},
		blockGet: function() {}
	};
});
