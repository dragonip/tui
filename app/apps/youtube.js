define([
	'utils/listingapp',
	'model/youtubelist',
	'tpl/youtube-partial',
	'dom/dom',
	'shims/bind'
], function(App, YTData, ytpartial, dom, bind){
	var YouTube = new App({
		name: 'youtube',
		datamodel: YTData,
		listType: 'youtube'
	});
	YouTube.on('selection-changed', function() {
		console.log('Custom screen Tube', this.presentation.getStep());
		if (this.model.currentIndex > this.model.data.list.length - (this.presentation.getStep() * 2) ) {
			if (this.model.hasMoreResult) {
				this.model.loadData({
					name: this.name,
					type: 'append'
				});
			}
		}
	});
	YouTube.presentation.addNewResults = function(items) {
		var domString = ytpartial.render({
			alterClass: this.template.alterClass,
			things: this.app.model.get(),
			startIndex: this.app.model.lastDisplayedIndex - this.app.model.itemsPerLoad
		});
		var putin = dom.$('.list-container', this.container);
		putin.insertAdjacentHTML('beforeend', domString);
	};
	YouTube.on('data-load-end', function(data) {
		if (data.type === 'append') {
			this.presentation.addNewResults();
		}
	});
	YouTube.appEvents.play = {
		name: 'play',
		func: bind(function() {
			console.log('My custom play handle');
			console.log(this);
		}, YouTube),
		attached: false
	};
	
	return YouTube;
});
