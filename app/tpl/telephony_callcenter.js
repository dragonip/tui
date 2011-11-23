define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('phone-keyboard') }));
buf.push('><div');
buf.push(attrs({ "class": ('phoneDisplay') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "1"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "2"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "3"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('up') + ' ' + ('back') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phone.svg"), "class": ('phone-image') }));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "4"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "5"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "6"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('down') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phone.svg"), "class": ('phone-image') }));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "7"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "8"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "9"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('calls') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/calls.svg"), "class": ('phone-image') }));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "*"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "0"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('digit') }));
buf.push('>');
var __val__ = "#"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phone-btn') + ' ' + ('phoneBook') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phone-book.svg"), "class": ('phone-image') }));
buf.push('/></div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });