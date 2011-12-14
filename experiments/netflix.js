var netflix = function() {
	this.wheelCounter = 0;
	this.data = [];
	this.container = document.querySelector('#scrollcontainer');
	this.elements_ = document.querySelectorAll('.item');
	this.elementsLength_ = this.elements_.length;
	this.init();
	this.container.onmousewheel = function(e) {
		if (e.wheelDelta > 0 ) this.grid.moveUp();
		else 
//		this.wheelCounter++;
//		if (this.wheelCounter > 2) {
//			this.wheelCounter = 0;
			this.grid.moveDown();
//		}
	}.bind(this);

//	this.container.mousemove = function() { alert('mousemove')}
	document.ontouchmove = function(e) {
//		this.wheelCounter++;
//		if (this.wheelCounter > 2) {
//			this.wheelCounter = 0;
			this.grid.moveDown();
//		}
	}.bind(this);
//	alert('done')
};

netflix.prototype.init = function() {
	var i;
	for (i = 0 ; i <= 5000; i++) {
		this.data.push({
			id : '<div class="leftCont"><h1 class="number_id">' + i + '</h1><h2 class="item_name">Multiplexer</h2><div class="description">Genre:Others</div></div><div class="rightCont"><img src="../imgs/folder.png" class="img_thumb"></div><ul class="channel-settings-icons"><li class="icon recordable"></li></ul>'
		})
	}
	this.grid = new Grid(this.data);
	this.grid.initRasterize();
};

netflix.prototype.itemHeight = 100;

netflix.prototype.calcHowManyOnColumn = function() {
	var containerHeight = parseInt(this.container.style.height, 10);
	this.onCol_ = Math.floor(containerHeight/this.itemHeight)
};

netflix.prototype.loadBatch = function() {
	var howManyToLoad = this.onCol_;
	this.firstItem = 0;
	
}
netflix.prototype.moveDown = function() {
	
	this.grid.moveDown();
};
netflix.prototype.moveUp = function() {
	this.grid.moveUp();
};

var Grid = function(data) {
	this.elements_ = document.querySelectorAll('.item');
	this.data = data;
	this.maxVisibles_ = 4;
	this.activeIndex = 0;
	this.itemHeight = 100;
	this.beforeScreen = [];
	this.onScreen = [];
	this.afterScreen = [];
	this.fillOnScreen();
	this.fillAfterScreen();
//	this.bindEvents();
};

Grid.prototype.bindEvents = function() {
	
	var i;
	for (i = 0; i < this.elements_.length; i++) {
		//this.elements_[i].addEventListener('click', this.findSequence.bind(this), false);
		this.elements_[i].addEventListener('transitionend', function(e) {
			if (e.target.style.visibility === 'hidden') e.target.style.visibility = '';
		}, false);
	}
};

Grid.prototype.findSequence = function(event) {
	var target = event.target;
	while (target.className !== 'item') {
		target = target.parentNode;
	}
	var i = 0, seq;
	for (; i< this.onScreen.length; i++) {
		if (target === this.onScreen[i].element) {
			seq = this.onScreen[i].dataSequence;
			break;
		}
	}

}
Grid.prototype.moveDown = function() {
	if (this.onScreen[this.activeIndex].dataSequence+1 >= this.data.length) return;
	//Remove active indicator
	this.onScreen[this.activeIndex].element.className = 'item';
	//If index is === of max visibles - time to get the next element
	if (this.activeIndex >= this.maxVisibles_) {
		this.getNext();
	} else {
		this.activeIndex++;
	}
	this.setActiveElement();

};

Grid.prototype.moveUp = function() {

	if (this.onScreen[this.activeIndex].dataSequence === 0) return;

	this.onScreen[this.activeIndex].element.className = 'item';
	if (this.activeIndex === 0 ) {
		this.getPrevious();
	} else {
		this.activeIndex--;
	}
	this.setActiveElement();
};
Grid.prototype.getPrevious = function() {
	var a = this.onScreen.pop();
	this.afterScreen.unshift(a);
	if (this.afterScreen.length > 1) {
		this.relocate_(Grid.relocationType_.up);
	}
	this.onScreen.unshift(this.beforeScreen.pop());
	this.initRasterize();
};

