define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-multiscreen') + ' ' + ('phonebookWrapper') }));
buf.push('><div');
buf.push(attrs({ "class": ('inputCont') }));
buf.push('><span');
buf.push(attrs({ "class": ('searchText') }));
buf.push('>Press Left To activate the field</span><input');
buf.push(attrs({ "class": ('searchInput') }));
buf.push('/></div><div');
buf.push(attrs({ "class": ('kbdButton') }));
buf.push('><img');
buf.push(attrs({ 'src':("app/imgs/kbdButton.png") }));
buf.push('/></div><div');
buf.push(attrs({ "class": ('phonebookItem') + ' ' + ('nobg') }));
buf.push('><div');
buf.push(attrs({ "class": ('name') }));
buf.push('>Name</div><div');
buf.push(attrs({ "class": ('general') }));
buf.push('>General</div><div');
buf.push(attrs({ "class": ('ip') }));
buf.push('>IP</div></div><div');
buf.push(attrs({ "class": ('phoneBookResults') }));
buf.push('>');
if (typeof things === 'object')
{
 for (var i = 0; i < things.length; i++ )
{
buf.push('<div');
buf.push(attrs({ "class": ('phonebookItem') }));
buf.push('><div');
buf.push(attrs({ "class": ('name') }));
buf.push('>');
var __val__ = things[i].callername
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('general') }));
buf.push('>');
var __val__ = things[i].general
buf.push(null == __val__ ? "" : __val__);
buf.push('</div><div');
buf.push(attrs({ "class": ('ip') }));
buf.push('>');
var __val__ = things[i].ip
buf.push(null == __val__ ? "" : __val__);
buf.push('</div></div>');
}
}
 else 
{
buf.push('<div');
buf.push(attrs({ "class": ('system-info') + ' ' + ('no-phonebook-entries') }));
buf.push('></div>');
}
buf.push('</div></div>');
}
return buf.join("");
}return { render: anonymous }; });