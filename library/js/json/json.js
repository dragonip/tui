define({
	parse: function(JSONString) {
		var result;
		try {
			result = JSON.parse(JSONString);
		} catch (e) {
			
		}
		return result;
	}, 
	serialize: function(JSONObject) {
		var result = '';
		try {
			result = JSON.stringify(JSONObject);
		} catch (e) {}
		return result;
	}
});
