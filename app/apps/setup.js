define([
	'utils/multiscreen',
//	'tpl/telephony_callcenter',
//	'tpl/telephony_callhistory',
//	'tpl/telephony_chooser',
//	'tpl/telephony_phonebook',
//	'tpl/telephony_sms',
//	'tpl/telephony_voicemail',
//	'text!css/telephony.css',
	'loader/loader',
//	'utils/miniscreen',
	'dom/dom',
	'dom/classes',
//	'utils/telescreen',
	'utils/scrollable',
//	'utils/dialler',
	'shims/bind',
	'transport/request',
	'transport/response',
//	'env/exports',
//	'tpl/telephony_incall',
	'data/static-strings',
//	'text!css/multiscreenchooser.css',
//	'text!css/setup.css'
	'tpl/setup_chooser',
	'utils/telescreen'
], function(
	App, 
	loader, 
	dom, 
	classes, 
	scrollable, 
	bind,
	request,
	response,
	strings,
//	css,
//	css2,
	choosertpl, 
	TeleMini ) {
//	loader.loadCSSFromText(css+css2);
	loader.loadCSS(['app/css/multiscreenchooser.css','app/css/setup.css' ], function(){});
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
//	/**
//	* Call center mini screen. Dialler
//	*/
//	var CallCenter = new TeleMini({
//		name: 'callcenter',
//		template: template1,
//		panels: {
//			top: false,
//			bottom: false
//		}
//	});
//	CallCenter.Dialler = new Dialler();
//	CallCenter.knownKeys_ = ['up', 'down', 'left', 'right'];
//	CallCenter.numberKeys_ =  ['zero','one','two','three','four','five','six','seven','eight','nine'];
//	CallCenter.keyHandler = function(key) {
//		var activeKey;
//		var line;
//		var req;
//		if (this.knownKeys_.indexOf(key)!== -1) {
//			if (this.Dialler.container === null ) {
//				this.Dialler.container = this.dom_;
//			}
//			this.Dialler.eventHandler(key);
//		} else if (key === 'ok') {
//			activeKey = this.Dialler.getActiveKey();
//			if (classes.hasClass(activeKey, 'digit')) {
//				this.Dialler.addCharacter(activeKey.textContent);
//			} else {
//				if (classes.hasClass(activeKey, 'del')) {
//					this.Dialler.deleteCharacter();
//				} else if ( classes.hasClass(activeKey, 'phoneBook')) {
////					this.master.activateScreen(5);
//					this.master.activateScreen(5, bind(function(record) {
//						this.master.activateScreen(1);
//						this.Dialler.replaceAll(record.phone);
//					}, this));
//				} else if (classes.hasClass(activeKey, 'calls')) {
//					this.master.activateScreen(2);
//				} else if (classes.hasClass(activeKey, 'up')) {
////					TODO: Start a call, probably with menu
////					console.log('Initiate call');
//					if (!tui.phone.lineStatus['line1']) {
//						line = 'openline1';
//					} else if (!tui.phone.lineStatus['line2']) {
//						line = 'openline2';
//					} else {
//						return;
//					}
//					var req = request.create('calld', {
//						run: 'start_json_voicecall',
//						sig: line,
//						newif: '1',
//						num: this.Dialler.value
//					});
//					req.send();
//				}
//			}
//		} else if (this.numberKeys_.indexOf(key)!== -1) {
//			this.Dialler.addCharacter(this.numberKeys_.indexOf(key));
//		} else if (key === 'delete') {
//			this.Dialler.deleteCharacter();
//		}
//	};
//	CallCenter.updateNumber = function() {
//		console.log('^^^^^^^^^^^^^^^^^^')
//		this.numberField.innerHTML = this.number_;
//	}
//	CallCenter.on('activated', function() {
//		if (!this.Dialler.boundElement) {
//			this.Dialler.boundElement = dom.$('.phoneDisplay');
//		}
//		if (this.Dialler.container === null ) {
//			this.Dialler.container = this.dom_;
//		}
//		var activeKey = dom.$('.phone-btn.focus', this.dom_);
//		if (activeKey === null) {
//			classes.addClasses(dom.$('.phone-btn', this.dom_), 'focus');
//		}
//	})

//	/**
//	 * Call history mini screen
//	 */
//	var CallHistory = new TeleMini({
//		name: 'callhistory',
//		template: template2,
//		deps: '/cgi-bin/voip.cgi?run=callhistory_json_lists&newif=1',
//		panels: {
//			keys: ['ok']
//		}
//	});
//	CallHistory.keyHandler = function(key) {
//		switch (key) {
//			default:
//				console.log('Received key', key)
//		}
//	};


//	/**
//	 * Phonebook miniscreen
//	 */
//	var PhoneBook = new TeleMini({
//		name: 'phonebook',
//		template: template4,
//		deps: '/cgi-bin/voip.cgi?run=phb_json_list&newif=1',
//		panels:{ keys : ['info', 'ok', 'upDown'] }
//	});
//	PhoneBook.Scrollable = new Scrollable('.phoneBookResults', '.phonebookItem.active');
//	PhoneBook.registerDisposable(this.Scrollable);
//	PhoneBook.on('activated', function(intent) {
//		this.selectItem(0);
//		this.Scrollable.scroll();
//		if (intent) {
//			this.intent = intent;
//		}
//	});
//	PhoneBook.selectItem = function(index) {
//		if (index >= this.master.getData(this.name).length || index < 0 ) return;
//		var all = dom.$$('.phonebookItem', this.dom_);
//		var current = dom.$('.active', this.dom_);
//		if (current !== null) {
//			classes.removeClasses(current, 'active');
//		}
//		classes.addClasses(all[index], 'active');
//		this.Scrollable.scroll();
//	};
//	PhoneBook.keyHandler = function(key) {
//		switch (key) {
//			case 'up':
//				this.selectItem(parseInt(dom.dataGet(dom.$('.active', this.dom_), 'sequence'), 10) - 1 );
//				break;
//			case 'down':
//				this.selectItem(parseInt(dom.dataGet(dom.$('.active', this.dom_), 'sequence'), 10) + 1 );
//				break;
//			case 'ok':
//				var record = this.master.getData(this.name)[parseInt(dom.dataGet(dom.$('.active', this.dom_), 'sequence'), 10)]
//				if (typeof this.intent == 'function') {
//					var cb = this.intent;
//					delete this.intent;
//					cb(record);
//				} else {
//					console.log('Show menu', record);
//				}
//		}
//	};
//	/**
//	 * SmsCenter mini screens
//	 */
//	var Sms = new TeleMini({
//		name: 'sms',
//		template: template5,
//		panels: {
//			keys: ['arrows']
//		}
//	});
//	Sms.on('activated', function() {
//		if ( !this.elements ) {
//			this.elements = {
//				to: dom.$('.receiver', this.dom_),
//				message: dom.$('.message', this.dom_),
//				clear: dom.$('.clearBtn', this.dom_),
//				send: dom.$('.sendBtn', this.dom_),
//				toPhoneBook: dom.$('.phoneBook', this.dom_)
//			};
//			this.elements.tabOrder = ['to', 'toPhoneBook', 'message', 'send', 'clear'];
//			classes.addClasses(this.elements.to, 'focus');
//			this.elements.focusedComponent = 0;
//			this.elements.recepient = {
//				number: '',
//				name: ''
//			};
//		}
//	});
//	Sms.knownKeys_ = ['up', 'down', 'left', 'right'];
//	Sms.numberKeys_ =  ['zero','one','two','three','four','five','six','seven','eight','nine'];
//	Sms.updateNumber = function() {
//		this.elements.to.innerHTML = ( this.elements.recepient.name !== '' ) ?
//			this.elements.recepient.name :
//			this.elements.recepient.number;
//	}
//	Sms.keyHandler = function(key) {
//		if (this.numberKeys_.indexOf(key) !==-1) {
//			this.elements.recepient.number = this.elements.recepient.number + this.numberKeys_.indexOf(key);
//			this.updateNumber();
//		} else if (key === 'delete') {
//			this.elements.recepient.number = this.elements.recepient.number.substr(0,this.elements.recepient.number.length-1);
//			this.updateNumber();
//		} else if ( this.knownKeys_.indexOf(key)!==-1) {
//			this.changeFocus(key);
//		} else if (key === 'ok') {
//			switch (this.elements.tabOrder[this.elements.focusedComponent]) {
//				case 'to':
//				case 'toPhoneBook':
//					this.master.activateScreen(5, bind(function(record) {
//						this.master.activateScreen(4);
//						this.elements.recepient.name = record.name;
//						this.elements.recepient.number = record.phone;
//						this.updateNumber();
//					}, this));
//					break;
//				case 'message':
////					TODO: start composing message when message is active on OK press
//					break;
//				case 'send':
////					TODO: Send the message as SMS
//					console.log('Send the meessage');
//					break;
//				case 'clear':
////					TODO: Clear the message
//					console.log('Clear messaeg');
//					break;
//			}
//		}
//	};
//	Sms.changeFocus = function(key) {
//		switch (key) {
//			case 'right':
//			case 'down':
//				if (this.elements.focusedComponent >= this.elements.tabOrder.length -1 ) {
//					return;
//				}
//				classes.removeClasses(this.elements[this.elements.tabOrder[this.elements.focusedComponent]], 'active');
//				this.elements.focusedComponent++;
//				classes.addClasses(this.elements[this.elements.tabOrder[this.elements.focusedComponent]], 'active');
//				break;
//			case 'left':
//			case 'up':
//				if (this.elements.focusedComponent <= 0 ) {
//					return;
//				}
//				classes.removeClasses(this.elements[this.elements.tabOrder[this.elements.focusedComponent]], 'active');
//				this.elements.focusedComponent--;
//				classes.addClasses(this.elements[this.elements.tabOrder[this.elements.focusedComponent]], 'active');
//		}
//	};

//	/**
//	 * VoiceMail miniscreens
//	 */
//	var VoiceMail = new TeleMini({
//		name: 'voicemail',
//		template: template6,
//		deps: '/cgi-bin/voip.cgi?run=vmmsgs_json_list&newif=1',
//		panels: { keys: ['upDown', 'ok']}
//	});
	
	var Setup = new App({
		name: 'phone',
		miniscreens: [ Chooser ]
		// CallCenter, CallHistory, VoiceMail, Sms, PhoneBook ]
	});
	Setup.fillContent = function(data) {
		console.log(data)
	}
	var req = request.create('calld', {
		'run': 'fill_setup_json'
	});
	response.register(req, bind(Setup.fillContent, Setup));
	req.send();
//	var req = request.create('calld', {
//		run: 'get_linestat_json'
//	});
//	req.send();
	return Setup;
});
