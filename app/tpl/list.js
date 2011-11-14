define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':("width:"+ w), 'data-appid':(id), "class": ('tui-list') + ' ' + ('list-container') }));
buf.push('>');
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-sequence':(i), "class": ('item') }));
buf.push('><div');
buf.push(attrs({ "class": (((things[i].thumbnail !== null)? "leftCont" : "leftContLong")) }));
buf.push('><h1');
buf.push(attrs({ "class": ('number_id') }));
buf.push('>');
var __val__ = things[i].sortIndex
buf.push(null == __val__ ? "" : __val__);
buf.push('</h1><h2');
buf.push(attrs({ "class": ('item_name') }));
buf.push('>');
var __val__ = things[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</h2>');
 if (things[i].genre)
{
buf.push('<div');
buf.push(attrs({ "class": ('description') }));
buf.push('>');
var __val__ = "Genre:" + things[i].genre
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things[i].time)
{
buf.push('<div');
buf.push(attrs({ "class": ('description') }));
buf.push('>');
var __val__ = "Time:" + things[i].time
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things[i].cost)
{
buf.push('<div');
buf.push(attrs({ "class": ('description') }));
buf.push('>');
var __val__ = "Cost:" + things[i].cost
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('</div>');
 if (things[i].thumbnail !== null)
{
buf.push('<div');
buf.push(attrs({ "class": ('rightCont') }));
buf.push('><img');
buf.push(attrs({ 'src':(things[i].thumbnail), "class": ('img_thumb') }));
buf.push('/></div>');
}
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
buf.push('</ul></div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });