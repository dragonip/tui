define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('telephonyChooser') }));
buf.push('><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('callCenterC') }));
buf.push('></div><span>Call Center</span></div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('callHistoryC') }));
buf.push('></div><span>Call History</span></div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('voiceMailC') }));
buf.push('></div><span>Voice Mail</span></div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('sendSMSC') }));
buf.push('></div><span>SMS Center</span></div><div');
buf.push(attrs({ "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('phonebookC') }));
buf.push('></div><span>Phonebook</span></div></div>');
}
return buf.join("");
}return { render: anonymous }; });