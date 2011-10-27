	require.config({
		baseUrl: "app",
		paths: {
			"types" : "../library/js/types",
			"window": "../library/js/window",
			"utils/autoid": "../library/js/utils/autoid",
			"templates/compiler" :"../library/js/templates/compiler",
			"support": "../library/js/support",
			"shims" : "../library/js/shims",
			"oop" : "../library/js/oop",
			"nls" : "../library/js/nls",
			"net" : "../library/js/net",
			"loader" : "../library/js/loader",
			"host" : "../library/js/nost",
			"env/exports" : "../library/js/env/exports",
			"dom" : "../library/js/dom",
			"debug" : "../library/js/debug",
			"array" : "../library/js/array",
			"text" : "../library/js/text",
			"json" : "../library/js/json"
		},
		urlArgs: "bust=" +  (new Date()).getTime()
	});

require(['transport/response'], function(response) {
	window.tui = {
		options : {
			debug: true
		}
	};
	window.transportReceiver = function(JSONString) {
		console.log("received message from server");
		response.recall(JSONString);
	};
	require(['net/socket', 'transport/request'], function(socket, request) {
		var myRequest = request.create('getiptvlist');
		response.register(myRequest, function(data) {
			alert(data);
		}, null);
		myRequest.json.response = {
			status: 'ok',
			data: null
		};
		myRequest.send();
		myRequest.disposeInternal();
	});
});