Grid.prototype.getNext = function() {
	//get 1 from onScreen and put it up. on before Screen
	var a = this.onScreen.shift();
	this.beforeScreen.push(a);
	// If we have more than 1 item in before screen put one on the after screen, we should always have 1 on top and one on bottom
	if (this.beforeScreen.length > 1) {
		this.relocate_(Grid.relocationType_.down);
	}
//	move up one from bottom to onScreen
	this.onScreen.push(this.afterScreen.shift());

	this.initRasterize();
};

Grid.relocationType_ = {
	down: 0,
	up: 1,
	full: 2
};

Grid.prototype.relocate_ = function(type) {

	switch (type) {
		case Grid.relocationType_.down:
			var a = this.beforeScreen.shift();
			var b = this.afterScreen[this.afterScreen.length-1].dataSequence + 1;
			if (this.data.length > b) {
				a.dataSequence = b;
				a.element.innerHTML = this.data[b].id;
				a.element.style.webkitTransition = 'none';
				console.log(a.element)
				this.afterScreen.push(a);
			} else {
				this.beforeScreen.unshift(a);
			}
			break;
		case Grid.relocationType_.up:
			
			var a = this.afterScreen.pop();
			var b = this.beforeScreen[0].dataSequence - 1;
			if (b >=0 ) {
				a.dataSequence = b;
				a.element.innerHTML = this.data[b].id;
				a.element.style.webkitTransition = 'none';
				this.beforeScreen.unshift(a);
			} else {
				this.afterScreen.push(a);
			}
			break;
	}
//	//If we hit here it means we should get one from the top and but it on the bottom
//	var a = this.beforeScreen.shift();
//	var b = this.afterScreen[this.afterScreen.length-1].dataSequence + 1;
//	if (this.data.length > b) {
//		a.dataSequence = b;
//		a.element.innerHTML = this.data[b].id;
//		this.afterScreen.push(a);
//	} else {
//		this.beforeScreen.unshift(a);
//	}
};

Grid.prototype.fillOnScreen = function() {
	for (var i = 0; i <= this.maxVisibles_; i++) {
		this.elements_[i].innerHTML = this.data[i].id;
		this.onScreen.push({
			dataSequence: i,
			element: this.elements_[i]
		});
	}

};

Grid.prototype.fillAfterScreen = function() {
	for (var i = this.maxVisibles_+1; i < this.elements_.length; i ++ ) {
		this.elements_[i].innerHTML = this.data[i].id
		this.afterScreen.push({
			dataSequence: i,
			element: this.elements_[i]
		});
	}

};

Grid.prototype.initRasterize = function() {
	for (var i = 0; i < this.beforeScreen.length; i++) {
		this.setTranform(this.beforeScreen[i].element, '-' + this.itemHeight);
	}
	for (i = 0; i< this.onScreen.length; i++) {
		this.setTranform(this.onScreen[i].element, this.itemHeight * i);
	}
	for ( i = 0 ; i < this.afterScreen.length; i++ ) {
		this.setTranform(this.afterScreen[i].element, (this.itemHeight * (this.maxVisibles_ + 1)));
	}
	this.setActiveElement();
};

Grid.prototype.setActiveElement = function() {
	this.onScreen[this.activeIndex].element.className = 'item active';
};

Grid.prototype.setTranform = function(el, pos) {

	el.style.webkitTransform =  'translate(0,' + pos + 'px)';
	el.style.MozTransform = 'translateY(' + pos + 'px)';

	if (el.style.webkitTransition == "none")
		setTimeout( function() {
			el.style.webkitTransition = "";
		}, 150);
};



var a = new netflix();
window.addEventListener('keydown', function(e) {
	if (e.keyCode === 40) a.moveDown();
	if (e.keyCode === 38) a.moveUp();
}, false);

ScreenManager = {};
ScreenManager.remoteKey = function(key) {
	switch (key) {
	case 'down':
		a.moveDown();
		break;
	case 'up':
		a.moveUp();
		break;
	}
}
ScreenManager.remoteCommand = function() {};
