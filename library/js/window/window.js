define([
	'utils/autoid', 
	'types/types'
], function(autoid, types) {
	var win_list = {};
	var url_list = {};
	var id = autoid.getInstance('popups');
	return {
		create: function(url) {
			if ( types.assert(url_list[url], 'undefined')) {
				url_list[url] = id.get();
				win_list[url_list[url]] = window.open(url, url_list[url], "resizable=yes,scrollbars=yes");
				return win_list[url_list[url]];
			} else {
				return win_list[url_list[url]]
			}
		}
	};
});
