define([
	'oop/inherit',
	'ui/vkbd'
], function(inherit, KBD){
	var Dialler = function(options) {
//		this.dom_ = options.dom_;
		this.container = null;
	};

	
	Dialler.prototype.activeItemClass = 'focus'
	Dialler.prototype.activeItemSelector = '.';
	Dialler.prototype.activeItemSelectorHelper = '.phone-btn';
	Dialler.prototype.rowSelector = 'div.row';
	Dialler.prototype.eventHandler = function(key) {
		KBD.prototype.eventHandler.call(this, key);
	};
	Dialler.prototype.getActiveKey =  function() {
		return KBD.prototype.getActiveKey.call(this);
	};
	Dialler.prototype.setActiveKey = function(key, oldkey) {
		KBD.prototype.setActiveKey.call(this, key, oldkey);
	};
	
	Dialler.prototype.disposeInternal = function() {
		Dialler.superClass_.disposeInternal.call(this);
		delete this.dom_;
	};
	return Dialler;
});
