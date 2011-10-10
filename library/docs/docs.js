/**
 * @author Peter StJ
 * Small script to make the docs more usable
 * We compose a small html file using SED to only list the modules and its methods 
 * After that the docs file is not very useful, thus we apply some DOM trickery to make it usable 
 * The script requires the latest and greatest to work, but should already have that, providing you intend to use TUI
 */
(function() {
	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}
	window.addEventListener('load', function() {
		var top = document.querySelector('#content');
		//
		// hide visually the container and make it display block to calculate the original sizes
		// 
		top.style.position = 'absolute';
		top.style.left = '-2000px';
		top.style.display = 'block';
		top.style.width = window.innerWidth;
		
		//
		// Separate param names and fix new lines
		// 
		var els = top.querySelectorAll('div.params'),
			i, text, l = els.length, h1, h2, t1;
		for (i = 0; i < l; i++ ) {
			text = trim(els.item(i).textContent).split(' ');
			els.item(i).innerHTML = '<span class="paramtype">' + text.shift() + '</span>';
			t1 = text.join(' ').replace(/&nl/g, '<br>');
			console.log(t1);
			els.item(i).innerHTML = els.item(i).innerHTML + t1;
		}
		//
		// separate methods and put the params under each method
		// 
		els = top.querySelectorAll('div.method');
		l = els.length;
		for ( i = 0 ; i < l ; i ++ ) {
			h1 = els.item(i).nextElementSibling;
			h2 = [];
			while (h1 !== null && h1.className.split(/\s+/).indexOf('params') !== -1 ) {
				h2.push(h1);
				h1 = h1.nextElementSibling;
			}
			h2.forEach(function(item) {
				els.item(i).appendChild(item);
			});
			h2 = [];
		}

		//
		// link the methods to each module and save original sizes
		// 
		els = top.querySelectorAll('p.module');
		l = els.length;
		for ( i = 0; i < l; i++) {
			text = trim(els.item(i).textContent).split(' ');
			els.item(i).innerHTML = '<span class="module-name">' + text.shift() + '</span>' + text.join(' ');

			els.item(i).dataset['number'] = i;
			els.item(i).dataset['hidden'] = true;
			h1 = els.item(i).nextElementSibling;
			while ( h1 !== null && h1.nodeName.toLowerCase() !== 'p' ) {
				h1.dataset['foritem'] = i;
				h1.dataset['h'] = h1.clientHeight;
				h1.style.height = '0px';
				h1 = h1.nextElementSibling;
			}
		}
		//
		// subscribe to clicks on the P (module) elements
		// 
		document.addEventListener('click', function(ev) {
			if (ev.target.nodeName.toLowerCase() === 'p' && ev.target.className.split(/\s+/).indexOf('module') !== -1 ){
				var i = ev.target.dataset['number'], j;
				var enable = ev.target.dataset['hidden'];
				ev.target.dataset['hidden'] = (enable === 'true') ? false : true;
				var els = document.querySelectorAll('div[data-foritem="'+i+'"]');
				for (j = 0; j < els.length; j++) {
					if (enable === 'true') {
						els.item(j).style.height = els.item(j).dataset['h'] + 'px';
					} else {
						els.item(j).style.height = '0px';
					}
				}
				ev.target
			}
		}, false );
		//
		// Show the docs to the user
		// 
		top.setAttribute('style', 'display: block');
	}, false);
})();
