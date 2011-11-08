define(["support/runtime"],function(jade){function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tui-keyboard') }));
buf.push('>');
 for (var i = 0; i < kbdlayout.length; i++ ) 
{
buf.push('<ul');
buf.push(attrs({ "class": ('ul'+ i + ' kbdrow') }));
buf.push('>');
 for (var j = 0; j < kbdlayout[i].length; j++) 
{
buf.push('<li');
buf.push(attrs({ "class": ((kbdlayout[i][j].length>4)?'widekey':(kbdlayout[i][j].length>1)?'smallwidekey':(kbdlayout[i][j] === ' ')?'spacek':'') }));
buf.push('>');
var __val__ = kbdlayout[i][j]
buf.push(null == __val__ ? "" : __val__);
buf.push('</li>');
}
buf.push('</ul><br');
buf.push(attrs({  }));
buf.push('/>');
}
buf.push('</div>');
}
return buf.join("");
}return { render: anonymous }; });