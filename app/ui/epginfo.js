define(['text!css/epg.css', 'tpl/epg', 'loader/loader', 'debug/console', 'dom/dom', 'utils/sizes' ], function (css, epgtpl, loader, logger, dom, sizes) {
	loader.loadCSSFromText(css);
	function parserTime(objects) {
		objects.forEach(function(item) {
			var b = new Date(parseInt(item[1]));
			item[4].parsedTime = b.toDateString() + ' ' + b.getHours() + ':' + b.getMinutes();
		});
	}
	return {
		logger: logger.getInstance('EPG'),
		dom: dom.create('div', {
			style: "width: " + sizes.getSizesForWindow().width + "px; height: " + sizes.getSizesForWindow().height + "px",
			classes: 'epgwrapper'
		}),
		isVisible: false,
		parseTime: parserTime,
		show: function() {
			if (!this.visible) {
				this.logger.log('Showing EPG');
				dom.adopt(this.dom);
				this.visible = true;
			}
		},
		display: function(obj) {
			this.logger.log(['Updating EPG with info:', obj]);
			this.parseTime(obj.things);
			this.dom.innerHTML = epgtpl.render({
				//This works for when we scale
				w: (tui.options.useScale?sizes.getSizesForEPG().width:sizes.getSizesForWindow().width),
				epgProgramHeight: sizes.getSizesForEPG().listHeight,
				channelThumb: obj.icon,
				channelTitle: obj.title,
				things: obj.things		
			})
		}, 
		hide: function(){
			if (this.visible) {
				dom.dispose(this.dom);
				this.visible = false;
			}
		}
	};
});

