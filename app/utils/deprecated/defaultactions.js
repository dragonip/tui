define(function () {
	var commonKeys = ['left', 'right', 'up', 'down', 'chup', 'chdown', 'ok'];
	return function (application) {
		var applicationEvents = {};
		commonKeys.forEach(function (item) {
			applicationEvents[item] = {
				name: item,
				func: function (k) {
					application.model.acceptEvent({
						type: 'remote',
						action: k
					});
				},
				attached: false
			};
		});
		return applicationEvents;
	};
});

