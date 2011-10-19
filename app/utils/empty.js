define(['debug/console'],function(logger) {
	var pcli = logger.getInstance('$empty');
	var defaultTainer = function(key) {
		pcli.log('Tained key ' + key);
	};
	return {
		getTainted: function(events_to_tain) {
			var eventlist = {};
			events_to_tain.forEach(function(item) {
				eventlist[item] = {
					name: item,
					func: defaultTainer,
					attached: false
				};
			});
			return eventlist;
		}
	};
});

