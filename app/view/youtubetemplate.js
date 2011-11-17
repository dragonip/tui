define([
	'tpl/youtube',
	'view/mosaictemplate',
	'oop/inherit',
	'data/static-strings'
], function(template, MosaicTemplate, inherit, strings) {
	var View = function(iWidth, iHeight) {
		MosaicTemplate.call(this);
	};
	inherit(View, MosaicTemplate);
	View.prototype.rasterize = function(templateFills, name) {
		return template.render({
			alterClass: this.alterClass,
			things: templateFills,
			id: name,
			w: this.getULWidth() + 'px',
			nocontentstring: strings.lists.noContent
		});
	};
	return View;
});
