define(['transport/requestheader'], function(headers) {
	var JSONRequest = function(run, data) {
		this['header'] = headers.create();
		this.compileRequest_(run, data);
	};
	JSONRequest.prototype.disposeInternal = function() {
		this['header'].disposeInternal();
		delete this['header'];
		this['request'] = null;
		delete this['request'];
	};
	JSONRequest.prototype.compileRequest_ = function(run, data) {
		this['request'] = {
			"run":run,
			"data":data||null
		};
	};
	return {
		create: function(run, data) {
			return new JSONRequest(run, data);
		}
	};
});
