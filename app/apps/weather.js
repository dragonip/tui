define([
	'oop/inherit',
	'utils/visualapp',
	'net/simplexhr',
	'shims/bind',
	'env/exports',
	'loader/loader',
	'tpl/weather',
	'text!css/weather.css'
], function(inherit, VisualApp, xhr, bind, exports, loader, template, css){
	loader.loadCSSFromText(css);
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
	Weather.prototype.onShowRequested = function() {
		this.dom_ = template.render({
			things: this.forecast['forecastList'],
			unit: this.forecast['temperatureUnits'],
			location: this.location.location
		});
		this.container.innerHTML = this.dom_;
	};
	Weather.prototype.loadData = function(data) {
		var units = '1';
		var city = '104164'
		if (data) {
			if (data.length > 0) {
				if (data[0] === '0') units = 0;
				if (typeof data[1] === 'string' && data[1].length > 1 ) city = data[1];
			}
			loader.loadJSONP('weatherlocation', 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?api_key=u2bwf83unq43dt66ugm6t2fa&nf&f=exportedSymbols.weather.locationInfo&city=' + city);
			loader.loadJSONP('weatherinfo', 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?api_key=u2bwf83unq43dt66ugm6t2fa&nf=4&f=exportedSymbols.weather.load&city=' + city + '&units='+ units);
			return;
		}
		xhr.getMany([tui.options.paths.getPath(this.name, 'units'), tui.options.paths.getPath(this.name, 'city')], bind(this.loadData, this));
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
