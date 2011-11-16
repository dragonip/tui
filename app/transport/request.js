define(['transport/requestdata', 'json/json', 'net/socket', 'dmc/dmc'], function(request, json, socket, dmc) {
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
	 * Contains the socket reference if one can be created
	 * @static
	 */
	JSONRequest.prototype.socket = (function() {
		if (dmc.isNative()) return null;
		return socket.create('ws://192.168.2.64:7681', 'stb-json-protocol', window.transportReceiver);
	})();
	/**
	 * Sends the request via the socket, first serializing it
	 */
	JSONRequest.prototype.send = function() {
		console.log('Sending the request via socket',this.getRequestString());
		if (this.socket !== null) {
			this.socket.send(this.getRequestString());
		} else {
			console.log('Socket does not exists?');
		}
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
