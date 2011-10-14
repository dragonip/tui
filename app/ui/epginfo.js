define(['text!css/epg.css', 'tpl/epg', 'loader/loader', 'debug/console', 'dom/dom', 'utils/sizes' ], function (css, epgtpl, loader, logger, dom, sizes) {
	loader.loadCSSFromText(css);
	var pcli = logger.getInstance('EPG');
	var epg_div = dom.create('div', {
		style: "width: " + sizes.window.w + "px; height: " + sizes.window.h + "px",
		classes: 'epgwrapper'
	});
	var visible = false;
	function parserTime(objects) {
		objects.forEach(function(item) {
			var b = new Date(parseInt(item[1]));
			item[4].parsedTime = b.toDateString() + ' ' + b.getHours() + ':' + b.getMinutes();
		});
	}
	//dom.adopt(overlay, epg);
	return {
		show: function () {
			if (!visible) {
				document.body.appendChild(epg_div);
				visible = true;
			}
		}, 
		display: function(obj) {
			parserTime(obj.things);
			var a = epgtpl.render({
				w: sizes.epgpanel.w,
				epgProgramHeight: sizes.epgpanel.listHeight,
				channelThumb: obj.icon,
				channelTitle: obj.title,
				things: obj.things
				
			});
			epg_div.innerHTML = a;
		},
		hide: function() {
			if (visible) {
				dom.dispose(epg_div);
				visible = false;
			}
		}
	};
});

