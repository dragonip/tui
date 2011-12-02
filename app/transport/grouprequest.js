define([
	'transport/request',
	'transport/response',
	'shims/bind'
], function(
	request,
	response,
	bind ){
	var Group = function( callback, var_requests) {
		this.requestList = Array.prototype.slice.call(arguments, 1);
		this.callback = callback;
		this.resultList = [];
		this.counter = 0;
		this.startRequests_();

	};
	Group.prototype.startRequests_ = function() {
		var i, req
		for (i = 0; i < this.requestList.length; i++) {
			response.register(this.requestList[i], bind(this.getResponse, this, i));
			this.requestList[i].send();
		}
	};
	Group.prototype.getResponse = function( resultNumber, result ) {
		this.counter++;
		this.resultList[resultNumber] = result;
		if (this.counter >= this.requestList.length) {
			this.callback(this.resultList);
			this.disposeInternal();
		}
	};
	Group.prototype.disposeInternal = function() {
//			this.requestList = null;
			delete this.requestList;
//			this.resultList = null;
			delete this.responseList;
			delete this.callback;
			delete this.counter;
	};
	return Group;
});
