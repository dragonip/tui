define({
	//Pin the values as we do not want to resize anytime!
	pixelate: function(value) {
		return value + 'px';
	},
	depixelate: function(value) {
		return parseInt(value, 10);
	},
	getSizesForWindow: function() {
		return {
			width: this.depixelate(window.innerWidth),
			height: this.depixelate(window.innerHeight)
		};
	},
	getSizesForEPG: function() {
		return {
			width: this.depixelate((this.getSizesForWindow().width * 70) / 100),
			height: this.depixelate((this.getSizesForWindow().height * 80) / 100),
			listHeight: this.getSizesForWindow().height - 130
		};
	},
	getSizesForAppselector: function(itemSize) {
		return {
			padding: this.depixelate((this.getSizesForWindow().height / 2) - (itemSize / 2))
		};
	}
});

