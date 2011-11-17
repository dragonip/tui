define([
	'utils/listingapp',
	'model/youtubelist'
], function(App, YTData){
	return new App({
		name: 'youtube',
		datamodel: YTData,
		listType: 'youtube'
	});
});
