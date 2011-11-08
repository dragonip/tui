define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('weatherScreen') }));
buf.push('><div');
buf.push(attrs({ "class": ('weatherCity') }));
buf.push('>');
var __val__ = things.cityname
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('weatherDay') }));
buf.push('><div');
buf.push(attrs({ "class": ('weatherDayTitle') }));
buf.push('>');
var __val__ = things[i].dayOfWeek
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><img');
buf.push(attrs({ 'src':(things[i].weatherIcon) }));
buf.push('/></div>');
 if (things[i].humidity)
{
buf.push('<div');
buf.push(attrs({ "class": ('humidity') }));
buf.push('>');
var __val__ = "Humidity: " + things[i].humidity
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 else
{
buf.push('<div');
buf.push(attrs({ "class": ('weatherName') }));
buf.push('>');
var __val__ = things[i].weathername
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('<div');
buf.push(attrs({ "class": ('minTemp') }));
buf.push('>');
var __val__ = "Temp. Low: " + things[i].lowTemp
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('maxTemp') }));
buf.push('>');
var __val__ = "Temp. High: " + things[i].highTemp
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('wind') }));
buf.push('>');
var __val__ = "Winds: " + things[i].windSpeed
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('feelsLike') }));
buf.push('>');
var __val__ = "Feels like: " + things[i].feelsLike
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });