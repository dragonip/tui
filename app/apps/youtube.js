define([
	'utils/listingapp',
	'model/youtubelist',
	'tpl/youtube-partial',
	'dom/dom',
	'shims/bind',
	'data/static-strings'
], function(App, YTData, ytpartial, dom, bind, strings){
//	TODO: add rating to videos
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
	YouTube.selectionDialogOptions = {
		options:[
			strings.components.dialogs.ytube.mostPopular,
			strings.components.dialogs.ytube.topRated,
			strings.components.dialogs.ytube.mostViewed,
			strings.components.dialogs.ytube.recent,
			strings.components.dialogs.ytube.search
		],
		actions: ['most_popular_url','toprated','most_viewed','recently_featured','search_url']
	};
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
			tui.createDialog('optionlist', this.selectionDialogOptions.options, bind(this.handleDialogSelection, this), strings.components.dialogs.ytube.select);
		}, YouTube),
		attached: false
	};
	YouTube.handleDialogSelection = function(sIndex) {
		console.log( 'selection is ', this.selectionDialogOptions.actions[sIndex]);
		this.model.resetSource(this.selectionDialogOptions.actions[sIndex]);
	};
	
	return YouTube;
});
