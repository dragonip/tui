define(function() {
	var disposeAll = function(var_args) {
		for (var i = 0, len = arguments.length; i < len; ++i) {
			var disposable = arguments[i];
			if (typeof disposable.dispose === 'function') disposable.dispose();
		}
	};
	var Disposable = function(){};
	Disposable.prototype.disposed_ = false;
	Disposable.prototype.dependentDisposables_;
	Disposable.prototype.isDisposed = function() {
		return this.isDisposed;
	};
	Disposable.prototype.dispose = function() {
		if (!this.disposed_) {
			this.disposed_ = true;
			this.disposeInternal();
		}
	};
	Disposable.prototype.registerDisposable = function(disposable) {
		if (!this.dependentDisposables_) {
			this.dependentDisposables_ = [];
		}
		this.dependentDisposables_.push(disposable);
	};
	Disposable.prototype.disposeInternal = function() {
		if (this.dependentDisposables_) {
			disposeAll.apply(null, this.dependentDisposables_);
		}
	};
	//Return the object directly as it is just an interface, thus it can only be inherited
	return Disposable;
});

