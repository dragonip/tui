define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('inCallMessage') }));
buf.push('><div');
buf.push(attrs({ "class": ('callMessage') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/in_call_icon.png") }));
buf.push('/><div>');
var __val__ = "Call is in session.."
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });