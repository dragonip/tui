define(['utils/events', 'utils/defaultactions', 'utils/baseapp'], function(events, defaultactions, baseapp){
	function setCurrentIndex(o) {
		this.model.currentIndex = o.index;
	}
	function attachEvents() {
		events.addHandlers(this.appEvents);
	}
	function stopApplication() {
		this.model.unload();
		this.presentation.unload();
		events.removeHandlers(this.appEvents);
	}
	function completedLoad(data) {
		if (data.type === 'list') {
			this.fire('start-ready');
		} else if (data.type === 'folder') {
			this.presentation.show();
			if (typeof data.index !== 'undefined') this.presentation.activate(data.index);
		}
	}
	function startRequested() {
		if (!this.model.isLoaded) {
			this.model.loadData({
				type: 'list'
			});
		} else {
			this.fire('start-ready');
		}
	}
	return function(config){
		var app = baseapp({config: config});
		app.appEvents = defaultactions(app);
		app.on('start-requested', startRequested)
		app.on('selection-changed', setCurrentIndex);
		app.on('show-complete', attachEvents);
		app.on('stop-requested', stopApplication);
		app.on('data-load-end', completedLoad);
//		app.on('data-load-start', nullFunc);
				
		return app;
	};
});
