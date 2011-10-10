/**
 * @module throbber Provides throbbing test to use as loading indicator on lower end STB/Systems
 */
define(['debug/console'], function(logger) {
	var opts = {
		element: document.body,
		text: 'Loading...',
		startColor: '#000',
		endColor: '#fff'
	}, pcli = logger.getInstance('utils/throbber');
	function updateOpts(obj) {
		var k;
		for (k in obj) {
			if (typeof opts[k] !== 'undefined') {
				opts[k] = obj[k];
			}
		}
	}
	var tobber;
	tobber = document.createElement('div');
	tobber.className = 'tui-text-tobber';
/*	// create div with backgorund opacity
	var backdiv;
	backdiv = document.createElement('div');
	backdiv.className = 'tobberBackground';*/
	
	return {
		/**
		 * @method start Shows a throbber on the screen
		 * @param {Object} Object representing the options for the throbber, the following options are recognized&nlelement: The element to embed the throbber in&nltext: the text to use on the throbber
		 */
		start: function(options) {
			if (typeof options === 'object') {
				updateOpts(options);
			}
			tobber.innerHTML = opts.text;
			tobber.style.height = opts.element.style.height;
			tobber.style.width = opts.element.style.width;
			tobber.style.top = '-' +window.innerHeight + 'px';
			//
			// tobber.style.lineHeight = opts.element.style.height;
			// 
			opts.element.appendChild(tobber);
			/*opts.element.appendChild(backdiv);*/
		},
		/**
		 * @method stop Stops the throbber and removes it from the DOM
		 */
		stop: function() {
			pcli.log('called stop tobber');
			tobber.parentNode.removeChild(tobber);
		/*	backdiv.parentNode.removeChild(backdiv);*/
		}
	};
});
