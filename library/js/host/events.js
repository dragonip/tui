define(['jquery'], function(jq) {
	return {
		add: function( el, ev, handler) {
			jq(el).bind(ev, handler);
		}
	}
});
