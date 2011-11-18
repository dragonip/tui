define([
	'utils/multiscreen',
	'tpl/telephony_callcenter',
	'tpl/telephony_callhistory',
	'tpl/telephony_chooser',
	'tpl/telephony_phonebook',
	'tpl/telephony_sms',
	'tpl/telephony_voicemail',
	'text!css/telephony.css',
	'loader/loader',
	'utils/miniscreen',
	'dom/dom',
	'dom/classes'
], function(App, template1, template2, template3, template4, template5, template6, css, loader, Mini, dom, classes) {
	loader.loadCSSFromText(css);
	/**
	* Mini screen chooser
	*/
	var Chooser = new Mini({
		name: 'chooser',
		template: template3
	});
	Chooser.on('remote-key', function(key) {
		this.setActiveIcon(key);
	});
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
		if (next && current !== null ) classes.removeClasses(current, 'active');
		classes.addClasses(next, 'active');
	};
	Chooser.on('activated', function(index) {
		if (typeof index !== 'number') index = 0;
		this.setActiveIcon(index);
	});
	/**
	* Call center mini screen. Dialler
	*/
	var CallCenter = new Mini({
		name: 'callcenter',
		template: template1
	});
	
	var Tele = new App({
		name: 'phone',
		miniscreens: [ Chooser, CallCenter ]
//			{
//				name: 'chooser',
//				template: template3
//			},
//			{	
//				name: 'callcenter',
//				template: template1
//			},
//			{
//				name: 'callhistory',
//				template: template2
//			},
//			{
//				name: 'phonebook',
//				template: template4
//			},
//			{
//				name: 'sms',
//				template: template5
//			},
//			{
//				name: 'voicemail',
//				template: template6
//			}
//		]
	});
	return Tele;
});
