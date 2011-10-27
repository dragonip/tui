define(['transport/requestdata', 'json/json', 'net/socket', 'dmc/dmc'], function(request, json, socket) {
	var waiter = {};
	var JSONRequest = function(run, data) {
		this.json = request.create(run, data);
	};
	JSONRequest.prototype.getRequestString = function() {
		return json.serialize(this.json);
	};
	JSONRequest.prototype.send = dmc.isNative ? (function(socket) {
		return function(callback) {
			socket.send(this.getRequestString());
		};
	})(socket.create('ws://192.168.2.58:7681', 'lws-mirror-protocol', window.transportReceiver)) : function() {
		window.SMJS.send(this.getRequestString());
	};
	
	JSONRequest.prototype.disposeInternal = function() {
		this.json.disposeInternal();
		this.json = null;
		delete this.json;
	};
	return {
		create: function(run, data) {
			return new JSONRequest(run, data);
		}
	};
});
