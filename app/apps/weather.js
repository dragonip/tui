define([
	'oop/inherit',
	'utils/visualapp',
	'shims/bind',
	'env/exports',
	'loader/loader',
	'tpl/weather',
	'text!css/weather.css',
	'transport/request',
//	'transport/response'
	'transport/grouprequest'
], function(inherit, VisualApp, bind, exports, loader, template, css, request, GroupRequest){
	loader.loadCSSFromText(css);
	var units_ = '1';
	var city_ = '104164';
	var Weather = function(options) {
		VisualApp.call(this, options);
		this.forecast = null;
		this.location = null;
		this.on('start-requested', this.onStartRequested);
		this.on('show-requested', this.onShowRequested);
		this.on('stop-requested', this.onStopRequested);
	};
	inherit(Weather, VisualApp);
	Weather.prototype.onStopRequested = function() {
//		TODO: Check to make sure everything is cleaned up
	};
	Weather.prototype.onStartRequested = function() {
		//fetch data if we do not have it yet
		if (this.forecast === null || this.location === null) {
			this.loadData();
		} else {
			this.fire('start-ready');
		}
	};
	Weather.prototype.cityLoaded_ = false;
	Weather.prototype.unitsLoaded_ = false;
	Weather.prototype.loadJSON = function(results) {
		if (results[0].status.toLowerCase()==='ok') {
			this.city = results[0].content;
		} else {
			this.city = city_;
		}
		if (results[1].status.toLowerCase() === 'ok' ) {
			this.units = results[1].content;
		} else {
			this.units = units_;
		}
		this.loadData([this.units, this.city]);
	};
	Weather.prototype.onShowRequested = function() {
		this.dom_ = template.render({
			things: this.forecast['forecastList'],
			unit: this.forecast['temperatureUnits'],
			location: this.location.location
		});
		this.container.innerHTML = this.dom_;
	};
	Weather.prototype.loadData = function(data) {
		if (data) {
			loader.loadJSONP('weatherlocation', 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?api_key=u2bwf83unq43dt66ugm6t2fa&nf&f=exportedSymbols.weather.locationInfo&city=' + this.city);
			loader.loadJSONP('weatherinfo', 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?api_key=u2bwf83unq43dt66ugm6t2fa&nf=4&f=exportedSymbols.weather.load&city=' + this.city + '&units='+ this.units);
			return;
		}
		var req = request.create('calld', tui.options.paths.getPath(this.name, 'units'));
		var req2 = request.create('calld', tui.options.paths.getPath(this.name, 'city'));
		var a = new GroupRequest(bind(this.loadJSON, this), req2, req);
	};
	Weather.prototype.setLocationInfo = function(json) {
		this.location = json;
		if (this.forecast !== null) {
			this.fire('start-ready');
		}
	};
	Weather.prototype.noDataLoaded = function() {
//		TODO: implement method where no data is returnedb by server
	};
	Weather.prototype.load = function(jsonobj) {
		if (jsonobj === null) {
			this.noDataLoaded();
			return;
		}
		this.forecast = jsonobj;
		var pred;
		for (var i = 0; i < this.forecast['forecastList'].length; i++) {
			pred = this.forecast['forecastList'][i].dayPred;
			if (/feels-like temperature of (.*)$/.exec(pred) != null) {
	        	this.forecast['forecastList'][i].feelslike = /feels-like temperature of (.*)$/.exec(pred)[1];
	        }
	        if (/[wW]inds ([^\.]*)/.exec(pred) != null){
				this.forecast['forecastList'][i].wind = /[wW]inds ([^\.]*)/.exec(pred)[1];
			}
			if (/ ([0-9]*%) /.exec(pred) != null) {
	    		this.forecast['forecastList'][i].humidity = / ([0-9]*%) /.exec(pred)[1];
			}
		}
		if (this.location !== null)
			this.fire('start-ready');
	};
	Weather.prototype.disposeInternal = function() {
		Weather.superClass_.disposeInternal.call(this);
		delete this.dom_;
		delete this.forecast;
		delete this.location;
		delete this.city;
		delete this.units;
		delete this.cityLoaded_;
		delete this.unitsLoaded_;
	};
	var a = new Weather({
		name: 'weather'
	});
	exports.exportSymbol('weather', {
		name: 'load',
		symbol: bind(a.load, a)
	});
	exports.exportSymbol('weather', {
		name: 'locationInfo',
		symbol: bind(a.setLocationInfo, a)
	});
	return a;
});
