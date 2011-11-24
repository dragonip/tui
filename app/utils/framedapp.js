define([
	'oop/inherit',
	'utils/listingapp',
	'dom/dom',
	'utils/sizes',
	'shims/bind',
	'tpl/infobuttons',
	'utils/events'
], function(inherit, ListApp, dom, sizes, bind, infobuttonstpl, DMCEvents){
	var GamesApp = function(options) {
		ListApp.call(this, options);
		this.gamelayer = dom.create('div', {
			classes: 'tui-component game-layer',
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		});
		this.activeFrame = null;
		this.generateDefaultEvents(['one','two','three','four','five','six','seven','eight','nine', 'left', 'right', 'down', 'up', 'return', 'play'], bind(this.defaultRemoteKeyHandler, this));

		this.on('show-complete', this.showInfoPanel);
	};
	inherit(GamesApp, ListApp);
	GamesApp.prototype.onPlayRequest = function() {
		var game = this.model.getItem();
		console.log(game);
		this.startGame(game);
		
	};
	GamesApp.prototype.showInfoPanel = function() {
		tui.setPanels(false, true, undefined, infobuttonstpl.render({
			things: this.hints.general
		}));
	};
	GamesApp.prototype.defaultRemoteKeyHandler = function(key) {
		if (this.activeFrame === null) {
			GamesApp.superClass_.defaultRemoteKeyHandler.call(this, key);
		} else {
			switch (key) {
				case 'return':
					console.log('Hide the game')
					this.endGame();
					break;
				default:
					console.log('Transmit to game');
					this.activeFrame.contentWindow.remoteEvent(key);
			}
		}
	};
	GamesApp.reinit = function() {
		DMCEvents.initEvents();
	};
	GamesApp.prototype.startGame = function(gameObj) {
		console.log(window.location)
		dom.empty(this.gamelayer);
		this.activeFrame =  dom.create('iframe', {
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		});
		this.activeFrame.onload = GamesApp.reinit;
		this.activeFrame.setAttribute('src', window.location.href + 'app/' + gameObj.path)
		dom.adopt(this.gamelayer, this.activeFrame);
		dom.adopt(this.gamelayer);
		if (this.hints[gameObj.publishName]) {
			tui.setPanels(false, true, undefined, infobuttonstpl.render({
				things: this.hints[gameObj.publishName]
			}));
		} else {
			tui.setPanels(false, false);
		}
	};
	GamesApp.prototype.endGame = function() {
		tui.setPanels(false, false);
		dom.dispose(this.gamelayer);
		this.gamelayer.innerHTML = '';
		this.activeFrame.onload = null;
		this.activeFrame = null;
	};
	
	GamesApp.prototype.disposeInternal = function() {
		GamesApp.superClass_.disposeInternal.call(this);
		dom.dispose(this.gamelayer);
		delete this.gamelayer;
	}
	return GamesApp;
});
