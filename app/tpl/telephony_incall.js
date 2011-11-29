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
buf.push(attrs({  }));
buf.push('/><div');
buf.push(attrs({ "class": ('status-text') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('></div></div></div><div');
buf.push(attrs({ "class": ('call-status') }));
buf.push('><img');
buf.push(attrs({  }));
buf.push('/><div');
buf.push(attrs({ "class": ('status-text') }));
buf.push('><div');
buf.push(attrs({ "class": ('caller-name') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('caller-info') }));
buf.push('></div></div></div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });