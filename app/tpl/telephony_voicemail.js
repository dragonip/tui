define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('voiceMail') }));
buf.push('><div');
buf.push(attrs({ "class": ('voiceMailItem') + ' ' + ('nobg') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller') }));
buf.push('>Caller</div><div');
buf.push(attrs({ "class": ('time') }));
buf.push('>Time</div></div><div');
buf.push(attrs({ "class": ('voiceMailResults') }));
buf.push('>');
 if (typeof things === 'object')
{
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('voiceMailItem') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller') }));
buf.push('>');
var __val__ = things[i].callername
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('time') }));
buf.push('>');
var __val__ = things[i].time
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
}
 else 
{
buf.push('<div');
buf.push(attrs({ "class": ('system-info') + ' ' + ('no-voicemail-messages') }));
buf.push('></div>');
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });