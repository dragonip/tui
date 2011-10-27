define(['json/json'],function (json){
	var Register = {};
	var Response = function(JSONString) {
		this.json = json.parse(JSONString);
		console.log('1');
		console.log(this.json);
		this.findCallback();
	};
	Response.prototype.findCallback = function() {
		var sid = this.json["header"]["sid"];
		if (typeof Register[sid] !== 'undefined') {
			if (!this.json["response"]) {
				console.log('No response found');				
			} else if (this.json["response"]["status"] === 'ok' ) {
				Register[sid][0].call(Register[sid][1], this.json["response"]["data"]);
			} else {
				console.log('Status of response is not "ok" ' + this.json.response.status );
			}
			delete Register[sid];
		} else {
			console.log('No registered callback for received object:');
			console.log(this.json);
		}
		this.disposeInternal();
	};
	Response.prototype.disposeInternal = function() {
		this.json = null;
		delete this.json;
	};
	return {
		register: function(Request, callback, context) {
			Register[Request.json["header"]["sid"]] = [ callback, context ];
			console.log(Register);
		},
		recall: function(JSONString) {
			var response = new Response(JSONString);
		}
	};
});
