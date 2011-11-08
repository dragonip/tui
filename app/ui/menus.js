define(function () {
	function CustomOptionsMenu(options) {
		this.dom = null;
		this.current = 0;
		this.data = null;
		this.visible = false;
	}
	CustomOptionsMenu.prototype.render = function(where) {
		if (!this.template) {
			this.template = defaultMenuTemplate;
		}
		this.dom = this.template.render(this.data);
		dom.adopt(where, this.dom);
		this.visible = true;
	};
	CustomOptionsMenu.prototype.changeSelection = function(index) {
		
	};
}); 
