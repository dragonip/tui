define([
	'oop/inherit',
	'oop/idisposable',
	'utils/listingapp'
], function(inherit, Disposable, ListApp){
	var App = function(opts){
		ListApp.call(this, opts);
	};
	inherit(App, ListApp);
	App.prototype.onSelectionChanged = function(obj) {
		this.constructor.superClass_.onSelectionChanged.call(this, obj);
	};
	return App;
	
});
