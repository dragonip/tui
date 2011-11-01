define({
	getCurrentTime: function() {
		return (new Date()).getTime();
	},
	parseTime: function(epoch) {
		return new Date(parseInt(epoch));
	},
	fillMinutes: function(str) {
		str = ''+str;
		if ( str.length < 2 ) {
			str = str +'0';
		}
		return str;
	}
});
