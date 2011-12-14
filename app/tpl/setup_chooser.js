define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('setup-container') }));
buf.push('><div');
buf.push(attrs({ 'data-sequence':("1"), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('general') }));
buf.push('></div><span');
buf.push(attrs({ "class": ('setup') }));
buf.push('>General</span></div><div');
buf.push(attrs({ 'data-sequence':("2"), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('iptv-settings') }));
buf.push('></div><span>iptv </span></div><div');
buf.push(attrs({ 'data-sequence':("3"), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('LAN') }));
buf.push('></div><span>Lan</span></div><div');
buf.push(attrs({ 'data-sequence':("4"), "class": ('icon') + ' ' + ('active') }));
buf.push('><div');
buf.push(attrs({ "class": ('WIFI') }));
buf.push('></div><span>Wifi</span></div><div');
buf.push(attrs({ 'data-sequence':("5"), "class": ('icon') }));
buf.push('><div');
buf.push(attrs({ "class": ('voip-settings') }));
buf.push('></div><span>voip</span></div></div>');
}
return buf.join("");
}return { render: anonymous }; });