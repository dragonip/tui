define(function(){// CommonJS require()
function require(p){var path=require.resolve(p),mod=require.modules[path];if(!mod)throw new Error('failed to require "'+p+'"');return mod.exports||(mod.exports={},mod.call(mod.exports,mod,mod.exports,require.relative(path))),mod.exports}require.modules={},require.resolve=function(path){var orig=path,reg=path+".js",index=path+"/index.js";return require.modules[reg]&&reg||require.modules[index]&&index||orig},require.register=function(path,fn){require.modules[path]=fn},require.relative=function(parent){return function(p){if("."!=p[0])return require(p);var path=parent.split("/"),segs=p.split("/");path.pop();for(var i=0;i<segs.length;i++){var seg=segs[i];".."==seg?path.pop():"."!=seg&&path.push(seg)}return require(path.join("/"))}},require.register("compiler.js",function(module,exports,require){var nodes=require("./nodes"),filters=require("./filters"),doctypes=require("./doctypes"),selfClosing=require("./self-closing"),inlineTags=require("./inline-tags"),utils=require("./utils");Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(obj);return arr}),String.prototype.trimLeft||(String.prototype.trimLeft=function(){return this.replace(/^\s+/,"")});var Compiler=module.exports=function(node,options){this.options=options=options||{},this.node=node,this.hasCompiledDoctype=!1,this.hasCompiledTag=!1,this.pp=options.pretty||!1,this.debug=!1!==options.compileDebug,this.indents=0,options.doctype&&this.setDoctype(options.doctype)};Compiler.prototype={compile:function(){return this.buf=["var interp;"],this.lastBufferedIdx=-1,this.visit(this.node),this.buf.join("\n")},setDoctype:function(name){var doctype=doctypes[(name||"default").toLowerCase()];doctype=doctype||"<!DOCTYPE "+name+">",this.doctype=doctype,this.terse="5"==name||"html"==name,this.xml=0==this.doctype.indexOf("<?xml")},buffer:function(str,esc){esc&&(str=utils.escape(str)),this.lastBufferedIdx==this.buf.length?(this.lastBuffered+=str,this.buf[this.lastBufferedIdx-1]="buf.push('"+this.lastBuffered+"');"):(this.buf.push("buf.push('"+str+"');"),this.lastBuffered=str,this.lastBufferedIdx=this.buf.length)},visit:function(node){var debug=this.debug;debug&&this.buf.push("__.unshift({ lineno: "+node.line+", filename: "+(node.filename?'"'+node.filename+'"':"__[0].filename")+" });"),!1===node.debug&&this.debug&&(this.buf.pop(),this.buf.pop()),this.visitNode(node),debug&&this.buf.push("__.shift();")},visitNode:function(node){var name=node.constructor.name||node.constructor.toString().match(/function ([^(\s]+)()/)[1];return this["visit"+name](node)},visitLiteral:function(node){var str=node.str.replace(/\n/g,"\\\\n");this.buffer(str)},visitBlock:function(block){var len=block.nodes.length;for(var i=0;i<len;++i)this.visit(block.nodes[i])},visitDoctype:function(doctype){doctype&&(doctype.val||!this.doctype)&&this.setDoctype(doctype.val||"default"),this.doctype&&this.buffer(this.doctype),this.hasCompiledDoctype=!0},visitMixin:function(mixin){var name=mixin.name.replace(/-/g,"_")+"_mixin",args=mixin.args||"";mixin.block?(this.buf.push("var "+name+" = function("+args+"){"),this.visit(mixin.block),this.buf.push("}")):this.buf.push(name+"("+args+");")},visitTag:function(tag){this.indents++;var name=tag.name;this.hasCompiledTag||(!this.hasCompiledDoctype&&"html"==name&&this.visitDoctype(),this.hasCompiledTag=!0),this.pp&&inlineTags.indexOf(name)==-1&&this.buffer("\\n"+Array(this.indents).join("  ")),~selfClosing.indexOf(name)&&!this.xml?(this.buffer("<"+name),this.visitAttributes(tag.attrs),this.terse?this.buffer(">"):this.buffer("/>")):(tag.attrs.length?(this.buffer("<"+name),tag.attrs.length&&this.visitAttributes(tag.attrs),this.buffer(">")):this.buffer("<"+name+">"),tag.code&&this.visitCode(tag.code),tag.text&&this.buffer(utils.text(tag.text.nodes[0].trimLeft())),this.escape="pre"==tag.name,this.visit(tag.block),this.pp&&!~inlineTags.indexOf(name)&&!tag.textOnly&&this.buffer("\\n"+Array(this.indents).join("  ")),this.buffer("</"+name+">")),this.indents--},visitFilter:function(filter){var fn=filters[filter.name];if(!fn)throw filter.isASTFilter?new Error('unknown ast filter "'+filter.name+':"'):new Error('unknown filter ":'+filter.name+'"');if(filter.isASTFilter)this.buf.push(fn(filter.block,this,filter.attrs));else{var text=filter.block.nodes.join("");this.buffer(utils.text(fn(text,filter.attrs)))}},visitText:function(text){text=utils.text(text.nodes.join("")),this.escape&&(text=escape(text)),this.buffer(text),this.buffer("\\n")},visitComment:function(comment){if(!comment.buffer)return;this.pp&&this.buffer("\\n"+Array(this.indents+1).join("  ")),this.buffer("<!--"+utils.escape(comment.val)+"-->")},visitBlockComment:function(comment){if(!comment.buffer)return;0==comment.val.indexOf("if")?(this.buffer("<!--["+comment.val+"]>"),this.visit(comment.block),this.buffer("<![endif]-->")):(this.buffer("<!--"+comment.val),this.visit(comment.block),this.buffer("-->"))},visitCode:function(code){if(code.buffer){var val=code.val.trimLeft();this.buf.push("var __val__ = "+val),val='null == __val__ ? "" : __val__',code.escape&&(val="escape("+val+")"),this.buf.push("buf.push("+val+");")}else this.buf.push(code.val);code.block&&(code.buffer||this.buf.push("{"),this.visit(code.block),code.buffer||this.buf.push("}"))},visitEach:function(each){this.buf.push("// iterate "+each.obj+"\n"+"(function(){\n"+"  if ('number' == typeof "+each.obj+".length) {\n"+"    for (var "+each.key+" = 0, $$l = "+each.obj+".length; "+each.key+" < $$l; "+each.key+"++) {\n"+"      var "+each.val+" = "+each.obj+"["+each.key+"];\n"),this.visit(each.block),this.buf.push("    }\n  } else {\n    for (var "+each.key+" in "+each.obj+") {\n"+"      if ("+each.obj+".hasOwnProperty("+each.key+")){"+"      var "+each.val+" = "+each.obj+"["+each.key+"];\n"),this.visit(each.block),this.buf.push("      }\n"),this.buf.push("   }\n  }\n}).call(this);\n")},visitAttributes:function(attrs){var buf=[],classes=[];this.terse&&buf.push("terse: true"),attrs.forEach(function(attr){if(attr.name=="class")classes.push("("+attr.val+")");else{var pair="'"+attr.name+"':("+attr.val+")";buf.push(pair)}}),classes.length&&(classes=classes.join(" + ' ' + "),buf.push("class: "+classes)),buf=buf.join(", ").replace("class:",'"class":'),this.buf.push("buf.push(attrs({ "+buf+" }));")}};function escape(html){return String(html).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}}),require.register("doctypes.js",function(module,exports,require){module.exports={5:"<!DOCTYPE html>",xml:'<?xml version="1.0" encoding="utf-8" ?>',"default":'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',transitional:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',strict:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',frameset:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',1.1:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',basic:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',mobile:'<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'}}),require.register("filters.js",function(module,exports,require){module.exports={cdata:function(str){return"<![CDATA[\\n"+str+"\\n]]>"},sass:function(str){str=str.replace(/\\n/g,"\n");var sass=require("sass").render(str).replace(/\n/g,"\\n");return'<style type="text/css">'+sass+"</style>"},stylus:function(str,options){var ret;str=str.replace(/\\n/g,"\n");var stylus=require("stylus");return stylus(str,options).render(function(err,css){if(err)throw err;ret=css.replace(/\n/g,"\\n")}),'<style type="text/css">'+ret+"</style>"},less:function(str){var ret;return str=str.replace(/\\n/g,"\n"),require("less").render(str,function(err,css){if(err)throw err;ret='<style type="text/css">'+css.replace(/\n/g,"\\n")+"</style>"}),ret},markdown:function(str){var md;try{md=require("markdown")}catch(err){try{md=require("discount")}catch(err){try{md=require("markdown-js")}catch(err){throw new Error("Cannot find markdown library, install markdown or discount")}}}return str=str.replace(/\\n/g,"\n"),md.parse(str).replace(/\n/g,"\\n").replace(/'/g,"&#39;")},coffeescript:function(str){str=str.replace(/\\n/g,"\n");var js=require("coffee-script").compile(str).replace(/\n/g,"\\n");return'<script type="text/javascript">\\n'+js+"</script>"}}}),require.register("inline-tags.js",function(module,exports,require){module.exports=["a","abbr","acronym","b","br","code","em","font","i","img","ins","kbd","map","samp","small","span","strong","sub","sup"]}),require.register("jade.js",function(module,exports,require){var Parser=require("./parser"),Lexer=require("./lexer"),Compiler=require("./compiler"),runtime=require("./runtime");exports.version="0.16.1",exports.selfClosing=require("./self-closing"),exports.doctypes=require("./doctypes"),exports.filters=require("./filters"),exports.utils=require("./utils"),exports.Compiler=Compiler,exports.Parser=Parser,exports.Lexer=Lexer,exports.nodes=require("./nodes"),exports.runtime=runtime,exports.cache={};function parse(str,options){try{var parser=new Parser(str,options.filename,options),compiler=new(options.compiler||Compiler)(parser.parse(),options),js=compiler.compile();return options.debug&&console.error("\nCompiled Function:\n\n[90m%s[0m",js.replace(/^/gm,"  ")),"var buf = [];\n"+(options.self?"var self = locals || {};\n"+js:"with (locals || {}) {\n"+js+"\n}\n")+'return buf.join("");'}catch(err){parser=parser.context(),runtime.rethrow(err,parser.filename,parser.lexer.lineno)}}exports.compile=function(str,options){var options=options||{},client=options.client,filename=options.filename?JSON.stringify(options.filename):"undefined",fn;return options.compileDebug!==!1?fn=["var __ = [{ lineno: 1, filename: "+filename+" }];","try {",parse(String(str),options||{}),"} catch (err) {","  rethrow(err, __[0].filename, __[0].lineno);","}"].join("\n"):fn=parse(String(str),options||{}),client&&(fn="var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;\n"+fn),fn=new Function("locals, attrs, escape, rethrow",fn),client?fn:function(locals){return fn(locals,runtime.attrs,runtime.escape,runtime.rethrow)}},exports.render=function(str,options,fn){"function"==typeof options&&(fn=options,options={});if(options.cache&&!options.filename)return fn(new Error('the "filename" option is required for caching'));try{var path=options.filename,tmpl=options.cache?exports.cache[path]||(exports.cache[path]=exports.compile(str,options)):exports.compile(str,options);fn(null,tmpl(options))}catch(err){fn(err)}}}),require.register("lexer.js",function(module,exports,require){var Lexer=module.exports=function(str,options){options=options||{},this.input=str.replace(/\r\n|\r/g,"\n"),this.colons=options.colons,this.deferredTokens=[],this.lastIndents=0,this.lineno=1,this.stash=[],this.indentStack=[],this.indentRe=null,this.pipeless=!1};Lexer.prototype={tok:function(type,val){return{type:type,line:this.lineno,val:val}},consume:function(len){this.input=this.input.substr(len)},scan:function(regexp,type){var captures;if(captures=regexp.exec(this.input))return this.consume(captures[0].length),this.tok(type,captures[1])},defer:function(tok){this.deferredTokens.push(tok)},lookahead:function(n){var fetch=n-this.stash.length;while(fetch-->0)this.stash.push(this.next());return this.stash[--n]},indexOfDelimiters:function(start,end){var str=this.input,nstart=0,nend=0,pos=0;for(var i=0,len=str.length;i<len;++i)if(start==str[i])++nstart;else if(end==str[i]&&++nend==nstart){pos=i;break}return pos},stashed:function(){return this.stash.length&&this.stash.shift()},deferred:function(){return this.deferredTokens.length&&this.deferredTokens.shift()},eos:function(){if(this.input.length)return;return this.indentStack.length?(this.indentStack.shift(),this.tok("outdent")):this.tok("eos")},comment:function(){var captures;if(captures=/^ *\/\/(-)?([^\n]*)/.exec(this.input)){this.consume(captures[0].length);var tok=this.tok("comment",captures[2]);return tok.buffer="-"!=captures[1],tok}},tag:function(){var captures;if(captures=/^(\w[-:\w]*)/.exec(this.input)){this.consume(captures[0].length);var tok,name=captures[1];if(":"==name[name.length-1]){name=name.slice(0,-1),tok=this.tok("tag",name),this.defer(this.tok(":"));while(" "==this.input[0])this.input=this.input.substr(1)}else tok=this.tok("tag",name);return tok}},filter:function(){return this.scan(/^:(\w+)/,"filter")},doctype:function(){return this.scan(/^(?:!!!|doctype) *([^\n]+)?/,"doctype")},id:function(){return this.scan(/^#([\w-]+)/,"id")},className:function(){return this.scan(/^\.([\w-]+)/,"class")},text:function(){return this.scan(/^(?:\| ?)?([^\n]+)/,"text")},"extends":function(){return this.scan(/^extends +([^\n]+)/,"extends")},block:function(){return this.scan(/^block +([^\n]+)/,"block")},include:function(){return this.scan(/^include +([^\n]+)/,"include")},assignment:function(){var captures;if(captures=/^(\w+) += *([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var name=captures[1],val=captures[2];return this.tok("code","var "+name+" = ("+val+")")}},mixin:function(){var captures;if(captures=/^mixin +([-\w]+)(?:\(([^\)]+)\))?/.exec(this.input)){this.consume(captures[0].length);var tok=this.tok("mixin",captures[1]);return tok.args=captures[2],tok}},conditional:function(){var captures;if(captures=/^(if|unless|else if|else)\b([^\n]*)/.exec(this.input)){this.consume(captures[0].length);var type=captures[1],js=captures[2];switch(type){case"if":js="if ("+js+")";break;case"unless":js="if (!("+js+"))";break;case"else if":js="else if ("+js+")";break;case"else":js="else"}return this.tok("code",js)}},"while":function(){var captures;if(captures=/^while +([^\n]+)/.exec(this.input))return this.consume(captures[0].length),this.tok("code","while ("+captures[1]+")")},each:function(){var captures;if(captures=/^(?:- *)?(?:each|for) +(\w+)(?: *, *(\w+))? * in *([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var tok=this.tok("each",captures[1]);return tok.key=captures[2]||"$index",tok.code=captures[3],tok}},code:function(){var captures;if(captures=/^(!?=|-)([^\n]+)/.exec(this.input)){this.consume(captures[0].length);var flags=captures[1];captures[1]=captures[2];var tok=this.tok("code",captures[1]);return tok.escape=flags[0]==="=",tok.buffer=flags[0]==="="||flags[1]==="=",tok}},attrs:function(){if("("==this.input[0]){var index=this.indexOfDelimiters("(",")"),str=this.input.substr(1,index-1),tok=this.tok("attrs"),len=str.length,colons=this.colons,states=["key"],key="",val="",quote,c;function state(){return states[states.length-1]}function interpolate(attr){return attr.replace(/#\{([^}]+)\}/g,function(_,expr){return quote+" + ("+expr+") + "+quote})}this.consume(index+1),tok.attrs={};function parse(c){var real=c;colons&&":"==c&&(c="=");switch(c){case",":case"\n":switch(state()){case"expr":case"array":case"string":case"object":val+=c;break;default:states.push("key"),val=val.trim(),key=key.trim();if(""==key)return;tok.attrs[key.replace(/^['"]|['"]$/g,"")]=""==val?!0:interpolate(val),key=val=""}break;case"=":switch(state()){case"key char":key+=real;break;case"val":case"expr":case"array":case"string":case"object":val+=real;break;default:states.push("val")}break;case"(":("val"==state()||"expr"==state())&&states.push("expr"),val+=c;break;case")":("expr"==state()||"val"==state())&&states.pop(),val+=c;break;case"{":"val"==state()&&states.push("object"),val+=c;break;case"}":"object"==state()&&states.pop(),val+=c;break;case"[":"val"==state()&&states.push("array"),val+=c;break;case"]":"array"==state()&&states.pop(),val+=c;break;case'"':case"'":switch(state()){case"key":states.push("key char");break;case"key char":states.pop();break;case"string":c==quote&&states.pop(),val+=c;break;default:states.push("string"),val+=c,quote=c}break;case"":break;default:switch(state()){case"key":case"key char":key+=c;break;default:val+=c}}}for(var i=0;i<len;++i)parse(str[i]);return parse(","),tok}},indent:function(){var captures,re;this.indentRe?captures=this.indentRe.exec(this.input):(re=/^\n(\t*) */,captures=re.exec(this.input),captures&&!captures[1].length&&(re=/^\n( *)/,captures=re.exec(this.input)),captures&&captures[1].length&&(this.indentRe=re));if(captures){var tok,indents=captures[1].length;++this.lineno,this.consume(indents+1);if(" "==this.input[0]||"\t"==this.input[0])throw new Error("Invalid indentation, you can use tabs or spaces but not both");if("\n"==this.input[0])return this.tok("newline");if(this.indentStack.length&&indents<this.indentStack[0]){while(this.indentStack.length&&this.indentStack[0]>indents)this.stash.push(this.tok("outdent")),this.indentStack.shift();tok=this.stash.pop()}else indents&&indents!=this.indentStack[0]?(this.indentStack.unshift(indents),tok=this.tok("indent",indents)):tok=this.tok("newline");return tok}},pipelessText:function(){if(this.pipeless){if("\n"==this.input[0])return;var i=this.input.indexOf("\n");-1==i&&(i=this.input.length);var str=this.input.substr(0,i);return this.consume(str.length),this.tok("text",str)}},colon:function(){return this.scan(/^: */,":")},advance:function(){return this.stashed()||this.next()},next:function(){return this.deferred()||this.eos()||this.pipelessText()||this.doctype()||this.extends()||this.block()||this.include()||this.mixin()||this.conditional()||this.each()||this.while()||this.assignment()||this.tag()||this.filter()||this.code()||this.id()||this.className()||this.attrs()||this.indent()||this.comment()||this.colon()||this.text()}}}),require.register("nodes/block-comment.js",function(module,exports,require){var Node=require("./node"),BlockComment=module.exports=function(val,block,buffer){this.block=block,this.val=val,this.buffer=buffer};BlockComment.prototype=new Node,BlockComment.prototype.constructor=BlockComment}),require.register("nodes/block.js",function(module,exports,require){var Node=require("./node"),Block=module.exports=function(node){this.nodes=[],node&&this.push(node)};Block.prototype=new Node,Block.prototype.constructor=Block,Block.prototype.replace=function(other){other.nodes=this.nodes},Block.prototype.push=function(node){return this.nodes.push(node)},Block.prototype.isEmpty=function(){return 0==this.nodes.length},Block.prototype.unshift=function(node){return this.nodes.unshift(node)},Block.prototype.lastBlock=function(){var last=this,node;for(var i=0,len=this.nodes.length;i<len;++i)node=this.nodes[i],node.nodes?last=node.lastBlock():node.block&&!node.block.isEmpty()&&(last=node.block.lastBlock());return last}}),require.register("nodes/code.js",function(module,exports,require){var Node=require("./node"),Code=module.exports=function(val,buffer,escape){this.val=val,this.buffer=buffer,this.escape=escape,val.match(/^ *else/)&&(this.debug=!1)};Code.prototype=new Node,Code.prototype.constructor=Code}),require.register("nodes/comment.js",function(module,exports,require){var Node=require("./node"),Comment=module.exports=function(val,buffer){this.val=val,this.buffer=buffer};Comment.prototype=new Node,Comment.prototype.constructor=Comment}),require.register("nodes/doctype.js",function(module,exports,require){var Node=require("./node"),Doctype=module.exports=function(val){this.val=val};Doctype.prototype=new Node,Doctype.prototype.constructor=Doctype}),require.register("nodes/each.js",function(module,exports,require){var Node=require("./node"),Each=module.exports=function(obj,val,key,block){this.obj=obj,this.val=val,this.key=key,this.block=block};Each.prototype=new Node,Each.prototype.constructor=Each}),require.register("nodes/filter.js",function(module,exports,require){var Node=require("./node"),Block=require("./block"),Filter=module.exports=function(name,block,attrs){this.name=name,this.block=block,this.attrs=attrs,this.isASTFilter=block instanceof Block};Filter.prototype=new Node,Filter.prototype.constructor=Filter}),require.register("nodes/index.js",function(module,exports,require){exports.Node=require("./node"),exports.Tag=require("./tag"),exports.Code=require("./code"),exports.Each=require("./each"),exports.Text=require("./text"),exports.Block=require("./block"),exports.Mixin=require("./mixin"),exports.Filter=require("./filter"),exports.Comment=require("./comment"),exports.Literal=require("./literal"),exports.BlockComment=require("./block-comment"),exports.Doctype=require("./doctype")}),require.register("nodes/literal.js",function(module,exports,require){var Node=require("./node"),Literal=module.exports=function(str){this.str=str};Literal.prototype=new Node,Literal.prototype.constructor=Literal}),require.register("nodes/mixin.js",function(module,exports,require){var Node=require("./node"),Mixin=module.exports=function(name,args,block){this.name=name,this.args=args,this.block=block};Mixin.prototype=new Node,Mixin.prototype.constructor=Mixin}),require.register("nodes/node.js",function(module,exports,require){var Node=module.exports=function(){}}),require.register("nodes/tag.js",function(module,exports,require){var Node=require("./node"),Block=require("./block"),Tag=module.exports=function(name,block){this.name=name,this.attrs=[],this.block=block||new Block};Tag.prototype=new Node,Tag.prototype.constructor=Tag,Tag.prototype.setAttribute=function(name,val){return this.attrs.push({name:name,val:val}),this},Tag.prototype.removeAttribute=function(name){for(var i=0,len=this.attrs.length;i<len;++i)this.attrs[i]&&this.attrs[i].name==name&&delete this.attrs[i]},Tag.prototype.getAttribute=function(name){for(var i=0,len=this.attrs.length;i<len;++i)if(this.attrs[i]&&this.attrs[i].name==name)return this.attrs[i].val}}),require.register("nodes/text.js",function(module,exports,require){var Node=require("./node"),Text=module.exports=function(line){this.nodes=[],"string"==typeof line&&this.push(line)};Text.prototype=new Node,Text.prototype.constructor=Text,Text.prototype.push=function(node){return this.nodes.push(node)}}),require.register("parser.js",function(module,exports,require){var Lexer=require("./lexer"),nodes=require("./nodes"),Parser=exports=module.exports=function(str,filename,options){this.input=str,this.lexer=new Lexer(str,options),this.filename=filename,this.blocks={},this.options=options,this.contexts=[this]},textOnly=exports.textOnly=["code","script","textarea","style","title"];Parser.prototype={context:function(parser){if(parser)this.contexts.push(parser);else return this.contexts.pop()},advance:function(){return this.lexer.advance()},skip:function(n){while(n--)this.advance()},peek:function(){return this.lookahead(1)},line:function(){return this.lexer.lineno},lookahead:function(n){return this.lexer.lookahead(n)},parse:function(){var block=new nodes.Block,parser;block.line=this.line();while("eos"!=this.peek().type)"newline"==this.peek().type?this.advance():block.push(this.parseExpr());if(parser=this.extending){this.context(parser);var ast=parser.parse();return this.context(),ast}return block},expect:function(type){if(this.peek().type===type)return this.advance();throw new Error('expected "'+type+'", but got "'+this.peek().type+'"')},accept:function(type){if(this.peek().type===type)return this.advance()},parseExpr:function(){switch(this.peek().type){case"tag":return this.parseTag();case"mixin":return this.parseMixin();case"block":return this.parseBlock();case"extends":return this.parseExtends();case"include":return this.parseInclude();case"doctype":return this.parseDoctype();case"filter":return this.parseFilter();case"comment":return this.parseComment();case"text":return this.parseText();case"each":return this.parseEach();case"code":return this.parseCode();case"id":case"class":var tok=this.advance();return this.lexer.defer(this.lexer.tok("tag","div")),this.lexer.defer(tok),this.parseExpr();default:throw new Error('unexpected token "'+this.peek().type+'"')}},parseText:function(){var tok=this.expect("text"),node=new nodes.Text(tok.val);return node.line=this.line(),node},parseCode:function(){var tok=this.expect("code"),node=new nodes.Code(tok.val,tok.buffer,tok.escape),block,i=1;node.line=this.line();while(this.lookahead(i)&&"newline"==this.lookahead(i).type)++i;return block="indent"==this.lookahead(i).type,block&&(this.skip(i-1),node.block=this.block()),node},parseComment:function(){var tok=this.expect("comment"),node;return"indent"==this.peek().type?node=new nodes.BlockComment(tok.val,this.block(),tok.buffer):node=new nodes.Comment(tok.val,tok.buffer),node.line=this.line(),node},parseDoctype:function(){var tok=this.expect("doctype"),node=new nodes.Doctype(tok.val);return node.line=this.line(),node},parseFilter:function(){var block,tok=this.expect("filter"),attrs=this.accept("attrs");this.lexer.pipeless=!0,block=this.parseTextBlock(),this.lexer.pipeless=!1;var node=new nodes.Filter(tok.val,block,attrs&&attrs.attrs);return node.line=this.line(),node},parseASTFilter:function(){var block,tok=this.expect("tag"),attrs=this.accept("attrs");this.expect(":"),block=this.block();var node=new nodes.Filter(tok.val,block,attrs&&attrs.attrs);return node.line=this.line(),node},parseEach:function(){var tok=this.expect("each"),node=new nodes.Each(tok.code,tok.val,tok.key,this.block());return node.line=this.line(),node},parseExtends:function(){var path=require("path"),fs=require("fs"),dirname=path.dirname,basename=path.basename,join=path.join;if(!this.filename)throw new Error('the "filename" option is required to extend templates');var path=name=this.expect("extends").val.trim(),dir=dirname(this.filename),path=join(dir,path+".jade"),str=fs.readFileSync(path,"utf8"),parser=new Parser(str,path,this.options);return parser.blocks=this.blocks,parser.contexts=this.contexts,this.extending=parser,new nodes.Literal("")},parseBlock:function(){var name=this.expect("block").val.trim(),block="indent"==this.peek().type?this.block():new nodes.Block(new nodes.Literal(""));return this.blocks[name]=this.blocks[name]||block},parseInclude:function(){var path=require("path"),fs=require("fs"),dirname=path.dirname,basename=path.basename,join=path.join,path=name=this.expect("include").val.trim(),dir=dirname(this.filename);if(!this.filename)throw new Error('the "filename" option is required to use includes');if(~basename(path).indexOf(".")){var path=join(dir,path),str=fs.readFileSync(path,"utf8");return new nodes.Literal(str)}var path=join(dir,path+".jade"),str=fs.readFileSync(path,"utf8"),parser=new Parser(str,path,this.options);this.context(parser);var ast=parser.parse();return this.context(),ast.filename=path,"indent"==this.peek().type&&ast.lastBlock().push(this.block()),ast},parseMixin:function(){var tok=this.expect("mixin"),name=tok.val,args=tok.args,block="indent"==this.peek().type?this.block():null;return new nodes.Mixin(name,args,block)},parseTextBlock:function(){var text=new nodes.Text;text.line=this.line();var spaces=this.expect("indent").val;null==this._spaces&&(this._spaces=spaces);var indent=Array(spaces-this._spaces+1).join(" ");while("outdent"!=this.peek().type)switch(this.peek().type){case"newline":text.push("\\n"),this.advance();break;case"indent":text.push("\\n"),this.parseTextBlock().nodes.forEach(function(node){text.push(node)}),text.push("\\n");break;default:text.push(indent+this.advance().val)}return spaces==this._spaces&&(this._spaces=null),this.expect("outdent"),text},block:function(){var block=new nodes.Block;block.line=this.line(),this.expect("indent");while("outdent"!=this.peek().type)"newline"==this.peek().type?this.advance():block.push(this.parseExpr());return this.expect("outdent"),block},parseTag:function(){var i=2;"attrs"==this.lookahead(i).type&&++i;if(":"==this.lookahead(i).type&&"indent"==this.lookahead(++i).type)return this.parseASTFilter();var name=this.advance().val,tag=new nodes.Tag(name),dot;tag.line=this.line();out:for(;;)switch(this.peek().type){case"id":case"class":var tok=this.advance();tag.setAttribute(tok.type,"'"+tok.val+"'");continue;case"attrs":var obj=this.advance().attrs,names=Object.keys(obj);for(var i=0,len=names.length;i<len;++i){var name=names[i],val=obj[name];tag.setAttribute(name,val)}continue;default:break out}"."==this.peek().val&&(dot=tag.textOnly=!0,this.advance());switch(this.peek().type){case"text":tag.text=this.parseText();break;case"code":tag.code=this.parseCode();break;case":":this.advance(),tag.block=new nodes.Block,tag.block.push(this.parseTag())}while("newline"==this.peek().type)this.advance();tag.textOnly=tag.textOnly||~textOnly.indexOf(tag.name);if("script"==tag.name){var type=tag.getAttribute("type");!dot&&type&&"text/javascript"!=type.replace(/^['"]|['"]$/g,"")&&(tag.textOnly=!1)}if("indent"==this.peek().type)if(tag.textOnly)this.lexer.pipeless=!0,tag.block=this.parseTextBlock(),this.lexer.pipeless=!1;else{var block=this.block();if(tag.block)for(var i=0,len=block.nodes.length;i<len;++i)tag.block.push(block.nodes[i]);else tag.block=block}return tag}}}),require.register("runtime.js",function(module,exports,require){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.attrs=function(obj){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):buf.push(key+'="'+exports.escape(val)+'"')}}return buf.join(" ")},exports.escape=function(html){return String(html).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err}}),require.register("self-closing.js",function(module,exports,require){module.exports=["meta","img","link","input","area","base","col","br","hr"]}),require.register("utils.js",function(module,exports,require){var interpolate=exports.interpolate=function(str){return str.replace(/(\\)?([#!]){(.*?)}/g,function(str,escape,flag,code){return escape?str:"' + "+("!"==flag?"":"escape")+"((interp = "+code.replace(/\\'/g,"'")+") == null ? '' : interp) + '"})},escape=exports.escape=function(str){return str.replace(/'/g,"\\'")};exports.text=function(str){return interpolate(escape(str))}})return require('jade.js');});