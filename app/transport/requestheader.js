define(['config/main'],function(config) {
	var Header = function Header(run, type, transport, callback, mode) {
		this["callback"] = callback || this.defaultCallback;
		this["transport"] = transport || this.transport;
		this['mode'] = mode || this.mode;
		this['method'] = run;
		this['type'] = type || this.type;
		this.getUID();
	};
	Header.prototype.defaultCallback = config.transport.DEFAULT_CALLBACK;
	Header.prototype.transport = "socket";
	Header.prototype.type = "request";
	Header.prototype.mode = "async";
	Header.prototype.disposeInternal = function() {
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				this.key = null;
				delete this.key;
			}
		}
	};
	Header.prototype.getUID = function() {
		this['tag'] = '_' + (new Date()).getTime() + '_' + this.getRandomBetween_(1, 1000);
	};
	Header.prototype.getRandomBetween_ = function(from, to) {
		return Math.floor(Math.random() * (to - from + 1) + from);
	};
	var setDefaultCallback = function(callbackAsString) {
		Header.prototype.defaultCallback = callbackAsString;
	};
	var setDefaultTransport = function(transport) {
		Header.prototype.transport = transport;
	};
	return {
		create: function(type, transport, callback) {
			return new Header(type, transport, callback);
		},
		setDefaultTransport: setDefaultTransport,
		setDefaultCallback: setDefaultCallback
	};
});
