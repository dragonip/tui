define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('general-wrapper') }));
buf.push('><div');
buf.push(attrs({ "class": ("image-selector " + appname) }));
buf.push('></div><div');
buf.push(attrs({ "class": ('general-item') + ' ' + ('head') }));
buf.push('><div');
buf.push(attrs({ "class": ('settings') }));
buf.push('>');
var __val__ = transl.settings
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('value') }));
buf.push('>');
var __val__ = transl.value
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div><div');
buf.push(attrs({ "class": ('general-content') }));
buf.push('>');
 for ( var i = 0; i < items.length; i++)
{
 if (items[i].type === 'list')
{
buf.push('<div');
buf.push(attrs({ "class": ('general-item') }));
buf.push('><div');
buf.push(attrs({ "class": ('settings') }));
buf.push('>');
var __val__ = items[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('value') }));
buf.push('>');
var __val__ = items[i].values[items[i].value]
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div><div');
buf.push(attrs({ "class": ('section') }));
buf.push('><div');
buf.push(attrs({ 'style':('float: left;text-align: center;margin-left: 13%;position: relative;top: 37px; width: 31%;') }));
buf.push('>');
var __val__ = items[i].help
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 for (var k in items[i].values)
{
buf.push('<div');
buf.push(attrs({ 'data-key':(k), "class": ('row') }));
buf.push('>');
var __val__ = items[i].values[k]
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
buf.push('</div>');
}
 else if (items[i].type === 'static')
{
buf.push('<div');
buf.push(attrs({ "class": ('general-item') + ' ' + ('inactive') }));
buf.push('><div');
buf.push(attrs({ "class": ('settings') }));
buf.push('>');
var __val__ = items[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('value') }));
buf.push('>');
var __val__ = items[i].value
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
 else if (items[i].type === 'action')
{
buf.push('<div');
buf.push(attrs({ "class": ('general-item') }));
buf.push('><div');
buf.push(attrs({ "class": ('settings') }));
buf.push('>');
var __val__ = items[i].publishName
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('value') }));
buf.push('>');
var __val__ = items[i].help
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });