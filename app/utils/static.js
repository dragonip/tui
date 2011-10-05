/**
 * Contains static strings
 * @module strings Contains static and / or trasnl;ateble strings
 * */
define({
	errors: {
		cannotCreateElement: 'Cannot create element from tagname'
	},
	concat: function() {
		return Array.prototype.slice.call(arguments,0).join(' ');
	}
});
