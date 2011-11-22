(function() {

	var blank_pos = 16,
		count = 0,
		pos = [],
		nam = [];
	pos[1] = 7;
	pos[2] = 10;
	pos[3] = 14;
	pos[4] = 9;
	pos[5] = 12;
	pos[6] = 2;
	pos[7] = 13;
	pos[8] = 1;
	pos[9] = 8;
	pos[10] = 5;
	pos[11] = 4;
	pos[12] = 6;
	pos[13] = 3;
	pos[14] = 11;
	pos[15] = 15;

	function start() {
		nam[1] = L1.style;
		nam[2] = L2.style;
		nam[3] = L3.style;
		nam[4] = L4.style;
		nam[5] = L5.style;
		nam[6] = L6.style;
		nam[7] = L7.style;
		nam[8] = L8.style;
		nam[9] = L9.style;
		nam[10] = L10.style;
		nam[11] = L11.style;
		nam[12] = L12.style;
		nam[13] = L13.style;
		nam[14] = L14.style;
		nam[15] = L15.style;
		//document.onkeydown = keyDown;
	}

	function keyDown(ll) {
		var ieKey = ll.keyCode;
		if (ieKey == 38) {
			if (blank_pos < 13) {
				count = blank_pos + 4;
				X = fun(count);
				Z = (parseInt(nam[X].top));
				nam[X].top = Z - 52;
				Q = pos[X];
				pos[X] = blank_pos;
				blank_pos = Q;
			}
		}
		else if (ieKey == 40) {
			if (blank_pos > 4) {
				count = blank_pos - 4;
				X = fun(count);
				Z = (parseInt(nam[X].top));
				nam[X].top = Z + 52;
				Q = pos[X];
				pos[X] = blank_pos;
				blank_pos = Q;
			}
		}
		else if (ieKey == 37) {
			r = blank_pos % 4
			if (r == 0) {}
			else {
				count = blank_pos + 1;
				X = fun(count);
				Z = (parseInt(nam[X].left));
				nam[X].left = Z - 52;
				Q = pos[X];
				pos[X] = blank_pos;
				blank_pos = Q;
			}
		}
		else if (ieKey == 39) {
			ch = blank_pos + 3;
			r = ch % 4;
			if (r == 0) {}
			else {
				count = blank_pos - 1;
				X = fun(count);
				Z = (parseInt(nam[X].left));
				nam[X].left = Z + 52;
				Q = pos[X];
				pos[X] = blank_pos;
				blank_pos = Q;
			}
		}
		
		A = false;
		b = 0;
		for (i = 1; i < 16; i++) {
			b++;
			if (pos[i] == b) {
				A = true;
			}
			else {
				A = false;
				break;
			}
		}
		if (A) {
			ShowMessage();
		}
	}

	function fun(count) {
		var X;
		for (var i = 1; i < 16; i++) {
			if (pos[i] == count) {
				X = i;
			}
		}
		return X;
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

//DMC integration
	var WrapKeys = (function(){
		var directions = {
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		return function(dir) {
			keyDown({
				keyCode: directions[dir]
			});
		};
	})();
	
	function ShowMessage() {
		var a = document.createElement('div');
		a.className = 'blocking_message';
		a.innerHTML = 'Congratulations, you solved it!<br>Press Return to go back to the list of games';
		
		document.querySelector('div').appendChild(a);
	}
	
//	function go_up() {
//		var myurl = 'http://' + window.location.host + window.location.pathname.replace('SizzleBox', 'Games');
//		window.location.assign(myurl);
//	}
	var knownKeys = ['left', 'up', 'right', 'down'];
	window.remoteEvent = function(key) {
		console.log('Remote event received in frame');
		if (knownKeys.indexOf(key)!== -1) {
			WrapKeys(key);
		}
	};
	window.onload = function() {
		start();
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
//					func: WrapKeys,
//					attached: false
//				};
//			}
//			/*this.appEvents.okButton = {
//				name: 'ok',
//				func: ShowMessage,
//				attached: false
//			};*/
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
//				func: go_up,
//				attached: false
//			};
//		},
//		init: function() {
//			this.constructEvents();
//			start();
//			this.addCustomHandlers(this.appEvents);
//		}
//	};
//	App.Start();
})();
