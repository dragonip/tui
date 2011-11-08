define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('callCenter') }));
buf.push('><input');
buf.push(attrs({ 'type':("tel"), 'pattern':("[0-9]"), 'name':("phoneNumber"), "class": ('phoneDisplay') }));
buf.push('/><div');
buf.push(attrs({ "class": ('phoneKeyboard') }));
buf.push('><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "1"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "2"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "3"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/greenPhone.png"), "class": ('phoneImg') }));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "4"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "5"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "6"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/redPhone.png"), "class": ('phoneImg') }));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "7"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "8"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "9"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') + ' ' + ('addToPhone') }));
buf.push('>');
var __val__ = "Call<br>History"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "*"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "0"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('>');
var __val__ = "#"
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('phoneBtn') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/phoneBook.png"), "class": ('phoneDictionary') }));
buf.push('/></div></div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });