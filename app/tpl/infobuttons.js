define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
 if (things.ok)
{
buf.push('<div');
buf.push(attrs({ "class": ('remoteOK') }));
buf.push('>');
var __val__ = things.ok
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things.arrows)
{
buf.push('<div');
buf.push(attrs({ "class": ('remoteArrows') }));
buf.push('>');
var __val__ = things.arrows
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things.home)
{
buf.push('<div');
buf.push(attrs({ "class": ('remoteHome') }));
buf.push('>');
var __val__ = things.home
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things.info)
{
buf.push('<div');
buf.push(attrs({ "class": ('remoteInfo') }));
buf.push('>');
var __val__ = things.info
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
 if (things.display)
{
buf.push('<div');
buf.push(attrs({ "class": ('remoteDisplay') }));
buf.push('>');
var __val__ = things.display
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
}
return buf.join("");
}return { render: anonymous }; });