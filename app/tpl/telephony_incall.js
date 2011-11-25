define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('call-container') }));
buf.push('><div');
buf.push(attrs({ "class": ('scroll-call') }));
buf.push('><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/avatar.svg") }));
buf.push('/><div>');
var __val__ = "Call is in session.."
buf.push(null == __val__ ? "" : __val__);
buf.push('<div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('>');
var __val__ = "John Smith"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('>');
var __val__ = "1-222-222-222"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/pause.svg") }));
buf.push('/><div>');
var __val__ = "Call is on hold.."
buf.push(null == __val__ ? "" : __val__);
buf.push('<div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('>');
var __val__ = "John Smith"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('>');
var __val__ = "1-222-222-222"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phone-ring.svg") }));
buf.push('/><div>');
var __val__ = "Incoming Call.."
buf.push(null == __val__ ? "" : __val__);
buf.push('<div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('>');
var __val__ = "John Smith"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('>');
var __val__ = "1-222-222-222"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/dialing.svg") }));
buf.push('/><div>');
var __val__ = "Call is in dialing.."
buf.push(null == __val__ ? "" : __val__);
buf.push('<div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('>');
var __val__ = "John Smith"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('>');
var __val__ = "1-222-222-222"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/conferance.svg") }));
buf.push('/><div>');
var __val__ = "Call is in conferance.."
buf.push(null == __val__ ? "" : __val__);
buf.push('<div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('>');
var __val__ = "John Smith"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('>');
var __val__ = "1-222-222-222"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div></div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });