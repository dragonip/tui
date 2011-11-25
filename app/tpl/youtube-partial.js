define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
 if (things.length > 0)
{
 for (var i = startIndex; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-sequence':(i), "class": ('item '+ (alterClass ? 'larger':'regular')) }));
buf.push('><div');
buf.push(attrs({ "class": ('imgcont') }));
buf.push('><div');
buf.push(attrs({ "class": ('video-bar') }));
buf.push('><div');
buf.push(attrs({ "class": ('rating_bar') }));
buf.push('><div');
buf.push(attrs({ 'style':("width:" + things[i].starRating +"%") }));
buf.push('></div></div></div><img');
buf.push(attrs({ 'src':(things[i].thumbnail.sqDefault) }));
buf.push('/></div><span');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = things[i].title
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div>');
}
}
}
return buf.join("");
}return { render: anonymous }; });