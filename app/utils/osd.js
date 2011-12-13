define([
	'transport/request'
], function (request) {
	var OSD = function() {
		this.state_ = OSD.OFF;
	};
	OSD.prototype.defaultTimeout_ = 3;
	OSD.prototype.setContent = function(opt_msg, opt_timeout, opt_icon) { 
		var req = request.create('osd', {
			'action': 'show',
			'timeout': opt_timeout || this.defaultTimeout_,
			'messsage': opt_msg || this.defaultMessage_,
			'icon': opt_icon
		});
		req.send();
	};
	OSD.prototype.clear = function() {
		var req = request.create('osd', {
			'action': 'hide'
		});
		req.send();
	};
	OSD.states = {
		OFF: 1,
		ON: 2 
	};
	return OSD;
});
