define(['transport/requestdata', 'json/json', 'net/socket', 'dmc/dmc'], function(request, json, socket, dmc) {
	var waiter = {};
	var JSONRequest = function(run, data, url) {
		this.json = request.create(run, data, url);
	};
	JSONRequest.prototype.getRequestString = function() {
		return json.serialize(this.json);
	};
	JSONRequest.prototype.socket = (function() {
		if (dmc.isNative()) return null;
		return socket.create('ws://192.168.2.58:7681', 'stb-json-protocol', window.transportReceiver);
	})();
	
//	JSONRequest.prototype.send = dmc.isNative ? (function(socket) {
//		return function(callback) {
//			socket.send(this.getRequestString());
//		};
//	})(socket.create('ws://192.168.2.58:7681', 'stb-json-protocol', window.transportReceiver)) : function() {
//		window.SMJS.send(this.getRequestString());
//	};
	JSONRequest.prototype.send = function(callback) {
		console.log('Sending the request via socket')
		if (this.socket !== null) {
			console.log('Socket exists, send now',this.getRequestString() );
			this.socket.send(this.getRequestString());
		}
	};
	
	JSONRequest.prototype.disposeInternal = function() {
		this.json.disposeInternal();
		this.json = null;
		delete this.json;
	};
	return {
		create: function(run, data, url) {
			return new JSONRequest(run, data, url);
		}
	};
});
