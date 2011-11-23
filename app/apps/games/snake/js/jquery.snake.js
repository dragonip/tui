/*
 *
 * jquery.snake.js
 * (c) Richard Willis
 *
 */

var Snake = {

	$map: {},
	$cherry: {},
	$overlay: {},
	seg: {},
	wallseg: {},
	cache: {},
	animateTimer: 0,
	score: 0,
	grid: 0,
	level: 1,
	lives: 3,
	speed: 0,
	defaultSpeed: 250,
	cherriesEaten: 0,
	wall: 0,
	// are the outer map walls an obsticle?
	setup: function() {

		// build map
		Snake.$map = $("#map1");
		Snake.$map.width = Snake.$map.innerWidth();
		Snake.$map.height = Snake.$map.innerHeight();

		// build and prepend overlay to map
		Snake.$overlay = $('<div id="overlay"></div>').hide();
		Snake.$map.prepend(Snake.$overlay);

		// build and append cherry to map
		Snake.$cherry = $('<div id="cherry"></div>').appendTo(Snake.$map);

		// listen for key press, store keycode
		Snake.cache.keyCode = [0, 0];
		/*document.onkeydown = function(e) {
			keycode = (e == null) ? event.keyCode : e.which;
			switch (keycode) {
			case 71:
				Snake.toggleGrid();
				break;
			case 80:
				Snake.pause();
				break;
			case 78:
				Snake.newGame(true);
				break;
			case 37:
			case 38:
			case 39:
			case 40:
				// preventing default event behaviour causes issues with IE; 
				// need to research further!
				!$.browser.msie && e.preventDefault();
				Snake.cache.keyCode[0] = Snake.cache.keyCode[1];
				Snake.cache.keyCode[1] = keycode;
				break;
			default:
				break;
			}
		};*/
	},
	DMCIntegration: (function() {
		var numCodes = {
			'down': 40,
			'up': 38,
			'left':37,
			'right':39
		};
		return function(code) {	
			switch (code) {
			case 'play':
				Snake.pause();
				break;
			case 'left': case 'right': case 'up': case 'down':
				Snake.cache.keyCode[0] = Snake.cache.keyCode[1];
				Snake.cache.keyCode[1] = numCodes[code];
				break;
			default: break;
			}
		};

	})(),

	start: function() {
		Snake.$cherry.fadeIn(function() {
			Snake.animateTimer = setInterval(Snake.animate, Snake.speed);
		});
	},

	newGame: function(reset) {

		Snake.cherriesEaten = 0;

		// reset animation timer
		clearInterval(Snake.animateTimer);
		Snake.animateTimer = 0;

		// reset score
		Snake.score = reset ? 0 : Snake.score;

		// reset level
		Snake.level = reset ? 1 : Snake.level;
		$("#stats-level").html(Snake.level);

		// reset lives
		Snake.lives = reset ? 3 : Snake.lives;
		$("#stats-lives").html(Snake.lives);

		// reset level cherries eaten and total
		$("#stats-eaten").html(Snake.cherriesEaten + "");
		$("#stats-totcherries").html(Level[Snake.level][0].cherries);

		// remove any wall & snake segments
		$(".wall, .snake").remove();

		// hide the cherry
		Snake.$cherry.hide();

		// update map message	
		$("#map-msg").hide().html("Level " + Snake.level + "<small><br/>Eat <strong>" + Level[Snake.level][0].cherries + "</strong> cherries</small>").fadeIn();

		setTimeout(function() {

			// hide map message
			$("#map-msg").fadeOut(500, function() {

				// hide overlay
				Snake.$overlay.hide();

				// reset and generate wall
				Snake.wallseg = {};
				Snake.Wall.generate();

				// hide then reposition cherry
				Snake.Cherry.generate(false);

				// reset, remove and re-append snake segments to map
				Snake.seg = {
					length: Level[Snake.level][0].length
				};
				for (var i = 0; i < Snake.seg.length; i++) {
					Snake.seg[i] = $('<span class="snake ' + i + '"></span>').appendTo(Snake.$map);
					Snake.seg[i].top = Snake.seg[i].left = 0;
				}
				$(".snake").show();

				// start animation
				setTimeout(function() {
					// reset direction and speed
					Snake.cache.keyCode[0] = 0;
					Snake.cache.keyCode[1] = 39;
					Snake.speed = Snake.defaultSpeed;
					Snake.start();
				}, 1000);
			});
		}, 1800);
	},

	animate: function() {
		// adjust segment position list	 					
		for (var i = 1; i < Snake.seg.length; i++) {
			Snake.seg[i].top = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].top;
			Snake.seg[i].left = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].left;
		}

		var keycode = Snake.cache.keyCode;
		if (
		keycode[0] == 37 && keycode[1] == 39 || keycode[0] == 39 && keycode[1] == 37 || keycode[0] == 38 && keycode[1] == 40 || keycode[0] == 40 && keycode[1] == 38) {
			Snake.cache.keyCode[1] = Snake.cache.keyCode[0];
		}

		keycode = Snake.cache.keyCode[1];
		// adjust leading segment properties
		if (keycode == 39) {
			//right
			Snake.seg[0].left += 10;
			if (Snake.seg[0].left > Snake.$map.width - 10) {
				Snake.wall && Snake.gameOver();
				Snake.seg[0].left = 0;
			}
		} else if (keycode == 40) {
			//down
			Snake.seg[0].top += 10;
			if (Snake.seg[0].top > Snake.$map.height - 10) {
				Snake.wall && Snake.gameOver();
				Snake.seg[0].top = 0;
			}
		} else if (keycode == 38) {
			//up
			Snake.seg[0].top -= 10;
			if (Snake.seg[0].top < 0) {
				Snake.wall && Snake.gameOver();
				Snake.seg[0].top = Snake.$map.height - 10;
			}
		} else if (keycode == 37) {
			//left
			Snake.seg[0].left -= 10;
			if (Snake.seg[0].left < 0) {
				Snake.wall && Snake.gameOver();
				Snake.seg[0].left = Snake.$map.width - 10;
			}
		}
		// check if snake has eaten a cherry
		(Snake.seg[0].left == Snake.Cherry.left && Snake.seg[0].top == Snake.Cherry.top) && Snake.advance();

		// unset Snake.seg[0], gotta be an easier way!
		var seg = {};
		for (var i = 1; i < Snake.seg.length; i++) {
			seg[i - 1] = Snake.seg[i];
		}

		// check if snake has slithered into itself
		(Snake.in_obj(Snake.seg[0], seg)) && Snake.gameOver();

		// check if snake has slithered into a wall obstacle
		(Snake.in_obj(Snake.seg[0], Snake.wallseg)) && Snake.gameOver();

		// check if cherries eaten match total: finished level.. advance to next level
		// TODO: Should not be using Snake.score : need a variable to hold cherries eaten!!!!!!!!!
		(Snake.cherriesEaten == Level[Snake.level][0].cherries) && Snake.advanceLevel();

		// reposition snake segments on map
		for (var i = 0; i < Snake.seg.length; i++) {
			Snake.seg[i].css({
				top: Snake.seg[i].top + "px",
				left: Snake.seg[i].left + "px",
				display: "block"
			});
		}
	},

	advance: function(val) {

		// increase snake segments
		Snake.seg.length++;

		var x = Snake.seg.length - 1;
		Snake.seg[x] = $('<span class="snake ' + x + '"></span>').css({
			left: Snake.seg[1].left + "px",
			top: Snake.seg[1].top + "px",
			display: "block"
		}).appendTo(Snake.$map);

		// position new snake segment
		Snake.seg[x].top = Snake.seg[x - 1].top;
		Snake.seg[x].left = Snake.seg[x - 1].left;

		// reposition cherry
		Snake.Cherry.generate();

		// adjust score
		Snake.score += 10;
		$("#stats-score").html(Snake.score);

		// update cherries eaten
		Snake.cherriesEaten++;
		$("#stats-eaten").html(Snake.cherriesEaten);

		// adjust speed
		Snake.speed -= 1;
		$("#stats-speed").html(Snake.speed);
		clearInterval(Snake.animateTimer);
		pcli(Snake.speed);
		Snake.animateTimer = setInterval(Snake.animate, Snake.speed);
		return false;
	},

	advanceLevel: function() {
		if (Snake.level == Level.length - 1) {
			Snake.finishedGame();
		} else {
			Snake.level++;
			Snake.newGame();
		}
	},

	toggleGrid: function() {
		var background;
		if (!Snake.grid) {
			background = "url(/img/snake/grid_bg.gif)";
			Snake.grid = 1;
		} else {
			background = "none";
			Snake.grid = 0;
		}
		Snake.$map.css({
			background: background
		});
	},

	pause: function() {
		if (Snake.animateTimer == 0) {
			Snake.start();
			Snake.$overlay.hide();
			$("#map-msg").fadeOut();
		} else {
			clearInterval(Snake.animateTimer);
			Snake.animateTimer = 0;
			Snake.$overlay.show();
			$("#map-msg").html("Paused").fadeIn();
		}
	},

	gameOver: function() {
		if (Snake.lives - 1) {
			Snake.lives--;
			Snake.newGame();
		} else {
			Snake.pause();
			window.gameIsOver = true;
			$("#map-msg").html('You Died<small><br/><a href="javascript:;" onclick="Snake.newGame(true)">Play again?</a></small>');
		}
	},

	finishedGame: function() {
		Snake.pause();
		$("#map-msg").html('Well Done! You finished.<small><br/><a href="javascript:;" onclick="Snake.newGame(true)">Play again?</a></small>');
	},

	Cherry: {
		left: 0,
		top: 0,
		generate: function(show) {
			do {
				Snake.Cherry.left = Math.round((Math.random() * (Snake.$map.width - 10)) / 10) * 10;
				Snake.Cherry.top = Math.round((Math.random() * (Snake.$map.height - 10)) / 10) * 10;
			} while (Snake.in_obj(Snake.Cherry, Snake.wallseg) || Snake.in_obj(Snake.Cherry, Snake.seg));

			Snake.$cherry.css({
				left: Snake.Cherry.left + "px",
				top: Snake.Cherry.top + "px"
			});
			show == undefined && Snake.$cherry.fadeIn();
		}

	},

	// wall obstacles
	Wall: {
		generate: function() {

			var
			walls = Level[Snake.level],
				c = 0,
				t, l, i, n;

			// append multiple walls
			for (i = 1; i < walls.length; i++) {
				t = walls[i].top;
				l = walls[i].left;
				// append wall segments to map
				for (n = 0; n < walls[i].seg; n++) {
					Snake.wallseg[c] = $('<span class="wall ' + c + '"></span>').css({
						top: t + "px",
						left: l + "px"
					}).appendTo(Snake.$map);
					Snake.wallseg[c].left = l;
					Snake.wallseg[c].top = t;
					c++;
					t += 10;
				}
			}
		}

	},

	// check for an object in an object collection
	in_obj: function(obj_needle, obj_haystack) {
		for (var i in obj_haystack) {
			if (obj_haystack[i].left === obj_needle.left && obj_haystack[i].top === obj_needle.top) {
				return true;
			}
		}
		return false;
	}

},

	Level = [
		,
		[
		{
		cherries: 5,
		length: 10
	},
		{
		seg: 30,
		top: 50,
		left: 200
	}
	],
		[
		{
		cherries: 5,
		length: 15
	},
		{
		seg: 30,
		top: 50,
		left: 100
	},
		{
		seg: 30,
		top: 50,
		left: 300
	}
	],
		[

		{
		cherries: 5,
		length: 20
	},
		{
		seg: 12,
		top: 10,
		left: 50
	},
		{
		seg: 12,
		top: 0,
		left: 350
	},
		{
		seg: 12,
		top: 270,
		left: 350
	},
		{
		seg: 12,
		top: 280,
		left: 50
	},
		{
		seg: 24,
		top: 80,
		left: 200
	}
	],
		[
		{
		cherries: 5,
		length: 25
	},
		{
		seg: 19,
		top: 0,
		left: 200
	},
		{
		seg: 20,
		top: 200,
		left: 200
	},
		{
		seg: 40,
		top: 0,
		left: 0
	},
		{
		seg: 40,
		top: 0,
		left: 390
	}
	],
		[
		{
		cherries: 5,
		length: 30
	},
		{
		seg: 20,
		top: 10,
		left: 50
	},
		{
		seg: 20,
		top: 0,
		left: 150
	},
		{
		seg: 20,
		top: 10,
		left: 250
	},
		{
		seg: 20,
		top: 0,
		left: 350
	},
		{
		seg: 20,
		top: 200,
		left: 20
	},
		{
		seg: 20,
		top: 200,
		left: 120
	},
		{
		seg: 20,
		top: 200,
		left: 220
	},
		{
		seg: 20,
		top: 200,
		left: 320
	}
	],
		[
		{
		cherries: 5,
		length: 35
	},
		{
		seg: 2,
		top: 10,
		left: 200
	},
		{
		seg: 2,
		top: 40,
		left: 200
	},
		{
		seg: 2,
		top: 70,
		left: 200
	},
		{
		seg: 2,
		top: 100,
		left: 200
	},
		{
		seg: 2,
		top: 130,
		left: 200
	},
		{
		seg: 2,
		top: 160,
		left: 200
	},
		{
		seg: 2,
		top: 190,
		left: 200
	},
		{
		seg: 2,
		top: 220,
		left: 200
	},
		{
		seg: 2,
		top: 250,
		left: 200
	},
		{
		seg: 2,
		top: 280,
		left: 200
	},
		{
		seg: 2,
		top: 310,
		left: 200
	},
		{
		seg: 2,
		top: 340,
		left: 200
	},
		{
		seg: 2,
		top: 370,
		left: 200
	},
		{
		seg: 20,
		top: 100,
		left: 280
	},
		{
		seg: 20,
		top: 100,
		left: 120
	},
		{
		seg: 30,
		top: 50,
		left: 60
	},
		{
		seg: 30,
		top: 50,
		left: 340
	},
		{
		seg: 40,
		top: 0,
		left: 0
	},
		{
		seg: 40,
		top: 0,
		left: 390
	}
	]
		];
