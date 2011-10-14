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
buf.push(attrs({ 'data-sequence':(i), "class": ('item') + ' ' + ('regular') }));
buf.push('>');
 if (things[i].thumbnail === null)
{
buf.push('<div');
buf.push(attrs({ "class": ('imgcont') }));
buf.push('><div');
buf.push(attrs({ "class": ('default_icon') + ' ' + ('screen_default_icon_size') }));
buf.push('></div></div>');
}
 else
{
buf.push('<div');
buf.push(attrs({ "class": ('imgcont') }));
buf.push('><img');
buf.push(attrs({ 'src':(things[i].thumbnail) }));
buf.push('/></div>');
}
buf.push('<span');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = things[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</span>');
 if (things[i].settings())
{
buf.push('<ul');
buf.push(attrs({ "class": ('channel-settings-icons') }));
buf.push('>');
 if (things[i].isLocked)
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('locked') }));
buf.push('></li>');
}
 if (things[i].isBookmarked)
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('bookmarked') }));
buf.push('></li>');
}
 if (things[i].personalRecordingOptions.canRecord) 
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('recordable') }));
buf.push('></li>');
}
buf.push('</ul>');
}
buf.push('</div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });