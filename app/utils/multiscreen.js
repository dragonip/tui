define([
	'oop/inherit',
	'utils/visualapp',
	'utils/miniscreen',
	'dom/dom',
	//Pull another dependency, just because the webkit of M55 is too old to know what Function.bind is...
	'shims/bind'
], function (inherit, VisualApp, Mini, dom, bind) {
	
	var App = function(options) {
		VisualApp.call(this, options);
		//Setup events
		this.screens = [];
		this.currentScreenIndex = 0;
		this.initScreens(options);
		this.innerContainer = document.createElement('div');
		this.innerContainer.className = 'tui-horizontal-centered tui-scrollable-vertical';
//		var bound = (function(that){return function(key){that.selectMiniScreen.call(that, key);}  })(this);
		var bound = bind(this.selectMiniScreen, this);
		this.appEvents = {
			chup: {
				name: "chup",
				func: bound,
				attached: false
			},
			chdown: {
				name: 'chdown',
				func: bound,
				attached: false
			}
		};
		this.on('start-requested', this.start);
		this.on('show-requested', this.onShowRequested);
		this.on('show-complete', this.onShowComplete);
//		this.on('selection-changed', this.onSelectionChanged);
		this.on('stop-requested', this.onStopRequested);
//		this.on('data-load-end', this.onDataLoadEnd);
		
	};
	inherit(App, VisualApp);
	App.prototype.initScreens =  function(options) {
		var i, screens = options.miniscreens, len = screens.length;
		for (i = 0; i < len; i ++ ) {
			this.screens.push(new Mini(screens[i].template));
			this.registerDisposable(this.screens[length-1]);
		}
	};
	App.prototype.isRendered = false;
	App.prototype.onShowRequested = function() {
		if (!this.isRendered) {
			console.log('Try and show all mini screens')
			this.innerContainer.style.width = this.container.style.width;
			this.innerContainer.style.height = this.container.style.height;
			var i;
			for (i = 0; i < this.screens.length; i++) {
				this.screens[i].render(this.innerContainer);
			}
			this.isRendered = true;
		}
			//Empty the container because we will use "adopt" in this screen
		this.container.innerHTML = '';
		dom.adopt(this.container, this.innerContainer);
		this.fire('show-complete');
	};
	App.prototype.onShowComplete = function() {
		console.log('Attaching events')
		this.attachEvents(true);
		console.log('Events attached')
	};
	App.prototype.onStopRequested = function() {
		this.attachEvents(false);
	}
	App.prototype.start = function() {
		//For now just be ready to display itself
		this.fire('start-ready');
	};
	App.prototype.selectMiniScreen = function(direction){
		if (direction === 'chdown') {
			if (this.currentScreenIndex + 1 < this.screens.length) {
				this.activateScreen(this.currentScreenIndex + 1);
			}
		} else if ( direction === 'chup') {
			if (this.currentScreenIndex - 1 > -1 ) {
				this.activateScreen(this.currentScreenIndex - 1);
			}
		}
	};
	App.prototype.activateScreen = function(index) {
		if (typeof index === 'number') this.currentScreenIndex = index;
		this.innerContainer.scrollTop = 480 * this.currentScreenIndex;
	};
	App.prototype.disposeInternal =  function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.screens;
	}
	return App;
});
