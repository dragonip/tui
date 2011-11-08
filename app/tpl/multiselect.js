define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div><div');
buf.push(attrs({ "class": ('multi-select-shadow') }));
buf.push('><div');
buf.push(attrs({ "class": ('multi-select-container') }));
buf.push('><div');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = title
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 for( var i = 0; i < things.length; i++) 
{
buf.push('<div');
buf.push(attrs({ "class": ('multi-select-item') }));
buf.push('>');
var __val__ = things[i]
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('</div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });