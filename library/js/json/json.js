define({
	parse: function(JSONString) {
		var result;
		try {
			result = JSON.parse(JSONString);
		} catch (e) {
			console.log('CANNOT PARSE JSON STRING, try with eval');
			try {
				result = eval( '('+ JSONString +')');			
			} catch (e) {
				console.log('Eval also failed');
				result = null;
			}
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
