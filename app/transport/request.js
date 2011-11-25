define(['transport/requestdata', 'json/json', 'net/socket', 'dmc/smjs'], function(request, json, socket, smjs) {
	/**
	* Wrapper for JSON requests, it only provides the socket wrapper if needed, used only in browsers, will be stripped off when building
	* @param {!String} run The method to set in the header
	* @param {Object} data The data to pass as request body, it will always be set as the object content of object 'request'
	*/
	var JSONRequest = function(run, data) {
		this.json = request.create(run, data);
	};
	/**
	* Returns the serialized data of the request object
	* @return {JSONString}
	*/
	JSONRequest.prototype.getRequestString = function() {
		return json.serialize(this.json);
	};
	/**
	 * Sends the request via the socket, first serializing it
	 */
	JSONRequest.prototype.send = function() {
		smjs.jsoncmd(this.getRequestString());
	};
	/**
	 * Disposes the data it uses (calling the actual request dispose methods
	 */
	JSONRequest.prototype.disposeInternal = function() {
		this.json.disposeInternal();
		this.json = null;
		delete this.json;
	};
	/**
	 * Wraps the object creation functionality
	 */
	return {
		create: function(run, data, url) {
			return new JSONRequest(run, data);
		}
	};
});
