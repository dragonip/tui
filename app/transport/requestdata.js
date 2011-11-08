define(['transport/requestheader'], function(headers) {
	var JSONRequest = function(run, data, url) {
		this['header'] = headers.create(run);
		this.compileRequest_(run, data, url);
	};
	JSONRequest.prototype.disposeInternal = function() {
		this['header'].disposeInternal();
		delete this['header'];
		this['request'] = null;
		delete this['request'];
	};
	JSONRequest.prototype.compileRequest_ = function(run, data, url) {
		this['request'] = data;
	};
	return {
		create: function(run, data, url) {
			return new JSONRequest(run, data, url);
		}
	};
});
