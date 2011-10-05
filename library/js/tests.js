//Enable DEBUG
window.DEBUG = {};
//
// window.DEBUG.popup = true;
// 




//
// require(['oop/events', 'debug/console'], function(e, logger) {
// 	var pcli = (function() {
// 		var a = logger.getInstance('tester');
// 		return function() {
// 			a.log.apply(a, arguments);
// 		};
// 	}());
// 	
//  	//Constructor funcion
//  	var a = function(opts) {
//  		pcli('Construct new object');
//  		this.name = opts.name;
//  	}
//  	//augment the constructor to support on
//  	e(a);
//  	var A = new a({name: 'peps'});
//  	var B = new a({name: 'marti'});
//  
//  	A.getEvents();
//  	A.on('change', function() { pcli('ura'); });
//  	A.getEvents();
//  	A.fire('change');
//  	B.on('change', function() { pcli('ura marti'); });
// 	B.fire('change');
// });
// 
// 
//Your test entry point
//Test platform
//
// require(['debug/console', 'host/platform'], function(d, plat) {
// 	var de = d.getInstance('platform');
// 	de.log(plat.engine);
// 	de.log(plat.os);
// });
// 
//
// //test autoid
// 
//
// require(['debug/console', 'utils/autoid'], function(d, autoid) {
// 	alert('loaded');
// 
	//
	// var a = autoid.getInstance('one');
	// var b = autoid.getInstance('two');
	// console.log(a);
	// //
	// // var de = new d('autoid');
	// // var a = new autoid('one');
	// // var b = new autoid('two');
	// // 
	// de.log([a.get(), a.get(), a.get()]);
	// de.log([a.get(), b.get(), a.get()]);
	// 
//
// });
// 
//
// require(['debug/console','host/events'], function(debug, events) {
// 	var d = debug.getInstance('host events');
// 	var a = document.createElement('a');
// 	a.href = 'javascript://';
// 	a.innerHTML = 'Test';
// 	events.add(a, 'click', function(e) {
// 		e.preventDefault();
// 		d.log('Clicked');
// 	});
// 	document.body.appendChild(a);
// });
// // 
// // Test getting text files from server
// require(['debug/console', 'net/xhr'], function(logger, net) {
// 	var pcli = logger.getInstance('main');
// 	net.get('js/text.js', {
// 		callback: function(data) {
// 			pcli.log('Returned data from server !!!');
// 		}
// 	});
// 	net.get('nonext.js');
// });
// 
// test jade template retrieval
/*
require(['templates/compiler', 'debug/console'], function(tplc, debug) {
	var pcli = debug.getInstance('compilertest');
	tplc.getTemplate('test', function(tpl) {
		var b = tpl({ name: 'p' });
		pcli.log(b);
	});
});
*/
//
// require(['support/jademin','debug/console'], function(jade, logger) {
// 	var pcli = logger.getInstance('test jade');
// 	pcli.log(jade);
// 	pcli.log(jade.compile('div')());
// });
// 
// Test pre-build templates
//
// require(['templates/test.js', 'debug/console'], function(tpl, dbg) {
// 	var pcli = dbg.getInstance('template test');
// 	var res = tpl.render({name: 'Peter'});
// 	pcli.log(res);
// });
// 
require(['oop/augment', 'debug/console'], function(au, logger) {
	var pcli = logger.getInstance('test_augmentor');
	function test0() {
		//
		// this.name = 'hui';
		// 
	};
	au(test0, 'events');
	var a = new test0();
	console.log(a);
	a.on('change', function() {
		pcli.log('Augmentor works');
	});
	a.fire('change');
});
