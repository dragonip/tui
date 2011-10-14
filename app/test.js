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
		},
		urlArgs: "bust=" +  (new Date()).getTime()
	});
require(['ui/epginfo'], function(xhr) {
//	var urlList = ['app/tpl/appselector.jade',  'app/tpl/list.jade', 'app/tpl/games.jade'];
//	xhr.getMany(urlList, function(list) {
//		console.log(list);
//	}, {stripJSON: false});
	console.log(xhr)
});
