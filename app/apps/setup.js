define([
	'utils/multiscreenjson',
	'utils/telescreen',
	'loader/loader',
	'dom/dom',
	'dom/classes',
	'utils/scrollable',
	'shims/bind',
	'transport/request',
	'transport/response',
	'data/static-strings',
	'tpl/setup_chooser',
	'utils/miniscreenjson',
	'json/json',
	'tpl/setupminiscreen',
	'text!css/setupminis.css',
	'loader/loader'
], function(
	App, 
	TeleMini,
	loader, 
	dom, 
	classes, 
	scrollable, 
	bind,
	request,
	response,
	strings,
	choosertpl,
	NM,
	json,
	template,
	css, loader ) {
	loader.loadCSSFromText(css);
	/**
	* Mini screen chooser
	*/
	var Chooser = new TeleMini({
		name: 'chooser',
		template: choosertpl,
		panels: {
			keys: ['leftRight','ok']
		}
	});
	Chooser.keyHandler = function(key) {
		var node;
		if (typeof key !== 'string') {
			this.setActiveIcon(key);
		}
		switch (key) {
			case 'ok':
				node = dom.$('.active', this.dom_);
				this.master.activateScreen(parseInt(dom.dataGet(node, 'sequence'), 10))
			case 'left':
			case 'right':
				this.setActiveIcon(key);
				break;
		}
	};
	Chooser.setActiveIcon = function(index) {
		var current = dom.$('.active', this.dom_);
		var next;
		if (typeof index === 'number') {
			next = dom.$$('.icon', this.dom_)[index];
		} else if (typeof index === 'string') {
			if (index == 'right' && current.nextElementSibling !== null) {
				next =  current.nextElementSibling;
			} else if (index == 'left' && current.previousElementSibling !== null) {
				next = current.previousElementSibling
			}
		}
		if (next) {
			if (current !== null ) {
				classes.removeClasses(current, 'active');
			}
			classes.addClasses(next, 'active');
		}
	};
	Chooser.on('activated', function(index) {
		if (typeof index !== 'number') index = 0;
		this.setActiveIcon(index);
	});
	
	var General = new NM({
		name: 'general',
		template: template,
		panels: {
			top: false,
			bottom: false
		}
	});

	var Setup = new App({
		name: 'phone',
		miniscreens: [ Chooser , General ],
		deps: {
			"run": 'fill_setup_json'
		}
	});
	Setup.fillContent = function(data) {
		console.log(json.parse(data.content));
		
	};
	return Setup;
});
