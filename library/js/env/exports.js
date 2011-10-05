define(function() {
	return {
		exportSymbol: function(module, exp) {
			if ( typeof window.exportedSymbols == 'undefined') {
				window.exportedSymbols = {};
			}
			if ( typeof window.exportedSymbols[module] == 'undefined') {
				window.exportedSymbols[module] = {};
			}
			window.exportedSymbols[module][exp.name] = exp.symbol;
		}
	};
});
