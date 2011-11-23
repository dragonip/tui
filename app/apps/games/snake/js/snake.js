/* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* 
 * DMC adapted jQuery snake game 
 * author: Peter StJ.
 * Used code is from (c) Richard Willis 
 * please see http://code.google.com/p/jquery-snakey/
 * 
 */


// We use jQuery so do not augment the Object
// Make some changes to the App so it would not require Grab, DMC and Start
window.remoteEvent = (function () {
	var knownKeys = ['up', 'down', 'left', 'right', 'play'];
	return function(key) {
		if (knownKeys.indexOf(key)!==-1) {
			switch (key) {
				case 'play':
					if (window.gameIsOver) {
						window.gameIsOver = false
						Snake.newGame(true);
					} else {
						Snake.DMCIntegration(key);
					}

					break;
				default: 
					Snake.DMCIntegration(key);
			}
		}
	};
})();
window.onload = function() {
	Snake.setup();
	Snake.newGame();
};

//var resetGame = {
//	a: {
//		name: 'play',
//		func: function() {
//			pcli('custom handler');
//			window.App.resetOK();
//			Snake.newGame(true);
//			
//		},
//		attached: false
//	}
//};
//var go_up = function() {
//	var myurl = 'http://'+window.location.host+ window.location.pathname.replace ( 'Snakey' , 'Games' ) ;
//	window.location.assign( myurl );
//};
//window.App = {
//	appinit: function() {
//		// add the DMC lib
//		this.dmc = new DMC();
//		//add the dispatcher interface (same as Grab:[Dispatcher] with augmented App object)
//		Dispatcher(this);

//		//load the events and start the snake
//		var constructEvents = function() {
//				var A = ['up', 'down', 'left', 'right', 'play'],
//					i, O = {};
//				for (i = 0; i < A.length; i++) {
//					O[A[i]] = {
//						name: A[i],
//						func: Snake.DMCIntegration,
//						attached: false
//					};
//				}
//				O.a = {
//					name: 'home',
//					func: function() {
//						if (window.location.host.indexOf('sysmaster') != -1 ) { 
//							alert('app://close_youtube'); 
//						} else {
//							Utils.goHome();
//						}
//					},
//					attached: false
//				};
//				O.b = {
//					name: 'return',
//					func: function() {
//						if (window.location.host.indexOf('sysmaster') != -1 ) { 
//							go_up(); 
//						} else {
//							Utils.goHome();
//						}
//					},
//					attached: false					
//				};
//				return O;
//			};
//		this.addCustomHandlers(constructEvents());
//		Snake.setup();
//		Snake.newGame();
//	},
//	resetOK: function() {
//		this.removeCustomHandlers(resetGame);
//		pcli('removed custom handler for ok');

//	},
//	endGame: function() {
//		pcli('called end game');
//		this.addCustomHandlers(resetGame);
//		pcli(resetGame);
//		pcli('added custom handler');
//	}
//};
//window.App.appinit();
