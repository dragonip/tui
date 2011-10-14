define(function() {
	return {
		window: (function() {
			return {
				w : window.innerWidth,
				h : window.innerHeight
			}
		})(),
		epgpanel: (function() {
			return {
				w: parseInt((window.innerWidth * 70) / 100),
				h: parseInt((window.innerHeight * 80) / 100),
				listHeight: parseInt(window.innerHeight) - 130
			};
		})(),
		pixelate: function(value) {
			return value + 'px';
		}
		
	};
});
