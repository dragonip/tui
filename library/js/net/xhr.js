/**
 * @module net/xhr Module to abstract the Ajax from browsers, currently uses jquery thus requirejs with JQ support is needed
 * @requires jquery types/types
 * */

define(['jquery', 'debug/console', 'types/types'], function(jq, logger, types) {
    var pcli = logger.getInstance('xhr');
    return {
    	/**
    	 * @method get Gets an URL from same domain and returns the content unaltered if success, otherwise does not return
    	 * @param {String} url. The url to retrieve
    	 * @param {Object} options. Object representing the request options, recognized options are dataType which defaults to 'text' and callback, which should be a function that receives one argument - the data received from the request
    	 * */
        get: function(url, options) {
            options = options || {};
            jq.ajax({
                url: url,
                dataType: options.dataType || 'text',
                success: function(data, status, jqx) {
                    pcli.log(['Received response of request for url : ' + this.url, 'Received data: ' + data]);
                    if (types.assert(options.callback, 'function')) {
                        options.callback(data);
                    }
                },
                error: function(jqx, status, error) {
                    pcli.log('Data retrieval failed with status : ' + status + ' for request of url: ' + this.url);
                }
            });
        }
    };
});