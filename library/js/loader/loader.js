/**
 * Static file loader
 * @module loader Allows for loading external dependencies like templates and CSS files
 * @provides loadCSS
 * */

define(['dom/dom', 'debug/console'], function(dom, logger) {
	var loaded = [];
	var pcli = logger.getInstance('loader');
	function reduceList(arr) {
		var a = [],
			i;
		for (i = 0; i < arr.length; i++) {
			if (loaded.indexOf(arr[i]) === -1) {
				a.push(arr[i]);
			}
		}
		return a;
	}

	function appendToHead(node) {
		document.getElementsByTagName('head')[0].appendChild(node);
	}

	function getTransport() {
		return new XMLHttpRequest();
	}

	function loadInStyle(list, cb) {
		var result = '';
		var style;

		function isComplete() {
			if (counter >= list.length) {
				pcli.log(['Done loading css, loaded:', list]);
				dom.adopt(dom.$('head'), dom.create('style', {
					text: result
				}));
				cb();
			}
		}
		var counter = 0;

		function getNext(item) {
			var req = getTransport();
			loaded.push(item);
			req.open('GET', item, true);
			req.onreadystatechange = function(aEvt) {
				if (req.readyState == 4) {
					if (req.status == 200) {
						result = result + req.responseText;
					}
					counter++;
					isComplete();
				}
			};
			req.send(null);
		}
		for (var i = 0; i < list.length; i++) {
			getNext(list[i]);
		}
	}
	//Module interface
	return {
		/**
		 * @method loadTemplate Loads HTML templates in an Iframe
		 * @param {String} The url to load, should be in the same domain to allow access from JS to the DOM constructs
		 */
		loadTemplate: function(url, cb, id) {
			var a = dom.create('iframe', {
				src: url,
				id: dom.getUniqueId(id),
				classes: 'tui-display-none'
			});
			a.onload = function() {
				pcli.log('template loaded');
				cb(this);
			};
			document.body.appendChild(a);
		},
		/**
		 * @method loadCSS Loads CSS files in the document if they are not already loaded, functions changed after 2beta and now uses XHR to get the CSS, thus you need to host it in the same domain as the main application. Alternative transport is allowed (loadExternalCSS) that uses a trick with image load even to notife when the css is done loading
		 * @param {Array} List of urls with CSS to load
		 * @param {Function} Callback to execute when all CSS is loaded
		 */
		loadCSS: function(list, cb) {
			var cur = reduceList(list);
			if (cur.length < 1) {
				pcli.log('All those files are already laoded');
				cb();
			} else {
				loadInStyle(cur, cb);
			}
		},
		/**
		 * @method loadCSSFromText Loads css rules from string, used in modules that get the scc via require/define text plugin
		 * @param {String} The CSS rules as text
		 * @param {String} [optional] Id to set in the style tag, if one is provided we check to see if we already have one and if we do we skip this one
		 */
		loadCSSFromText: function(cssstring, id) {
			var h = dom.$('head');
			var a = dom.create('style', {
				text: cssstring
			});
			if (typeof id === 'string') {
				if (dom.$('#' + id, h) !== null) {
					a = null;
					return;
				}
				a.setAttribute('id', id);

			}
			dom.adopt(h, a);
		},
		/**
		 * @method loadExternalCSS Used to load CSS that is not from the same domain, it will use the link attribute and a 'hack' to call the callback function once the CSS is loaded
		 * @param {String} The url of the css file to load in the document
		 * @param {Function} The callback function to call when the file is loaded in the document
		 */
		loadExternalCSS: function(css, cb) {
			var cur = reduceList([css]);
			if (cur.length !== 1 && typeof cb === 'function') {
				cb();
			}
			cur = cur[0];
			var link, img;
			link = document.createElement('link');
			link.setAttribute('href', cur);
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			loaded.push(cur);
			appendToHead(link);
			img = document.createElement('img');
			img.onerror = function() {
				if (typeof cb === 'function') {
					cb();
				}
				img.parentNode.removeChild(img);
			}
			img.setAttribute('style', 'position: absolute; left: -5000px;');
			document.body.appendChild(img);
			img.src = cur;
		},
		/**
		* Load JSONP source, if the resource has been already used, dispose of the node
		* @param {String} id The ID to use for the script tag, should be the same from the same domain
		* @param {String} url The url to load, tstamp will be added automatically
		*/
		loadJSONP: function(id, url) {
			console.log('try loading JSONP', url);
			var node = document.querySelector('#'+id);
			if (node) {
				dom.dispose(node);
				node = null;
			}
			var src = url + '&tstamp=' + (new Date().getTime());
			node = document.createElement('script');
			node.setAttribute('id', id);
			node.setAttribute('type', 'text/javascript');
			node.setAttribute('async', true);
			appendToHead(node);

			window.setTimeout(function() {
				node.setAttribute('src', src);
			}, 1);
		}
	};
});
