//Example using remote debugger
/**
 * @module debugger Module to use to receive remote debug messages on console, use in browsers that have working console only. Should be used with nodejs with m55debug and the debugged party sghould also use the remote debugger protocol
 */
//
// require(['socket.io/socket.io.js'], function() {
// 	var dbg = io.connect(window.location.protocol + '//' + window.location.host);
// 	dbg.on('debugm', function(data) {
// 		console.log(data);
// 	});
// 	dbg.emit('debugger');
// });
// 
(function() {
	function getElementsByClass(searchClass, node, tag) {
		var classElements = new Array();
		if (node == null) node = document;
		if (tag == null) tag = '*';
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
		for (i = 0, j = 0; i < elsLen; i++) {
			if (pattern.test(els[i].className)) {
				classElements[j] = els[i];
				j++;
			}
		}
		return classElements;
	}
	var getByClass = (function() {
		if (document.getElementsByClassName) {
			return function(op) {
				return document.getElementsByClassName(op);
			}
		} else {
			return function(op) {
				return getElementsByClass(op);
			}
		}
	}());
	if (!Array.indexOf) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] == obj) {
					return i;
				}
			}
			return -1;
		}
	}
	var body = document.body;
	var dom = document.createElement('div');
	var known_modules = [];
	var select = document.createElement('select');
	var filter = false;

	function start() {
		constructOption('None');
		document.body.appendChild(select);
		select.onchange = function() {
			var a = this.options[this.selectedIndex].value;
			if (a !== 'None') {
				filterResults(a);
			} else {
				removeFiltering();
			}
		};
	};
	function removeFiltering() {
		filter = false;
		var dom = getByClass('item');
		for (var i = 0; i < dom.length; i++) {
			dom[i].style.display = 'block';
		}
	}
	function filterResults(name) {
		removeFiltering();
		filter = name;
		var dom = getByClass('item');
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].getAttribute('data-main-name') !== filter) {
				dom[i].style.display = 'none';
			}
		}
	}
	function constructOption(modname) {
		var optionnull = document.createElement('option');
		optionnull.setAttribute('value', modname);
		optionnull.innerHTML = modname;
		select.appendChild(optionnull);
	}
	dom.className = 'item';
	window.log = function(name, str) {
		var time = new Date();
		var timestring = time.getMinutes() + ' : ' + time.getSeconds() + ' : ' + time.getMilliseconds();
		//
		// var timestring = '';
		// 
		var a = dom.cloneNode(false);
		a.setAttribute('data-main-name', name);
		str = '<div data-name="' + name + '">' + name + '<span class="timestamp">' + timestring + '</span>' + '</div>' + '<div class="debug" >' + str + '</div>';
		a.innerHTML = str;
		if (filter && filter !== name) {
			a.style.display = 'none';
		}
		body.appendChild(a);
		if (known_modules.indexOf(name) === -1) {
			known_modules.push(name);
			constructOption(name);
		}
	}
	window.onload = function() {
		start();
		window.opener.exportedSymbols.debug.windowReady(window.name);
	};
}());
