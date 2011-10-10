var fs = require('fs'),
	jade = require('jade'),
	PATH = '../app/tpl/',
	re = /\.jade$/;
var filelist = fs.readdir(PATH, function(err, list) {
	if (err) {
		console.log('Error occured reading directory');
		return;
	}
	list.forEach(function(item) {
		if (re.test(item)) {
			var tpl = fs.readFile(PATH + item, encoding = 'utf8', function(err, data) {
				if (err) {
					console.log('Error opening file : ' + item);
					return;
				}
				var a = jade.compile(data, {
					compileDebug: false,
					client: true
				});
				a = 'define(["support/runtime"],function(jade){' + a.toString();
				a = a + 'return { render: anonymous }; });';
				fs.writeFile(PATH + item.replace(/\.jade/, '.js'), a, encoding = 'utf8', function(err) {
					if (err) {
						console.log('Error writing file :' + item.replace(/\.jade/, '.js'));
					}
				});
			});
		}
	});
});
