define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('weatherWrapper') }));
buf.push('><div');
buf.push(attrs({ "class": ('weatherScreen') }));
buf.push('><div');
buf.push(attrs({ "class": ('weatherCity') }));
buf.push('>');
var __val__ = "City: " + location.city + ', ' + location.country
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('weatherDay') }));
buf.push('><div');
buf.push(attrs({ "class": ('weatherDayTitle') }));
buf.push('>');
var __val__ = things[i].dayTitle
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><img');
buf.push(attrs({ 'src':("http://img.weather.weatherbug.com/forecast/icons/localized/80x67/en/trans/" + things[i].dayIcon + ".png") }));
buf.push('/></div><div');
buf.push(attrs({ "class": ('weatherName') }));
buf.push('>');
var __val__ = things[i].dayDesc
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 if (things[i].humidity)
{
buf.push('<div');
buf.push(attrs({ "class": ('humidity') }));
buf.push('>');
var __val__ = "Humidity: " + things[i].humidity
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('<div');
buf.push(attrs({ "class": ('minTemp') }));
buf.push('>');
var __val__ = "Temp. Low: " + things[i].low + ' ' + unit
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('maxTemp') }));
buf.push('>');
var __val__ = "Temp. High: " + things[i].high + ' ' + unit
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
if (things[i].feelslike)
{
buf.push('<div');
buf.push(attrs({ "class": ('feelsLike') }));
buf.push('>');
var __val__ = "Feels like: " + things[i].feelslike
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
if (things[i].wind)
{
buf.push('<div');
buf.push(attrs({ "class": ('wind') }));
buf.push('>');
var __val__ = "Winds: " + things[i].wind
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('</div>');
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });