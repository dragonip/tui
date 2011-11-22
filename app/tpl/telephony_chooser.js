define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('telephonyChooser') }));
buf.push('><div');
buf.push(attrs({ 'data-sequence':(1), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('callCenterC') }));
buf.push('></div><span>');
var __val__ = body.callcenter
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div><div');
buf.push(attrs({ 'data-sequence':(2), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('callHistoryC') }));
buf.push('></div><span>');
var __val__ = body.history
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div><div');
buf.push(attrs({ 'data-sequence':(3), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('voiceMailC') }));
buf.push('></div><span>');
var __val__ = body.voicemail
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div><div');
buf.push(attrs({ 'data-sequence':(4), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('sendSMSC') }));
buf.push('></div><span>');
var __val__ = body.sms
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div><div');
buf.push(attrs({ 'data-sequence':(5), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('phonebookC') }));
buf.push('></div><span>');
var __val__ = body.phonebook
buf.push(null == __val__ ? "" : __val__);
buf.push('</span></div></div>');
}
return buf.join("");
}return { render: anonymous }; });