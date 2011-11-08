define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div><div');
buf.push(attrs({ "class": ('rotator-circle') + ' ' + ('init') }));
buf.push('></div>');
 for (var i = 0; i < apps.length ; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-appname':("" + (apps[i].apptag) + ""), "class": ('approtator-item') }));
buf.push('><h3>' + escape((interp = apps[i].name) == null ? '' : interp) + '</h3><img');
buf.push(attrs({ 'src':('' + (apps[i].icon) + ''), 'alt':('' + (apps[i].name) + ' icon') }));
buf.push('/></div>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });