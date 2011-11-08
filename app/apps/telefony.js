define([
	'utils/multiscreen',
	'tpl/telephony_callcenter',
	'tpl/telephony_callhistory',
	'tpl/telephony_chooser',
	'tpl/telephony_phonebook',
	'tpl/telephony_sms',
	'tpl/telephony_voicemail',
	'text!css/telephony.css',
	'loader/loader'
], function(App, template1, template2, template3, template4, template5, template6, css, loader) {
	loader.loadCSSFromText(css);
	var Tele = new App({
		name: 'phone',
		miniscreens: [
			{
				name: 'chooser',
				template: template3
			},
			{	
				name: 'callcenter',
				template: template1
			},
			{
				name: 'callhistory',
				template: template2
			},
			{
				name: 'phonebook',
				template: template4
			},
			{
				name: 'sms',
				template: template5
			},
			{
				name: 'voicemail',
				template: template6
			}
		]
	});
	return Tele;
});
