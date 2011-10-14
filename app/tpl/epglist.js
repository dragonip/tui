define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('epgItem') }));
buf.push('><div');
buf.push(attrs({ "class": ('epgItemTime') }));
buf.push('>');
var __val__ = things[i].time
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('epgItemTitle') }));
buf.push('>');
var __val__ = things[i].title
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
}
return buf.join("");
}return { render: anonymous }; });