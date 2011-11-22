define([
	'oop/inherit',
	'utils/miniscreen'
], function(inherit, Mini){
	var TeleMini = function(options) {
		Mini.call(this,options);
		this.on('remote-key', this.remoteKeyHandler);
		this.setupPanels(options.panels)
	};
	inherit(TeleMini, Mini);
	TeleMini.prototype.remoteKeyHandler = function(key) {
		if (key === 'return') {
			this.master.activateScreen(0);
		} else {
			this.keyHandler(key);
		}
	};
	TeleMini.prototype.useTopPanel = false;
	TeleMini.prototype.useBottomPanel = true;
	TeleMini.prototype.setupPanels = function(opts) {
		this.panelSetup = {
			top: opts.top || this.useTopPanel,
			bottom: opts.bottom || this.useBottomPanel,
			topContent: opts.topContent,
			keys: opts.keys || []
		}
	};
	TeleMini.prototype.keyHandler = function(key) {
		console.log('Received key - please setup your own k h', key);
	};
	TeleMini.prototype.disposeInternal = function() {
		TeleMini.superClass_.disposeInternal.call(this);
		delete this.keyHandler;
	};
	return TeleMini;
});
