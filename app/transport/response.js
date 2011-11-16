define(['json/json'],function (json){
	var Register = {};
	var Response = function(JSONString) {
		this.json = json.parse(JSONString);
		this.findCallback();
	};
	Response.prototype.findCallback = function() {
		var sid = this.json["header"]["tag"];
		if (this.json['header']['type'] == 'response') {
			if (typeof Register[sid] !== 'undefined') {
				if (!this.json["response"]) {
					console.log('No response found');
					console.log(this.json);
				} else if (this.json["response"]["status"].toLowerCase() === 'ok' ) {
					Register[sid][0].call(Register[sid][1], this.json["response"]);
				} else {
					console.log('Status of response is not "ok" ' + this.json.response.status );
					Register[sid][0].call(Register[sid][1], this.json["response"]);
				}
				delete Register[sid];
			} else {
				console.log('No registered callback for received object:');
				console.log(this.json);
			}
		}
		else if (this.json['header']['type']=='event') {
			tui.globalPlayer.handleEvent(this.json);
		}
		this.disposeInternal();
	};
	Response.prototype.disposeInternal = function() {
		this.json = null;
		delete this.json;
	};
	return {
		register: function(Request, callback, context) {
			Register[Request.json["header"]["tag"]] = [ callback, context ];
		},
		recall: function(JSONString) {
			var response = new Response(JSONString);
		}
	};
});
