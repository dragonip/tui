define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div><div');
buf.push(attrs({ "class": ('multi-select-shadow' + ((addKbdContainer) ? ' has-kbd' : (type === 'confirm' || type === 'ip' ) ? ' wide': (type == 'message') ? ' message' : '' )) }));
buf.push('><div');
buf.push(attrs({ "class": ('multi-select-container') }));
buf.push('><div');
buf.push(attrs({ "class": ('title') }));
buf.push('>');
var __val__ = title
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
 if (typeof type === 'string' && ['input', 'password', 'text', 'confirm', 'ip', 'message'].indexOf(type) !== -1 )
{
buf.push('<div');
buf.push(attrs({ "class": ('textarea area-type-' + type) }));
buf.push('></div>');
 if (type === 'text')
{
buf.push('<div');
buf.push(attrs({ "class": ('kbd-submitBtn') }));
buf.push('>Submit</div>');
}
 if (addKbdContainer === true) 
{
buf.push('<div');
buf.push(attrs({ "class": ('tui-kbd-container') }));
buf.push('></div>');
}
 else if (type == 'confirm')
{
buf.push('<div');
buf.push(attrs({ "class": ('tui-horizontal-container') }));
buf.push('><div');
buf.push(attrs({ 'data-trigger':("1"), "class": ('tui-popup-button') + ' ' + ('horizontal-button') }));
buf.push('>OK</div><div');
buf.push(attrs({ 'data-trigger':("0"), "class": ('tui-popup-button') + ' ' + ('horizontal-button') + ' ' + ('active') }));
buf.push('>Cancel</div></div>');
}
 else if (type == 'message')
{
buf.push('<div');
buf.push(attrs({ "class": ('tui-horizontal-container') }));
buf.push('><div');
buf.push(attrs({ "class": ('tui') + ' ' + ('popup-button') + ' ' + ('horizontal-button') + ' ' + ('single-button') + ' ' + ('active') }));
buf.push('>OK</div></div>');
}
 else if (type == 'ip')
{
buf.push('<div');
buf.push(attrs({ "class": ('tui-horizontal-container') }));
buf.push('><div');
buf.push(attrs({ "class": ('input-box') + ' ' + ('active') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('input-box') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('input-box') }));
buf.push('></div><div');
buf.push(attrs({ "class": ('input-box') }));
buf.push('></div></div>');
}
}
 else if ( typeof things === 'object')
{
 for( var i = 0; i < things.length; i++) 
{
buf.push('<div');
buf.push(attrs({ "class": ('multi-select-item') }));
buf.push('>');
var __val__ = things[i]
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
}
}
buf.push('</div></div></div>');
}
return buf.join("");
}return { render: anonymous }; });