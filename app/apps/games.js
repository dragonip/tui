define([
	'utils/framedapp',
	'data/static-strings',
	'model/listmodel'
], function(App, strings, LM){
	var a = new App({
		name: 'games',
		shouldJump: false,
		itemWidth: 220,
		itemHeight: 190,
		datamodel: LM
	});
	a.hints = {
		general: {
			ok: strings.games.panels.bottom.ok,
			'return': strings.games.panels.bottom['return']
		},
		Sudoku: {
			ok: strings.games.hints.Sudoku.ok,
			arrows: strings.games.hints.Sudoku.arrows
		},
		SizzleBox: {
			arrows: strings.games.hints.SizzleBox.arrows
		},
		Hangman: {
			arrows: strings.games.hints.Hangman.arrows,
			ok: strings.games.hints.Hangman.ok
		}
	};
	return a;
});
