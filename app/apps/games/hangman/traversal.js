//Original game source (with minor tweaks)

var n, m, IsOver = true, Moves, Letters, Word, StartTime, EndTime;
var Pic = new Array(8);
for (n = 0; n < 8; n++) {
	Pic[n] = new Image();
	Pic[n].src = "imgs/hangman" + n + ".gif";
}

function Init() {
	var ii, jj;
	IsOver = false;
	Moves = 0;
	Letters = "";
	for (ii = 65; ii < 91; ii++) {
		jj = String.fromCharCode(ii);
		document.Options[jj].value = jj;
	}
	do {
		do ii = Math.round(Math.random() * WordList.length);
		while (WordList.charAt(ii) == " ");
		while (WordList.charAt(ii) != " ") ii--;
		jj = ++ii;
		while (WordList.charAt(jj) != " ") jj++;
		Word = WordList.substring(ii, jj).toUpperCase();
	} while ((Word.length < 5) || (Word.length > 9));
	var ss = " ";
	for (ii = 0; ii < Word.length; ii++) ss += "_ ";
	document.Options.TWord.value = ss;
	document.images[0].src = Pic[Moves].src;
	Now = new Date();
	StartTime = Now.getTime() / 1000;
}

function Click(cc) {
	var ii, ss = " ";
	if (IsOver) return;
	if (Letters.indexOf(cc) >= 0) return;
	document.Options[cc].value = " ";
	Letters += cc;
	if (Word.indexOf(cc) >= 0) {
		for (ii = 0; ii < Word.length; ii++) {
			if (Letters.indexOf(Word.charAt(ii)) >= 0) ss += Word.charAt(ii) + " ";
			else ss += "_ ";
		}
		document.Options.TWord.value = ss;
		if (ss.indexOf("_") < 0) {
			IsOver = true;
			Now = new Date();
			EndTime = Now.getTime() / 1000;
			ii = Math.floor(EndTime - StartTime);
			ShowMessage('You have solved this game in ' + ii + 'seconds!<br> Press OK to play again.', Init());
		}
	}
	else {
		Moves++;
		document.images[0].src = Pic[Moves].src;
		if (Moves == 7) {
			IsOver = true;
			ShowMessage('You have lost, the word was<b> ' + Word + '</b>.<br> Press OK to play again.', Init);
		}
	}
}

/* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
/* Authors: Peter StJ
 * contacts: pjanakiev@sysmaster.com
 * for Sysmaster Corp Free software initiative
 */
 
//Add globals to access from original game and DMC sources

window.BLOCKED = false;
window.OKACTION = null;
function ShowMessage(message, actionOK) {
	var a = document.createElement('div');
	a.className = 'blocking_message';
	a.innerHTML = message;
	document.querySelector('.mainDiv').appendChild(a);
	BLOCKED = true;
	OKACTION = actionOK;
}


//DMC integration

