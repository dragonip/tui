define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('chanel-input-main') }));
buf.push('><div');
buf.push(attrs({ "class": ('chanel-input') }));
buf.push('><div');
buf.push(attrs({ "class": ('input') }));
buf.push('></div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });