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
	'dom/classes',
	'utils/telescreen',
	'utils/scrollable',
	'utils/dialler'
], function(App, template1, template2, template3, template4, template5, template6, css, loader, Mini, dom, classes, TeleMini, Scrollable, Dialler) {
	loader.loadCSSFromText(css);
	/**
	* Mini screen chooser
	*/
	var Chooser = new TeleMini({
		name: 'chooser',
		template: template3,
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
	/**
	* Call center mini screen. Dialler
	*/
	var CallCenter = new TeleMini({
		name: 'callcenter',
		template: template1,
		panels: {
			top: false, 
			bottom: false
		}
	});
	CallCenter.Dialler = new Dialler();
	CallCenter.knownKeys_ = ['up', 'down', 'left', 'right'];
	CallCenter.numberKeys_ =  ['zero','one','two','three','four','five','six','seven','eight','nine'];
	CallCenter.keyHandler = function(key) {
		var activeKey;
		if (this.knownKeys_.indexOf(key)!== -1) {
			if (this.Dialler.container === null ) {
				this.Dialler.container = this.dom_;
			}
			this.Dialler.eventHandler(key);
		} else if (key === 'ok') {
			activeKey = this.Dialler.getActiveKey();
			if (classes.hasClass(activeKey, 'digit')) {
				this.Dialler.addCharacter(activeKey.textContent);
			} else {
				if (classes.hasClass(activeKey, 'back')) {
					this.Dialler.deleteCharacter();
				}
			}
		} else if (this.numberKeys_.indexOf(key)!== -1) {
			this.Dialler.addCharacter(this.numberKeys_.indexOf(key));
//			console.log('key is ', this.numberKeys_.indexOf(key));
//			this.number_ = this.number_ + '' + this.numberKeys_.indexOf(key);
//			this.updateNumber();
		} else if (key === 'delete') {
			this.Dialler.deleteCharacter();
		}
	};
	CallCenter.updateNumber = function() {
		this.numberField.innerHTML = this.number_;
	}
	CallCenter.on('activated', function() {
		if (!this.Dialler.boundElement) {
			this.Dialler.boundElement = dom.$('.phoneDisplay');
		}
		if (this.Dialler.container === null ) {
			this.Dialler.container = this.dom_;
		}
		var activeKey = dom.$('.phone-btn.focus', this.dom_);
		if (activeKey === null) {
			classes.addClasses(dom.$('.phone-btn', this.dom_), 'focus');
		}
	})
	
	/**
	 * Call history mini screen
	 */
	var CallHistory = new TeleMini({
		name: 'callhistory',
		template: template2,
		deps: '/cgi-bin/voip.cgi?run=callhistory_json_lists&newif=1',
		panels: {
			keys: ['ok']
		}
	});
	CallHistory.keyHandler = function(key) {
		switch (key) {
			default: 
				console.log('Received key', key)
		}
	};

	
	/**
	 * Phonebook miniscreen
	 */
	var PhoneBook = new TeleMini({
		name: 'phonebook',
		template: template4,
		deps: '/cgi-bin/voip.cgi?run=phb_json_list&newif=1',
		panels:{ keys : ['info', 'ok', 'upDown'] }
	});	
	PhoneBook.Scrollable = new Scrollable('.phoneBookResults', '.phonebookItem.active');
	PhoneBook.registerDisposable(this.Scrollable);
	PhoneBook.on('activated', function() {
		console.log('Screen PB activats')
		this.selectItem(0);
		this.Scrollable.scroll();
	});
	PhoneBook.selectItem = function(index) {
		if (index >= this.master.getData(this.name).length || index < 0 ) return;
		var all = dom.$$('.phonebookItem', this.dom_);
		var current = dom.$('.active', this.dom_);
		if (current !== null) {
			classes.removeClasses(current, 'active');
		}
		classes.addClasses(all[index], 'active');
		this.Scrollable.scroll();
	};
	PhoneBook.keyHandler = function(key) {
		switch (key) {
			case 'up':
				this.selectItem(parseInt(dom.dataGet(dom.$('.active', this.dom_), 'sequence'), 10) - 1 );
				break;
			case 'down':
				this.selectItem(parseInt(dom.dataGet(dom.$('.active', this.dom_), 'sequence'), 10) + 1 );
				break;
		}
	};
	/**
	 * SmsCenter mini screens
	 */
	var Sms = new TeleMini({
		name: 'sms',
		template: template5,
		panels: {
			keys: ['arrows']
		}
	});
	
	/**
	 * VoiceMail miniscreens
	 */
	var VoiceMail = new Mini({
		name: 'voicemail',	
		template: template6,
		deps: '/cgi-bin/voip.cgi?run=vmmsgs_json_list&newif=1'
	});
	VoiceMail.on('remote-key', function(key) {
		switch (key) {
			case 'return':
				this.master.activateScreen(0);
				break;
			default: 
				console.log('Received key', key)
		}
	});
	VoiceMail.panelSetup = {
		top: false,
		bottom: true,
		keys: ['upDown', 'ok']
	}
	
	var Tele = new App({
		name: 'phone',
		miniscreens: [ Chooser, CallCenter, CallHistory, VoiceMail, Sms, PhoneBook ]
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
