define([
	'oop/inherit',
	'utils/listingapp',
	'dom/dom',
	'utils/sizes'
], function(inherit, ListApp, dom, sizes){
	var GamesApp = function(options) {
		ListApp.call(this, options);
		this.gamelayer = dom.create('div', {
			classes: 'tui-component game-layer',
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		});
	};
	inherit(GamesApp, ListApp);
	GamesApp.prototype.onPlayRequest = function() {
		var game = this.model.getItem();
		console.log(game);
		this.startGame(game);
		
	};
	GamesApp.prototype.startGame = function(gameObj) {
		//create overlay
		//get events
		//attach events
		//send Start to game
		//send events to frame of game
		console.log(window.location)
		dom.empty(this.gamelayer);
		dom.adopt(this.gamelayer, dom.create('iframe', {
			src: window.location.href + 'app/' + gameObj.path,
			style: sizes.getStyle(sizes.getSizesForGameLayer())
		}));
		dom.adopt(this.gamelayer);
		
	};
	GamesApp.prototype.disposeInternal = function() {
		GamesApp.superClass_.disposeInternal.call(this);
		dom.dispose(this.gamelayer);
		delete this.gamelayer;
	}
	return GamesApp;
});
