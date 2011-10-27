define(function() {
	var Socket = function Socket(url, protocol, onMessage, messageContext) {
		this.url = url;
		this.protocol = protocol;
		this.sendQueue = [];
		if (typeof messageContext === 'undefined') messageContext = null;
		this.messageHandler = this.createMessageHandler(onMessage, messageContext);
		this.connect();
	};
	Socket.prototype.createMessageHandler = function(messageHandler, context) {
		var handler = messageHandler, messageContext = context;
		return function(event) {
			handler.call(messageContext, event.data);
		};
	};
	Socket.prototype.connect = function () {
		if (this.socket) return;
		console.log(this.url, this.protocol);
		this.socket = new WebSocket(this.url, this.protocol);
		this.socket.onmessage = this.messageHandler;
		this.socket.onopen = this.setConnected.bind(this);
		this.socket.onclose = this.disposeInternal.bind(this);
	};
	Socket.prototype.setConnected = function() {
		var i;
		this.isConnected = true;
		if (this.sendQueue.length > 0) {
			for ( i = 0; i < this.sendQueue.length; i++ ) {
				this.send(this.sendQueue[i]);
			}
		}
		delete this.sendQueue;
	};
	Socket.prototype.send = function(JSONString) {
		if (typeof JSONString !== 'string') return;
		if (this.isConnected) {
			this.socket.send(JSONString);
		} else {
			this.sendQueue.push(JSONString);
		}
	};
	Socket.prototype.disposeInternal = function() {
		if (this.socket) {
			if (this.socket.readyState < 4 ) {
				this.socket.close();
			}
			this.socket.onmessage = null;
			this.socket.onopen = null;
			this.socket.onclose = null;
			this.socket = null;
			delete this.socket;
		}
		delete this.url;
		delete this.protocol;
		this.messageHandler = null;
		delete this.messageHandler;
		if (this.sendQueue) delete this.sendQueue;
	};
	return {
		create: function(url, protocol, onMessage, messageContext) {
			return new Socket(url, protocol, onMessage, messageContext);
		}
	}
});