(function() {
	var array = {
		/**
		 * @method has Checks if the array has the object in it
		 * @param {Array} The array to check
		 * @param {Any} The object to search for in the array
		 */
		has: function(arr, obj) {
			return (arr.indexOf(obj) > -1) ? true : false;
		},
		/**
		 * Remove an item from the array
		 * @method remove Removes item from array
		 * @param {Array} arr Array to operate on
		 * @param {Any} obj Object to remove from the array
		 **/
		remove: function(arr, obj) {
			var i = arr.indexOf(obj);
			var rv;
			if ((rv = i >= 0)) {
				arr.splice(i--, 1);
			}
		},
		/**
		 * removes items from array
		 * @method removeExisting Removes list of items from an array
		 * @param {Array} arr, The array that we will work on
		 * @param {Array} list, The list of items to remove from array
		 */
		removeExisting: function(arr, list) {
			for (var i = 0; i < arr.length; i++) {
				if (list.indexOf(arr[i]) !== -1) {
					arr.splice(i--, 1);
				}
			}
		},
		/**
		 * Adds missing items in array
		 * @method addMissing Adds missing items in array
		 * @param {Array} arr. Array to add items to
		 * @param {Array} list, List of items to add if not already present
		 */
		addMissing: function(arr, list) {
			for (var i = 0; i < list.length; i++) {
				if (arr.indexOf(list[i]) === -1) {
					arr.push(list[i]);
				}
			}
		},
		/**
		 * @method isEmpty Checks the length property of an array like object
		 * @param {Array|ArrayLikeObject} arr. The object to check
		 * @return {Boolean} True if the array has length 0
		 */
		isEmpty: function(arr) {
			if (arr.length && arr.length > 0) return false;
			return true;
		},
		/**
		 * @method last Gets the last element of an array
		 * @param {Array} the aaray to extract the last element from
		 */
		last: function(arr) {
			return arr[arr.length -1 ];
		}
	};
	var types = {
	toType: (function toType(win) {
	    /*return function(obj) {
	        if (obj === win) {
	            return "Global";
	        }
	        if ((function() {
	            return obj && (obj !== this);
	        }).call(obj)) {
	            return typeof obj;
	        }
	        var a = ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1];
	    };*/
	    return function(obj) {
	    	var a = typeof obj;
	    	if (a === 'object') {
	    		if ( obj instanceof Array) {
	    			return 'array';
	    		}
	    		else if (typeof a.tagName !== 'undefined' ) {
	    			return 'htmlelement';
	    		}
	    	}
	    	return a;
	    }
	})(window),
	/**
	 * @method getType Returns the type of the passed argument in lower case
	 * @param {Any} the item to get the type of
	 */
	getType: function(object) {
		return this.toType(object).toLowerCase();
	},
	/**
	 * @method assert Returns true if the type of the passed item matchies the required on, otherwise returns false
	 * @param {Any} The item to test
	 * @param {String} The type to match
	 */
	assert: function(object, type) {
		return this.getType(object) === type;
	}
}
	var classes = {
		getClasses: function(element) {
			var classes = element.className;
			return classes && typeof classes.split == 'function' ? classes.split(/\s+/) : [];
		},
		/**
		 * @method hasClass Returns true/flase depending on the element class 
		 * @param {HTMLElement} Element to query
		 */
		hasClass: function(element, classname) {
			return (this.getClasses(element).indexOf(classname) === -1) ? false : true;
		},
		/**
		 * @method addClasses Adds one or more classes to an element
		 * @param {HTMLElement} The element to add the classes to
		 * @param {Array|String} Supported are two type of parameters, array that contains the strings for class names to be added or arbitary length of arguments as strings
		 */
		addClasses: function(element, var_arg) {
			var args;
			if (!types.assert(var_arg, 'array')) {
				args = Array.prototype.slice.call(arguments, 1);
			} else {
				args = var_arg;
			}
			var classes = this.getClasses(element);
			array.addMissing(classes, args);
			element.className = classes.join(' ');
		},
		/**
		 * @method removeClasses Removes classes from element
		 * @param {HTMLElement} The element to alter
		 * @param {Array|String} Excpects array with strings or variable length of arguments as string
		 */
		removeClasses: function(element, var_args) {
			var args;
			if (!types.assert(var_args, 'array')) {
				args = Array.prototype.slice.call(arguments, 1);
			} else {
				args = var_arg;
			}
			var classes = this.getClasses(element);
			array.removeExisting(classes, args);
			element.className = classes.join(' ');
		}
	};
	//make the traversal of the table with buttons
	var myTable = document.querySelector('#letters');
	var ALL_ROWS = myTable.querySelectorAll('tr');
	var currentButton = myTable.querySelector('input'); // the first button is active one 
	classes.addClasses(currentButton, 'active');
//	currentButton.addClass('active');

	var MoveInTable = (function() {

		var EL;

		function getParent(times) {
			var i, el = EL;
			for (i = 0; i < times; i++) {
				el = el.parentElement;
			}
			return el;
		}

		function getRow() {
			return getParent(2);
		}

		function getRowNumber() {
			var allRows = myTable.querySelectorAll('tr');
			var curRow = getRow();
			var i;
			for (i = 0; i < allRows.length; i++) {
				if (curRow === allRows[i]) {
					return i;
				}
			}
		}

		function getNextRow(direction) {
			var a = getRowNumber(EL);
			if (a === 0 && direction === 'up') {
				return ALL_ROWS(ALL_ROWS.length - 1);
			}
			else if (a === ALL_ROWS.length - 1 && direction === 'down') {
				return ALL_ROWS[0];
			}
			else {
				if (direction === 'up') {
					return ALL_ROWS[a - 1];
				}
				else {
					return ALL_ROWS[a + 1];
				}
			}
		}

		function getCellNumber() {
			var mycell = getParent(1);
			var row = ALL_ROWS[getRowNumber(EL)],
				i;
			var cells = row.querySelectorAll('td');
			for (i = 0; i < cells.length; i++) {
				if (mycell === cells[i]) {
					return i;
				}
			}
		}

		function getNextCell(direction) {
			var cellNumber = getCellNumber(EL);
			var allCells = ALL_ROWS[getRowNumber(EL)].querySelectorAll('td');
			if (cellNumber === 0 && direction === 'left') {
				return allCells[allCells.length - 1];
			}
			else if (cellNumber === allCells.length - 1 && direction === 'right') {
				return allCells[0];
			}
			else {
				if (direction === 'right') {
					return allCells[cellNumber + 1];
				}
				else {
					return allCells[cellNumber - 1];
				}
			}
		}

		return function(direction) {
			var a, b, c;
//			pcli(direction);
			//First set the new Element that we will use to calculate next
			EL = myTable.querySelector('.active');
			//EL.removeClass('active');
			//Next, determine direction
			if (!direction) return;
			if (direction == 'up' || direction === 'down') {
				a = getNextRow(direction).querySelectorAll('td');
				if (getCellNumber() < a.length - 1) {
					b = a[getCellNumber()].querySelector('input');
				}
				else {
					b = a[a.length - 1].querySelector('input');
				}
			}
			else {
				b = getNextCell(direction).querySelector('input');
			}
			classes.removeClasses(EL, 'active');
			classes.addClasses(b, 'active');
//			EL.removeClass('active');
//			b.addClass('active');
			currentButton = b;
		};
	})();

//	var go_up = function() {
//			var myurl = 'http://' + window.location.host + window.location.pathname.replace('Hangman', 'Games');
//			
//			window.location.assign(myurl);
//		};
	function applyLetter() {
		if (BLOCKED) {
			BLOCKED = false;
			document.querySelector('.blocking_message').parentNode.removeChild(document.querySelector('.blocking_message'))
			OKACTION();
			return;
		}
		var a = currentButton.getAttribute('value');
		if ( a === 'NEW' ) {
			Init();
			return;
		}
		if (a != ' ') {
//			pcli(a);
			Click(a);
		}
	}

	var knownKeys = ['left', 'right', 'down', 'up'];
	window.remoteEvent = function(key) {
		if (key === 'ok') {
			applyLetter();
		} else if (knownKeys.indexOf(key)!==-1) {
			MoveInTable(key);
		}
	};
	window.onload = function() {
		Init();
	};
//	var App = {
//		appEvents: {},
//		Grab: [Dispatcher],
//		constructEvents: function() {
//			//instead of writing all events manually, use cycle when the handler is same
//			var keys = ['left', 'right', 'down', 'up'];
//			var i;
//			for (i = 0; i < keys.length; i++) {
//				this.appEvents[keys[i]] = {
//					name: keys[i],
//					func: MoveInTable,
//					attached: false
//				};
//			}
//			this.appEvents.okButton = {
//				name: 'ok',
//				func: applyLetter,
//				attached: false
//			};
//			this.appEvents.homeButton = {
//				name: 'home',
//				func: function() {
//					if (window.location.host.indexOf('sysmaster') != -1) {
//						alert('app://close_youtube');
//					}
//					else {
//						Utils.goHome();
//					}
//				},
//				attached: false
//			};
//			this.appEvents.ret = {
//				name: 'return',
//				func: function() {
//					//if (window.location.host.indexOf('sysmaster') != -1) {
//						go_up();
//					//}
//				},
//				attached: false
//			};
//		},
//		init: function() {
//			this.constructEvents();
//			Init();
//			this.addCustomHandlers(this.appEvents);
//		}
//	};
//	App.Start();
})();
