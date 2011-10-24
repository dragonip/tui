define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('screenChooserWrapper') + ' ' + ('screenChooser') }));
buf.push('><div');
buf.push(attrs({ "class": ('tui-component') + ' ' + ('screen-selector-pointer') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('filler') }));
buf.push('></div>');
 for (var i = 0; i < apps.length ; i++ )
{
buf.push('<div');
buf.push(attrs({ 'data-appname':("" + (apps[i].apptag) + ""), 'data-sequence':(i), "class": ("screen approtator-item " + apps[i].apptag) }));
buf.push('></div>');
}
buf.push('<div');
buf.push(attrs({ "class": ('filler') }));
buf.push('></div></div>');
}
return buf.join("");
}return { render: anonymous }; });