define([
	'oop/inherit',
	'utils/visualapp',
	'utils/miniscreen',
	'dom/dom',
	//Pull another dependency, just because the webkit of M55 is too old to know what Function.bind is...
	'shims/bind',
	'net/simplexhr'
], function (inherit, VisualApp, Mini, dom, bind, xhr) {
	
	var App = function(options) {
		VisualApp.call(this, options);
		//Setup events
		this.screens = options.miniscreens;
		this.assets = {};
		this.currentScreenIndex = 0;
		this.initScreens();
		this.loadDeps();
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
	
	App.prototype.currentScreenIndex = 0;
	App.prototype.isRendered = false;
	App.prototype.depsLoaded_ = false;
	App.prototype.reload = function() {
		delete this.isRendered;
		this.loadDeps();
	};

	App.prototype.loadDeps = function() {
		var deps = [], key, order = [];
		for (key in this.assets) {
			order.push(key);
			deps.push(this.assets[key].src);
		}
		if (deps.length === 0) {
			this.depsLoaded_ = true;
			return;
		}
		xhr.getMany(deps, bind(this.loadData, this, order), {
			parse: true
		});
	};
	
	App.prototype.loadData = function(order, Results) {
		var i;
		for (i = 0; i < Results.length; i++) {
			this.assets[order[i]].data = Results[i];
		}
		this.depsLoaded_ = true;
		if (!this.isRendered) {
			this.fire('start-ready');
		}
	};
	
	App.prototype.initScreens =  function(options) {
		var i, len = this.screens.length;
		for (i = 0; i < len; i ++ ) {
			if (this.screens[i].deps_) {
				this.registerDataDependency(this.screens[i].name, this.screens[i].deps_);
			}
			this.screens[i].master = this;
		}
	};
	
	App.prototype.registerDataDependency = function(assetID, dataSource ) {
		if (!this.assets[assetID]) {
			this.assets[assetID] = {
				src: dataSource,
				data: null
			};
		}
	};
	
	App.prototype.onShowRequested = function() {
		if (!this.isRendered) {
			this.innerContainer.style.width = this.container.style.width;
			this.innerContainer.style.height = this.container.style.height;
			var i;
			for (i = 0; i < this.screens.length; i++) {
				this.screens[i].render(this.innerContainer);
			}
			this.isRendered = true;
		}
//		Empty the container because we will use "adopt" in this screen
		this.container.innerHTML = '';
		if (this.innerContainer.parentNode === null)
			dom.adopt(this.container, this.innerContainer);
		this.fire('show-complete');
	};
	
	App.prototype.getData = function(assetName) {
		if (this.assets[assetName]) return this.assets[assetName].data;
		return undefined;
	};
	
	App.prototype.onShowComplete = function() {
		this.attachEvents(true);
		this.activateScreen(this.currentScreenIndex);
	};
	
	App.prototype.onStopRequested = function() {
		this.screens[this.currentScreenIndex].attachEvents(false);
		this.attachEvents(false);
	};
	App.prototype.start = function() {
		if (!this.depsLoaded_) {
			return;
		}
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
	App.prototype.activateScreen = function(index, intentOptions) {
		if (typeof index === 'number') {
			this.screens[this.currentScreenIndex].attachEvents(false);
			this.currentScreenIndex = index;
			this.innerContainer.scrollTop = 480 * this.currentScreenIndex;
			this.screens[this.currentScreenIndex].attachEvents(true, intentOptions);
		}
	};
	App.prototype.disposeInternal =  function() {
		this.constructor.superClass_.disposeInternal.call(this);
		delete this.screens;
	};
	return App;
});
