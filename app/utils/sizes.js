/**
* @module utils/sizes Define ready getters for some sizes in the UI
*/
define({
	//Pin the values as we do not want to resize anytime!
	/**
	* @method pixelate Returns value ready to set as style
	* @param {String|Number} value. The value to add 'px' to.
	* @return {String}
	*/
	pixelate: function(value) {
		return value + 'px';
	},
	/**
	* @method depixelate Parses value for integer numbers, removing fractions and strings behind
	* @param {String} The value to parse the value from
	* @return {Number}
	*/
	depixelate: function(value) {
		return parseInt(value, 10);
	},
	/**
	* @method getSizesForWindow Returns the window sizes as object (wisth and height properties)
	* @return {Object.Number}
	*/
	getSizesForWindow: function() {
		return {
			width: this.depixelate(window.innerWidth),
			height: this.depixelate(window.innerHeight)
		};
	},
	getSizesForEPG: function() {
		return {
			width: this.depixelate((this.getSizesForWindow().width * 70) / 100),
			//height: this.depixelate((this.getSizesForWindow().height * 80) / 100),
			height: this.depixelate(this.getSizesForWindow().height),
			listHeight:  this.depixelate(this.getSizesForWindow().height) - 90 - 60
		};
	},
	getSizesForAppselector: function(itemSize) {
		return {
			padding: this.depixelate((this.getSizesForWindow().height / 2) - (itemSize / 2))
		};
	}
});

