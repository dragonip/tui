define([
	'tpl/telephony_incall',
	'data/static-strings',
	'env/exports',
	'shims/bind',
	'dom/dom'
], function(template, strings, exports, bind, dom){
	var Phone = function() {
		this.activeLine = null;
		this.isShown = false;
		this.lineStatus = {
			line1: false,
			line2: false
		};
		this.init();
	};
	
	Phone.callStatuses = {
		nocall: 0,
		ringing: 1,
		incall: 2,
		dialing: 3,
		onhold: 4,
		waiting: 5,
		conference: 6,
		voicemail: 7
	};
	
	Phone.prototype.init = function() {
		this.calls = {
			line1: {
				number: '',
				name: '',
				status: Phone.callStatuses.nocall
			},
			line2: {
				number: '',
				name: '',
				status: Phone.callStatuses.nocall
			}
		};
		this.bound = bind(this.keyHandler, this);
		this.dom_ = dom.getInnerNodes(template.render());

	};
	
	Phone.prototype.keyHandler = function(key) {
		console.log('Key received in Phone', key)
	};
		
	Phone.prototype.updateLine = function(eventOptions) {
		console.log("received update for the phone", eventOptions)
		var linetxt = 'line' + eventOptions.line;
		line = this.calls[linetxt];
		line.number = eventOptions.callerid;
		line.name = eventOptions.callername;
		line.status = Phone.callStatuses[eventOptions['call']];
		this.lineStatus[linetxt] = (eventOptions.status === 'ready') ? false : true;
		this.update();
	};
	
	Phone.prototype.update = function() {
		var domRepresenation;
		if (this.lineStatus.line1 || this.lineStatus.line2) {
			//we need to show the contianer
//			this.updateContent();
		} else {
			if (this.isShown) this.hide();
		}
	}
	
//	Phone.prototype.updateContent = function() {
//		var el;
//		if ( this.lineStatus.line1)
//	}
	
	/**
	 * Show the screen on top of everything and steal the event handler 
	 */
	
	Phone.prototype.show = function() {
		dom.adopt(this.dom_);
		this.isShown = true;
		tui.stealEvents(this.bound);
	};
	
	Phone.prototype.hide = function() {
		dom.dispose(this.dom_);
	};
	
	/**
	 * Exports
	 */
	
	var myPhone = new Phone(template);
	
	exports.exportSymbol('telephony', {
		name: 'setLineStatus',
		symbol: bind(myPhone.updateLine, myPhone)
	});
	return myPhone;
});
