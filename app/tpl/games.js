define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':("width:"+ w), 'data-appid':(id), "class": ('tui-mosaic') + ' ' + ('list-container') }));
buf.push('>');
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-sequence':(i), "class": ('item') + ' ' + ('larger') }));
buf.push('><div');
buf.push(attrs({ "class": ('imgcont') }));
buf.push('><img');
buf.push(attrs({ 'src':(things[i].icon) }));
buf.push('/></div><span');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = things[i].name
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });