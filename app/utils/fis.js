define([
	'tpl/fis',
	'text!css/fis.css',
	'loader/loader',
	'dom/dom'
], function(tpl, css, loader, dom) {
	loader.loadCSSFromText(css);
	var FastIndexSelector = function() {
		this.template = dom.getInnerNodes(tpl.render({}));
		this.digitsContainer = dom.$('.input', this.template);
	};
	FastIndexSelector.prototype.enterDom = function() {
		dom.adopt(this.template);
	};
	FastIndexSelector.prototype.exitDom = function() {
		dom.dispose(this.template);
	};
	FastIndexSelector.prototype.setContent = function(content) {
		if (!this.isAttached_)
			this.enterDom();
		this.digitsContainer.innerHTML = content;
	};
	
	return {
		create: function() {
			return new FastIndexSelector();
		}
	};
	
});


