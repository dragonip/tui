define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('callHistory') }));
buf.push('><div');
buf.push(attrs({ "class": ('callHistoryItem') + ' ' + ('nobg') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller') }));
buf.push('>');
var __val__ = header.caller
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('time') }));
buf.push('>');
var __val__ = header.time
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('duration') }));
buf.push('>');
var __val__ = header.duration
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('type') }));
buf.push('>');
var __val__ = header.type
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div><div');
buf.push(attrs({ "class": ('callHistoryResults') }));
buf.push('>');
 if (typeof things === 'object')
{
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('callHistoryItem') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller') }));
buf.push('>');
var __val__ = things[i].callernum
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('time') }));
buf.push('>');
var __val__ = things[i].starttime
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('duration') }));
buf.push('>');
var __val__ = things[i].duration
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('type') }));
buf.push('>');
 if(things[i].type === "received")
{
buf.push('<img');
buf.push(attrs({ 'src':("app/imgs/received.svg") }));
buf.push('/>');
}
 else if(things[i].type === "missed")
{
buf.push('<img');
buf.push(attrs({ 'src':("app/imgs/missed.svg") }));
buf.push('/>');
}
 else if(things[i].type === "dialed")
{
buf.push('<img');
buf.push(attrs({ 'src':("app/imgs/dialed.svg") }));
buf.push('/>');
}
buf.push('</div></div>');
}
}
 else
{
buf.push('<div');
buf.push(attrs({ "class": ('emptyScreen') }));
buf.push('></div>');
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });