define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('sendSMS') }));
buf.push('><div');
buf.push(attrs({ "class": ('sendSmsHolder') }));
buf.push('><div');
buf.push(attrs({ "class": ('smsReceiver') }));
buf.push('>To:</div><div');
buf.push(attrs({ "class": ('receiver') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('phoneBook') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phoneBook.png"), "class": ('phoneDictionary') }));
buf.push('/></div><div');
buf.push(attrs({ "class": ('messageName') }));
buf.push('>Message:</div><div');
buf.push(attrs({ 'onclick':("this.contentEditable='true'"), "class": ('message') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('sendBtn') }));
buf.push('>Send</div><div');
buf.push(attrs({ "class": ('clearBtn') }));
buf.push('>Clear</div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });