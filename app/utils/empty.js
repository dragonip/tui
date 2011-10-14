define(['debug/console']function(logger){
	var pcli = logger.getInstance('$empty')
	return function(a) {
		pcli.log('Empty function called to block ' + a);
	};
})
