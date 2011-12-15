define([
	'oop/inherit',
	'utils/telescreen',
	'dom/dom',
	'data/static-strings'
], function(inherit, TScreen, dom, strings) {
	var NS = function(options) {
		TScreen.call(this, options);
	};
	inherit(NS, TScreen);
	NS.prototype.render = function(renderIn) {
		var data = this.master.getData(this.name);
		console.log('im miniscreen json data is ', data);
		var mydom = dom.getInnerNodes(this.template_.render({
			items: this.master.getData(this.name),
			transl: strings.screens.setup.header,
			appname: this.name
		}));
		if (this.dom_ && this.dom_.parentNode) {
			this.dom_.parentNode.replaceChild(mydom, this.dom_);
		} else {
			dom.adopt(renderIn, mydom);
		}
		this.dom_= mydom;
	};
	return NS;
});
