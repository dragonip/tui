define(function(){
	return function(childCtor, parentCtor) {
		function tempCtor() {};
		tempCtor.prototype = parentCtor.prototype;
		childCtor.superClass_ = parentCtor.prototype;
		childCtor.prototype = new tempCtor();
		childCtor.prototype.constructor = childCtor;
	};
});
