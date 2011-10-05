define(['text!css/epg.css','loader/loader', 'dom/dom'], function(css, loader, dom) {
	loader.loadCSSFromText(css);
	var overlay = dom.create('div', {
		classes: 'epgoverlay',
		style: 'width: ' + window.innerWidth + 'px; height:' + window.innerHeight + 'px;'
	});
	var epg = dom.create('div', {
		classes: 'epg',
		style: 'width: 400px; height: 400px;'
	});
	//dom.adopt(overlay, epg);
	return {
		show: function(html) {
			epg.innerHTML = html;
			dom.adopt(dom.$('body'), overlay);
			dom.adopt(overlay, epg);
		},
		hide: function() {
			dom.dispose(overlay);
		}

	};
});
