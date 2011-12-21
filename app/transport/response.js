define(function (){
	var RemoteKeyHandler = null;
	var STATUS = {
		OK: 'OK',
		FAIL: 'FAIL'
	};
	var Register = {};
	var Response = function(JSON) {
		this.json = JSON; //(typeof JSONString === 'string') ? json.parse(JSONString): JSONString;
		this.findCallback();
	};
	Response.prototype.findCallback = function() {
		var sid = this.json["header"]["tag"];
		console.log('Received packet', this.json);
		switch (this.json['header']['type']) {
		case 'response':
			if (typeof Register[sid] !== 'undefined') {
				if (!this.json["response"]) {
					console.log('No response found, errornewos packet');
				} else {
					switch (this.json['response']['status']) {
						case STATUS.FAIL:
							console.log('Status of response is not "ok" ' + this.json.response.status );
							break;
						default:
							break;
					}
					Register[sid][0].call(Register[sid][1], this.json["response"]);
				}
				delete Register[sid];
			} else {
				console.log('No registered callback for received object:', this.json);
			}
			break;
		case 'event':
			switch (this.json['header']['method']) {
				case 'media':
					tui.globalPlayer.handleEvent(this.json);
					break;
				case 'player':
					tui.globalPlayer.handleEvent(this.json);
					break;
				case 'remote':
					if (RemoteKeyHandler !== null) {
						RemoteKeyHandler(this.json['event']['key']);
					}
					break;
				case 'telephony':
					window.exportedSymbols['telephony']['setLineStatus'](this.json['event']);
					break;
				case 'cmd':
					switch (this.json['event']['action']) {
						case 'reloadconfig':
							tui.signals.refreshConfig();
							break;
						case 'refreshdata':
							tui.signals.refreshLists();
							break;
						case 'reloadinterface':
							console.log('Reload interface coming');
							window.location.reload(true);
							break;
						case 'reload_lists':
							console.log('Reload lists coming');
							break;
						default: break;
					}
					console.log('Received packet with remote cmd', this.json);
					break;
				default: 
					break;
			}
			break;
		case 'reply':
			//
			// TODO: Find out what replies are
			// 
			break;
		default:
			console.log('No matching handler for this packet', this.json);
			break;
		}
		this.disposeInternal();
			

//
// 
// 
// 		if (this.json['header']['type'] == 'response') {
// 			if (typeof Register[sid] !== 'undefined') {
// 				if (!this.json["response"]) {
// 					console.log('No response found');
// 				} else if (this.json["response"]["status"].toLowerCase() === 'ok' ) {
// 					Register[sid][0].call(Register[sid][1], this.json["response"]);
// 				} else {
// 					console.log('Status of response is not "ok" ' + this.json.response.status );
// 					Register[sid][0].call(Register[sid][1], this.json["response"]);
// 				}
// 				delete Register[sid];
// 			} else {
// 				console.log('No registered callback for received object:', this.json);
// 			}
// 		}
// 		else if (this.json['header']['type'] == 'event') {
// 			if (this.json['header']['method'] == 'media' || this.json['header']['method'] === 'player' )
// 				tui.globalPlayer.handleEvent(this.json);
// 			else if (this.json['header']['method'] == 'remote') {
// 				if (this.json['event']['key'] === 'settz|GMT+5') return;
// 				if (RemoteKeyHandler !== null ) RemoteKeyHandler(this.json['event']['key']);
// 			} else if ( this.json['header']['method'] === 'telephony') {
// 				console.log('Received update for phone');
// 				window.exportedSymbols['telephony']['setLineStatus'](this.json['event']);
// 			} 
// 		} else {
// 			console.log('No match yet for this packet', this.json);
// 		}
// 		this.disposeInternal();
// 
	};
	Response.prototype.disposeInternal = function() {
		this.json = null;
		delete this.json;
	};
	return {
		register: function(Request, callback, context) {
			Register[Request.json["header"]["tag"]] = [ callback, context ];
		},
		recall: function(JSON) {
			var response = new Response(JSON);
		},
		setRemoteKeyHandler: function(func) {
			RemoteKeyHandler = func;
		}
	};
});
