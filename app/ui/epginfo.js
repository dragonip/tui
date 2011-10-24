define(['text!css/epg.css', 'tpl/epg', 'loader/loader', 'debug/console', 'dom/dom', 'utils/sizes', 'dom/dom', 'dom/classes'], function (css, epgtpl, loader, logger, dom, sizes, dom, domclasses) {
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
		data: null,
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
			});
			if (obj.things.length > 0){
				var now = (new Date()).getTime();
				var epgContainer = dom.$('.epgProgram', this.dom);
				var itemHeight = epgContainer.firstChild.getClientRects()[0].height;
				var itemsLength = obj.things.length
				for (var i = 0; i < itemsLength; i++ ) {
					if ( obj.things[i][2] > now ) {
						//found our currently playing item!
						epgContainer.scrollTop = itemHeight * i;
						domclasses.addClasses(epgContainer.children[i], ['epg-currently-playing','epg-selected']);
						return;					
					}
				}
			}
			this.data = obj.things;
		}, 
		selectItemByMove: function(direction, data) {
//			var epgContainer = dom.$('.epgProgram', this.dom);
//			var allItems = dom.$$('.epgItem', epgContainer);
//			if (allItems.length < 1) return;
//			var activeNumber = dom.dataGet(dom.$('.epg-selected'), 'sequence');
//			if (direction === 'up') {
//				if (activeNumber > 1) {
//					
//				}
//			}
		},
		hide: function(){
			if (this.visible) {
				dom.dispose(this.dom);
				this.visible = false;
			}
		}
	};
});

