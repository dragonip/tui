define([
	'oop/inherit',
	'utils/multiscreen',
	'transport/request',
	'transport/response',
	'json/json',
	'shims/bind'
], function(inherit, MultiScreen, request, response, json, bind) {
	var MS = function(options) {
		this.commonDeps_ = options.deps;
		MultiScreen.call(this, options);
		this.commonData_ = null;
	};
	inherit(MS, MultiScreen);
	MS.prototype.loadDeps = function() {
		var req = request.create('calld', this.commonDeps_);
		response.register(req, bind(this.loadData, this));
		req.send();
	};
	MS.prototype.loadData = function(data) {
		if (data.status === 'OK')
			this.commonData_ = json.parse(data.content);
		else this.commonData_ = {};
		this.depsLoaded_ = true;
		if (!this.isRendered) {
			this.fire('start-ready');
		}
	};
	MS.prototype.getData = function(screenName) {
		if (this.commonData_[screenName]){
			return this.commonData_[screenName];
		}
	};
	
	return MS;
});
