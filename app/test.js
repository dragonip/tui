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

//Test the vkbs class -- result is : very fast kbd working!
//require(['ui/vkbd', 'dom/dom', 'dmc/dmc'], function(KBD, dom, dmc) {
//		var kbdcont = dom.create('div');
//		dmc.initAPI();
//		dom.adopt(kbdcont);
//		var kbd = new KBD();
//		kbd.show(kbdcont);
//		kbd.addCustomLayout('bg_bg');
//		kbd.addCustomLayout('il_il');
//		dmc.onKeyPress(kbd.getEventHandler());
//});
//Test the dialog with kbd - maybe problem is there
require(['ui/popup', 'dmc/dmc', 'shims/bind'], function(Dialogs, dmc, bind){
	console.log('a')
	dmc.initAPI();
	console.log(2);
	var dialog = new Dialogs.Text('password', true, function(value) { console.log(value);}, 'Test');
	console.log(3)
	dialog.show();
	console.log(4)
	dmc.onKeyPress(bind(dialog.eventHandler, dialog));
});
	
	
//Test the kbd template
/*require(['tpl/vkbs', 'dom/dom', 'text!css/vkbd.css', 'loader/loader'], function(template, dom, css, loader){
	loader.loadCSSFromText(css);
	document.body.style.backgroundColor = 'black'
	var div = dom.create('div', {
		html: template.render({
			kbdlayout: [
				["`","1","2","3","4","5","6","7","8","9",'0','Delete'],
				["q","w","e","r","t","y","u","i","o","p",'[',']','/'],
				["a","s","d","f","g","h","j","k","l",';','"',"Return"],
				['Shift',"z","x","c","v","b","n","m",",",".",'+','-'],
				['Lang:En',' ','www.','.com']
			]
		})
	});
	dom.adopt(div);
});*/

//Test the JSON transport
//require(['transport/response'], function(response) {
//	window.tui = {
//		options : {
//			debug: true
//		}
//	};
//	window.transportReceiver = function(JSONString) {
//		console.log("received message from server", JSONString);
//		response.recall(JSONString);
//		console.log('END')
//	};
//
//	var webcontent = '';
//	window.getContent = function() {
//		return webcontent;
//	}
//
//	require(['net/socket', 'transport/request', 'transport/requestheader', 'dom/dom'], function(socket, request, header, dom) {
//		var myRequest = request.create('calld', {run: 'iptv_json_list', newif: 1}, 'http://www.google.bg/');
//		response.register(myRequest, function(respObj) {
//			console.log('Loaded frm socket, parsed and now render', respObj.content)
////			webcontent = respObj.content
////			var div = dom.create('div');
////			var frame = dom.create('iframe', {
////				src : 'javascript:top.getContent()'
////			});
////			dom.adopt(div, frame)
////			dom.adopt(div);
//		}, null);
////		myRequest.json.response = {
////			status: 'ok',
////			data: null
////		};
//		myRequest.send();
//		myRequest.disposeInternal();
//	});
//});
//console.log(typeof Function)
//console.log(typeof Function.bind)
//require(['json/json', 'net/simplexhr'], function(json, xhr) {
//	xhr.get("/cgi-bin/voip.cgi?run=vod_json_list&newif=1", function(text, r) {
//		console.log(json.parse(text));
//	});
//});
