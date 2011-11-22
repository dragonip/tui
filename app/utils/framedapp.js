define([
	'oop/inherit',
	'utils/listingapp',
	'dom/dom',
	'utils/sizes',
	'shims/bind'
], function(inherit, ListApp, dom, sizes, bind){
	var GamesApp = function(options) {
		ListApp.call(this, options);
		this.gamelayer = dom.create('div', {
			classes: 'tui-component game-layer',
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		});
		this.activeFrame = null;
		this.appEvents['return'] = {
			name: 'return',
			func: bind(this.defaultRemoteKeyHandler, this),
			attached: false
		};
	};
	inherit(GamesApp, ListApp);
	GamesApp.prototype.onPlayRequest = function() {
		var game = this.model.getItem();
		console.log(game);
		this.startGame(game);
		
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
			}
		}
	};
	GamesApp.prototype.startGame = function(gameObj) {
		console.log(window.location)
		dom.empty(this.gamelayer);
		this.activeFrame =  dom.create('iframe', {
			src: window.location.href + 'app/' + gameObj.path,
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		});
		dom.adopt(this.gamelayer, this.activeFrame);
		dom.adopt(this.gamelayer);
	};
	GamesApp.prototype.endGame = function() {
		console.log('Hide the game now!')
		dom.dispose(this.gamelayer);
		this.gamelayer.innerHTML = '';
		this.activeFrame = null;
	};
	
	GamesApp.prototype.disposeInternal = function() {
		GamesApp.superClass_.disposeInternal.call(this);
		dom.dispose(this.gamelayer);
		delete this.gamelayer;
	}
	return GamesApp;
});