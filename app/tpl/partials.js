define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':("width:"+ width), 'data-appid':(name), "class": ('tui-mosaic') + ' ' + ('list-container') }));
buf.push('>');
 if (data.length > startIndex)
{
 for (var i = startIndex; i < endIndex; i++ )
{
 if ( data.length > i )
{
buf.push('<div');
buf.push(attrs({ 'data-sequence':(i), "class": ('item '+ (alterClass ? 'larger':'regular')) }));
buf.push('>');
 if (data[i].thumbnail.length < 5 )
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
buf.push(attrs({ 'src':(data[i].thumbnail) }));
buf.push('/></div>');
}
buf.push('<span');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = data[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</span><ul');
buf.push(attrs({ "class": ('channel-settings-icons') }));
buf.push('>');
 if (data[i].isLocked)
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('locked') }));
buf.push('></li>');
}
 if (data[i].isBookmarked)
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('bookmarked') }));
buf.push('></li>');
}
 if (data[i].personalRecordingOptions && data[i].personalRecordingOptions.canRecord) 
{
buf.push('<li');
buf.push(attrs({ "class": ('icon') + ' ' + ('recordable') }));
buf.push('></li>');
}
buf.push('</ul>');
 if (!/[^0-9]/.test(data[i].id))
{
buf.push('<div');
buf.push(attrs({ "class": ('object-index') }));
buf.push('>');
var __val__ = data[i].id
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (data[i].isDir !== false)
{
buf.push('<div');
buf.push(attrs({ "class": ('folder-icon') }));
buf.push('></div>');
}
buf.push('</div>');
}
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