define(['support/slick', 'array/array'],function(slick, arrays) {
	function ifNotFound(result) {
		if (arrays.isEmpty) return null;
		return result;
	}
	return {
		$: function  (selector, baseElement) {
			return slick.find(baseElement, selector);
			
		},
		$$: function( selector, baseElement) {
			return ifNotFound(slick.search( baseElement, selector ));
		}
	}
});
