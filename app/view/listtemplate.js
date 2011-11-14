define(['tpl/list','text!css/list.css','loader/loader','view/mosaictemplate','oop/inherit'
], function(template, css, loader, MosaicTemplate, inherit) {
	loader.loadCSSFromText(css);
	
	var View = function(iWidth, iHeight) {
		MosaicTemplate.call(this, undefined, 64 );
	};
	inherit(View, MosaicTemplate);
	View.prototype.getStep = function() {
		return 1;
	};
	View.prototype.rasterize = function(templateFills, name) {
		return template.render({
			things: templateFills,
			id: name,
			w: this.getULWidth() + 'px'
		});
	};
	return View;
});
