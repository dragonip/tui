define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':("width:"+ w), 'data-appid':(id), "class": ('tui-mosaic') + ' ' + ('list-container') }));
buf.push('>');
 if (things.length > 0)
{
 for (var i = 0; i < things.length; i++ )
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
 else 
{
buf.push('<div');
buf.push(attrs({ "class": ('no-content') }));
buf.push('>');
var __val__ = nocontentstring
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });