define(['json/json'], function(json) {
	/**
	 * Wraps the socket interface to abstract FF and chrome, also sets the listeners for socket events
	 * @constructor
	 * @param {!String} url The url to connect to (ex: ws://url:port)
	 * @param {!String} protocol The protocol to use, should be known for each server
	 * @param {!Function} onMessage The function that will accept the 'onmessage' data comming on the socket link
	 * @param {?Object} messageContext The object to be used as 'this' when calling the handler for messages  
	 */
	var Socket = function Socket(url, protocol, onMessage, messageContext, shouldParse) {
		this.url = url;
		this.isConnected = false;
		this.shouldParse = (typeof shouldParse === 'boolean') ? shouldParse : true;
		this.protocol = protocol;
		this.sendQueue = [];
		if (typeof messageContext === 'undefined') messageContext = null;
		this.messageHandler = this.createMessageHandler(onMessage, messageContext);
		this.connect();
	};
	/**
	 * Create the handler to use onmessage
	 * @private
	 * @param {!Function} messageHandler
	 * @param {Object|null} context
	 * @return {Function} Wrapped function call with set context
	 */
	Socket.prototype.createMessageHandler = function(messageHandler, context) {
		var handler = messageHandler, messageContext = context, shouldParse = this.shouldParse;
		return function(event) {
			handler.call(messageContext, ( shouldParse) ? json.parse( event.data) : event.data );
		};
	};
	/**
	 * Attempts to connect to the server
	 */
	Socket.prototype.connect = function () {
		if (this.socket) return;
		console.log(this.url, this.protocol);
		try {
			this.socket = new WebSocket(this.url, this.protocol);
		} catch(e) {
			try {
				this.socket = new MozWebSocket(this.url, this.protocol);
			} catch (e) {
				console.log("Web socket is not supported");
				this.socket = null;
				return;
			}
		}
		this.socket.onmessage = this.messageHandler;
		this.socket.onopen = this.setConnected.bind(this);
		this.socket.onclose = this.disposeInternal.bind(this);
	};
	/**
	 * @private
	 */
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
	/**
	 * Sends data via the socket
	 * @param {!JSONString} JSONString The data to send on the socket
	 */
	Socket.prototype.send = function(JSONString) {
		if (!this.url) {
			console.log('The Object is already disposed, probably connection was terminated or did not success');
			return;
		}
		if (typeof JSONString !== 'string') return;
		if (this.isConnected) {
			this.socket.send(JSONString);
		} else {
			this.sendQueue.push(JSONString);
		}
	};
	Socket.prototype.disposeInternal = function() {
		if (this.socket) {
			if (this.socket.readyState < 3 ) {
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
		delete this.isConnected;
	};
	return {
		create: function(url, protocol, onMessage, messageContext) {
			return new Socket(url, protocol, onMessage, messageContext);
		}
	};
});
