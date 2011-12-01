define([
	'types/types', 
	'array/array',
	'model/listmodel',
	'oop/inherit',
	'json/json',
	'transport/request',
	'transport/response',
	'shims/bind'
], function(types, array, LM, inherit, json, request, response, bind) {
	var ListModel = function(app) {
		LM.call(this, app);
	};
	inherit(ListModel, LM);
	ListModel.prototype.loadData = function(o) {
		var url = o.url || tui.options.paths.getPath(o.name, o.type);
		var req = request.create('calld', url);
		response.register(req, bind(this.load, this, o));
		req.send()
		this.app.fire('data-load-start');
	};
	ListModel.prototype.load = function(o, res) {
		var content;
		if (res.status.toLowerCase() === 'ok' && typeof res.content === 'string') {
			content = json.parse(res.content)
		}
		ListModel.superClass_.load.call(this, content, o);
	}
	return ListModel;
});
