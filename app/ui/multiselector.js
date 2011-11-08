define([
	'oop/inherit',
	'oop/idisposable',
	'tpl/multiselect',
	'text!css/multiselect.css',
	'loader/loader',
	'dom/dom',
	'shims/bind',
	'dom/attributes',
	'dom/classes'
], function(inherit, Disposable, template, css, loader, dom, bind, domattr, classes){
	//Load some CSS code
	loader.loadCSSFromText(css);
	/**
	* @constructor
	* @param {Array} options, List ot options to visualize
	* @param {Function} callback, Callback function to execute with the selected index
	* @param {?Number} selectedIndex, Default index to select, optional
	* @patam {Function} destroySignal Function to call after the selection callback is executed and before disposing the object
	* @patam {Object} context Context for this when calling the destroySignal
	*/
	var MultipleSelection = function( options, callback, selectedIndex, destroySignal, context) {
		Disposable.call(this);
		this.resolver = callback;
		this.options = options;
		this.dom_ = '';
		this.selectedIndex = selectedIndex || 0;
		this.interpretator = bind(this.acceptEvents, this);
		this.signalEnd = function(signalType) {
			console.log('In signal end');
			destroySignal.call(context, signalType);};
	};
	inherit(MultipleSelection, Disposable);
	
	//Define selectors so we can reuse the selection logic with other classes
	MultipleSelection.prototype.itemSelector = '.multi-select-item';
	MultipleSelection.prototype.activeItemSelector = '.multi-select-item.active';
	MultipleSelection.prototype.activeClass = 'active';
	
	MultipleSelection.prototype.disposeInternal = function() {
		this.constructor.superClass_.disposeInternal.call(this);
		dom.dispose(this.dom_);
		delete this.resolver;
		delete this.options;
		delete this.container;
		delete this.dom_;
		delete this.interpretator;
		delete this.selectedIndex;
		delete this.signalEnd;
		delete this.itemSelector;
		delete this.activeItemSelector;
		delete this.activeClass;
	};
	
	/**
	* Item selection works by cylcling over the .options property (Array or ArrayLike) and sets the selectedIndex
	* after that activateItem is called automatically
	* @param {Boolean} if true, move downwards (inclrease index), else decrease the index
	*/
	MultipleSelection.prototype.selectItem = function(bool) {
		var next;
		if (bool) {
			next = this.selectedIndex + 1;
			if (next < this.options.length) {
				this.selectedIndex = next;
			}
		} else {
			next = this.selectedIndex - 1;
			if (next >= 0 ) {
				this.selectedIndex = next;
			}
		}
		this.activateItem();
	};
	/**
	* Reusable logic for selected current item from a list, to re-use it set the itemSelector activeItemSelector and 
	* activeClass properties on the object, this.dom_ is also required here
	*/
	MultipleSelection.prototype.activateItem = function() {
		var current = dom.$(this.activeItemSelector, this.dom_);
		if (current !== null) classes.removeClasses(current, this.activeClass);
		classes.addClasses( dom.$$(this.itemSelector, this.dom_)[this.selectedIndex], this.activeClass );
	};
	
	MultipleSelection.prototype.Show = function(container) {
		this.container = container || document.body;
		this.dom_ = dom.create('div', {
			classes: 'multi-select-wrapper',
			style: domattr.get(this.container, 'style').cssText
		});
		this.dom_.innerHTML = template.render({things: this.options, title: 'Select an option'});
		this.dom_.style.top = '-' +window.innerHeight + 'px';
		this.activateItem();
		dom.adopt(this.container, this.dom_);
	};
	
	/**
	* Default acceptor for remote keys events when the selector has grabbed the UI attention, note that ALL keys will be redirected to this listener when the dialog has focus so always include a cancel button
	* @param {String} key The key identifier to process,
	*/
	MultipleSelection.prototype.acceptEvents = function(key) {
		console.log('Now the events should be received here', key)
		switch (key) {
			case 'up':
				this.selectItem(false);
				break;
			case 'down':
				this.selectItem(true);
				break;
			case 'ok':
				this.execute(this.selectedIndex);
				break;
			case 'return':
				dom.dispose(this.dom_);
				this.signalEnd('restore-events');
				this.dispose();
		}
	};
	MultipleSelection.prototype.execute = function(index) {
		index = index || this.selectedIndex;
		dom.dispose(this.dom_);
		this.signalEnd('restore-events');
		this.resolver(index);
		this.dispose();
	};
	return MultipleSelection;
});
