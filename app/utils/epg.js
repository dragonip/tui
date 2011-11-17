define([
	'oop/inherit',
	'utils/togglable',
	'utils/events',
	'utils/datetime',
	'utils/sizes',
	'tpl/epg',
	'dom/dom',
	'text!css/epg.css',
	'loader/loader',
	'tpl/infobuttons',
	'dom/classes',
	'dom/dom',
	'utils/scrollable',
	'shims/bind'
 ], function (inherit, Togglable, events, datetime, sizes, template, dom, css, loader, infobuttonstpl, classes, dom, Scrollable, bind){
	loader.loadCSSFromText(css);
	var EPGModel = function(dataCollection, taint_list) {
		Togglable.call(this);
		this.dataAccessor = dataCollection;
		this.dom = dom.create('div', {
			style: "width: " + sizes.getSizesForWindow().width + "px; height: " + sizes.getSizesForWindow().height + "px",
			classes: 'epgwrapper'
		});
		var bound = bind(this.selectItem, this);
		this.appEvents = {
			'return': {
				name: 'return',
				func: bind(function(key) {
					this.attachEvents(false);
				},this),
				attached: false
			},
			'down': {
				name: 'down',
				func: bound,
				attached: false
			},
			'up': {
				name: 'up',
				func: bound,
				attached: false
			}
		};
		this.taint(taint_list);
		this.Scrollable = new Scrollable('.epgProgram','.epg-selected');
		this.registerDisposable(this.Scrollable);
	};
	
	inherit(EPGModel, Togglable);
	
	EPGModel.prototype.current = 0;
	EPGModel.prototype.findCurrent = function() {
		var len = this.epgdata.length, i, now = datetime.getCurrentTime();
		//EPG info should be ordered by time, ascending!
		for (i = 0; i < len; i++) {
			if( this.epgdata[i][2] > now ) {
				this.current = i;
				return;
			}
		}
//		If no currently playing is found reset the selected item - this is when we load new channel
		this.current = 0;
	};
	
	EPGModel.prototype.selectItem = function(direction) {
		var nextItem;
		if (direction === 'up') {
			nextItem = this.current - 1;
			if ( nextItem >= 0 ) {
				this.current = nextItem;
				this.setCurrentItem();
			}
		} else if (direction === 'down') {
			nextItem = this.current + 1;
			if (nextItem < this.epgdata.length) {
				this.current = nextItem;
				this.setCurrentItem();
			}
		}
	};
	
	EPGModel.prototype.parseTimeOnPlace = function() {
		//No need to re-parse the date strings
		if (this.epgdata.length > 0 && this.epgdata[0][4].startTime) {
			return;
		}
		var i, len = this.epgdata.length, parsed_time; 
		for (i = 0; i < len; i++ ) {
			parsed_time = datetime.parseTime(this.epgdata[i][1]);
			this.epgdata[i][4].startTime = parsed_time.toDateString() + ' ' + parsed_time.getHours() + ':' + datetime.fillMinutes(parsed_time.getMinutes());
		}
	};
	EPGModel.prototype.rasterize_ = function(index) {
		this.dom_ = template.render({
			w: (tui.options.useScale?sizes.getSizesForEPG().width:sizes.getSizesForWindow().width),
			epgProgramHeight: sizes.getSizesForEPG().listHeight,
			channelThumb: this.dataAccessor.getPropertyFromItem('thumbnail', index),
			channelTitle: this.dataAccessor.getPropertyFromItem('publishName', index),
			things: this.epgdata
		});
		this.dom.innerHTML = this.dom_;
		classes.addClasses(dom.$$('.epgItem', this.dom)[this.current], 'epg-selected');
		this.Scrollable.scroll();
	};
	/**
	* Sets the selection focus (visual) on the currently selected item in the listing
	*/
	EPGModel.prototype.setCurrentItem = function() {
		var oldItem = dom.$('.epgItem.epg-selected');
		if (oldItem !== null) classes.removeClasses(oldItem, 'epg-selected');
		classes.addClasses(dom.$$('.epgItem', this.dom)[this.current], 'epg-selected');
		this.Scrollable.scroll();
	};
	EPGModel.prototype.load = function(index) {
		//Find out what to load from the data model
		this.epgdata = this.dataAccessor.getEPGForItem(index);
		this.parseTimeOnPlace();
		this.findCurrent();
		this.rasterize_(index);
	};
	EPGModel.prototype.enterDom = function() {
		tui.setPanels(false, true, false, infobuttonstpl.render({
			things: {
				arrows: "Move",
				info: "Hide EPG"
			}
		}));
		tui.scaleContainer(true);
		this.constructor.superClass_.enterDom.call(this);
		this.Scrollable.scroll();
	};
	EPGModel.prototype.exitDom = function() {
		if (this.isAttachedWithEvents) {
			this.attachEvents(false);
		}
		tui.scaleContainer(false);
		this.constructor.superClass_.exitDom.call(this);
		tui.setPanels(false, false);
	};
	EPGModel.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.dataAccessor;
		delete this.dom;
		delete this.dom_;
		delete this.epgdata;
		delete this.current;
	};
	return EPGModel;
});
