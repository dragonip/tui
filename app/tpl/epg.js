define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':("width:"+ w + "px"), "class": ('epg') }));
buf.push('><div');
buf.push(attrs({ "class": ('header') }));
buf.push('><div');
buf.push(attrs({ "class": ('screenImg') }));
buf.push('><img');
buf.push(attrs({ 'src':(channelThumb) }));
buf.push('/></div><h1');
buf.push(attrs({ "class": ('channelTitle') }));
buf.push('>');
var __val__ = channelTitle
buf.push(null == __val__ ? "" : __val__);
buf.push('</h1></div><div');
buf.push(attrs({ 'style':("height:" + epgProgramHeight + "px"), "class": ('epgProgram') }));
buf.push('>');
 if (things.length < 1)
{
buf.push('<div');
buf.push(attrs({ "class": ('no-epg-available') }));
buf.push('>Sorry, no EPG information is abailable for this channel</div>');
}
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-sequence':(i), "class": ('epgItem') }));
buf.push('><div');
buf.push(attrs({ "class": ('epgItemTime') }));
buf.push('>');
var __val__ = things[i][4].parsedTime
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('epgItemTitle') }));
buf.push('>');
var __val__ = things[i][3]
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });