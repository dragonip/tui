/**
 * @module dmc DOCS COMMING SOON Provides the standard DMC interface (as in the 1.x series of the SDK
 */
define(['dmc/smjs'], function (smjs) {
	var nativeURL = '/cgi-bin/voip.cgi?run=get_cfgval_json&section={cs}&var={v}',
		nativeURLsetter = '/cgi-bin/voip.cgi?run=set_cfgval_json&section={configsection}&var={variable}&val={value}',
		progressiveURL = '/getconfig',
		progressiveURLsetter = '/setconfig';

	var cache = [];
	//
	// when config is changed from outside please fire an event so that we can clear cache!!!
	// 
	// TODO get conig options with the new method and store them locally for faster access
	// TODO test get request with web worker
	//
	function resolveSection(getWhat, onWhat) {
		var resolved = {};
		switch (getWhat) {
			case 'ip':
				if (onWhat === 'wifi') {
					return {
						cs: 'wireless',
						v: 'wifi_ip'
					};
				} else if (onWhat === 'eth0' || typeof onWhat === 'undefined'  ) {
					return {
						cs: 'system',
						v: 'ip'
					};
				} else {
					return null;
				}
			default: 
				return null;
		}
	}
	function substitute(line, object) {
		return line.replace((/\\?\{([^{}]+)\}/g), function(match, name) {
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}
	function fillCache(res, val) {
		if (typeof cache[res.cs] === 'undefined' ) {
			cache[res.cs] = {};
		}
		cache[res.cs][res.v] = val;
	}
	function getFromCache(what, opts) {
		console.log(arguments);
		var res = resolveSection(what, opts);
		if (res) {
			var val;
			if ( typeof cache[res.cs] !== 'undefined' && typeof cache[res.cs][res.v] !== 'undefined' ) {
				console.log('we have it in cache, get it from there');
				return cache[res.cs][res.v];
			}
			else {
				console.log(substitute(nativeURL, res));
				val = smjs.url_get(substitute(nativeURL, res));
				fillCache(res, val);
				return val;
			}
		} else {
			return res;
		}
	}
	function getCfgOption(a, b, c) {
		return getFromCache(a, b);
	}
	return {
		initAPI: function() { smjs.initapi(); },
		getSerialNumber: function() { return smjs.getSerialNumber(); },
		getMACAddress: function(a) { },
		getUIresolution: function() { },
		getNetworkInterfaceList: function() { if (smjs.native) return 'eth0 wifi'; return ''; },
		isDHCP: function(iface) { return getCfgOption('dhcp', iface); },
		getIPAddress: function(iface) { return getCfgOption('ip', iface); },
		onKeyPress: function(fn) { smjs.onKeyPress(fn); },
		isNative: function() { return (typeof smjs.emulated === 'boolean' && smjs.emulated)?false:true ; }

	};
});
/*	

	var DMC = function () {
		var CONFIG = {
			OBJECT: undefined,
			lastUpdate: undefined,
			config: {
				url: (smjs.emulated) ? window.location.protocol + '//' + window.location.host + '/cgi-bin/voip.cgi?run=fill_setup_json' : 'http://127.0.0.1/cgi-bin/voip.cgi?run=fill_setup_json'
			}
		};
		//
		// internal errors, Use those when emulating function
		// 
		var ERRORS = {
			RANGE: {
				name: "RangeError",
				message: 'Variable is outside the required range'
			},
			TYPE: {
				name: 'TypeError',
				message: 'Parameter type error, please check the types of your parameters'
			},
			MISSING: {
				name: 'RequirementError',
				message: 'A parameter is missing or was undefined'
			},
			NOTAPORT: {
				name: 'InvalidPortNumberError',
				message: 'The parameter should be a valid port number from 1 to 65535'
			}
		};
		//
		// internal functions/private methods
		// 
		var updateConfig = function (a, b, c) {
				var z = window.location;
				var local_address = z.protocol + '//' + z.host + ':' + z.port + '/cgi-bin/voip.cgi?',
					update_url = 'run=update_setup_json&var=' + b + '&val=' + c,
					set_remote_config = function (z) {
						var result;
						result = smjs.url_get(z);
						if (typeof result === 'number') {
							pcli('Issue with internal function: ' + result);
							return result;
						}
						result = result.substring(result.indexOf('{') - 1, result.length - 3);
						result = JSON.decode(result);
						if (result.status == 'OK') {
							return 0;
						}
						else return 99;
					},
					d = getConfig();
				if (typeof d == 'number') return 99;
				if (typeof d[a] == 'undefined' || typeof d[a][b] == 'undefined') {
					pcli('Requested option does not exist`s');
					return 99;
				}
				return set_remote_config(local_address + update_url);
			};
		var getConfig = function () {
				var updateConfig = function () {
						//
						// Parse the config as dirctly returned by current implementation
						// and store the values in JSON object
						// 
						//
						var get_remote_config = function (a) {
								var result;
								result = smjs.url_get(a);
								return result;
							};
						var parseConfig = function (txt) {
								var OBJECTS = ['general', 'lannetworking', 'wifi', 'voip', 'iptv'],
									i, j;
								var json_object;
								//
								// create CONFIG for some options in parsed file depend on this object, do not use it however
								// 
								var CONFIG = {
									COMMANDS: {
										SAVE_TIME_DATE: {
											url: "/cgi-bin/voip.cgi?run=savedt_json",
											sig: "savedt"
										},
										REBOOT: {
											url: "/cgi-bin/voip.cgi?run=reboot_json",
											sig: "reboot"
										},
										UPGRADE: {
											url: "/cgi-bin/voip.cgi?run=upgrade_json",
											sig: "upgrade"
										},
										TURN_OFF: {
											url: "/cgi-bin/voip.cgi?run=turnoff_json",
											sig: "turnoff"
										},
										SAVE_RESOLUTION: {
											url: "/cgi-bin/if.cgi?r=save_res",
											sig: "save_res1"
										},
										// example: /save_res?res=800x600
										SAVE_RESOLUTION2: {
											url: "save_res2",
											sig: "$save_res2"
										},
										PHONE_LINES: 2,
										CALL_LINE1: {
											url: "/cgi-bin/voip.cgi?run=start_json_voicecall",
											sig: "openline1"
										},
										// parameters: num
										CALL_LINE2: {
											url: "/cgi-bin/voip.cgi?run=start_json_voicecall",
											sig: "openline2"
										},
										// parameters: num
										CALL_LINE3: {
											url: "/cgi-bin/voip.cgi?run=start_json_voicecall",
											sig: "openline3"
										},
										// parameters: num
										CALL_LINE4: {
											url: "/cgi-bin/voip.cgi?run=start_json_voicecall",
											sig: "openline4"
										},
										// parameters: num
										VIDEO_CALL_LINE1: {
											url: "/cgi-bin/voip.cgi?run=start_json_videocall",
											sig: "vopenline1"
										},
										// parameters: num
										VIDEO_CALL_LINE2: {
											url: "/cgi-bin/voip.cgi?run=start_json_videocall",
											sig: "vopenline2"
										},
										// parameters: num
										VIDEO_CALL_LINE3: {
											url: "/cgi-bin/voip.cgi?run=start_json_videocall",
											sig: "vopenline3"
										},
										// parameters: num
										VIDEO_CALL_LINE4: {
											url: "/cgi-bin/voip.cgi?run=start_json_videocall",
											sig: "vopenline4"
										},
										// parameters: num
										CLOSE_LINE1: {
											url: "/cgi-bin/voip.cgi?run=hangup_json_call",
											sig: "closeline1"
										},
										CLOSE_LINE2: {
											url: "/cgi-bin/voip.cgi?run=hangup_json_call",
											sig: "closeline2"
										},
										CLOSE_LINE3: {
											url: "/cgi-bin/voip.cgi?run=hangup_json_call",
											sig: "closeline3"
										},
										CLOSE_LINE4: {
											url: "/cgi-bin/voip.cgi?run=hangup_json_call",
											sig: "closeline4"
										},
										PUT_ON_HOLD1: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "onhold1"
										},
										PUT_ON_HOLD2: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "onhold2"
										},
										PUT_ON_HOLD3: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "onhold3"
										},
										PUT_ON_HOLD4: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "onhold4"
										},
										RELEASE_ON_HOLD1: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "releaseonhold1"
										},
										RELEASE_ON_HOLD2: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "releaseonhold2"
										},
										RELEASE_ON_HOLD3: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "releaseonhold3"
										},
										RELEASE_ON_HOLD4: {
											url: "/cgi-bin/voip.cgi?run=hold_json",
											sig: "releaseonhold4"
										},
										DIAL_DIGIT1: {
											url: "/cgi-bin/voip.cgi?run=dial_json_digit",
											sig: "dial_digit1"
										},
										// parameters: digit
										DIAL_DIGIT2: {
											url: "/cgi-bin/voip.cgi?run=dial_json_digit",
											sig: "dial_digit2"
										},
										// parameters: digit
										DIAL_DIGIT3: {
											url: "/cgi-bin/voip.cgi?run=dial_json_digit",
											sig: "dial_digit3"
										},
										// parameters: digit
										DIAL_DIGIT4: {
											url: "/cgi-bin/voip.cgi?run=dial_json_digit",
											sig: "dial_digit4"
										},
										// parameters: digit
										TRANSFER: {
											url: "/cgi-bin/voip.cgi?run=transfer_json",
											sig: "transfer"
										},
										// parameters: num
										CONFERENCE: {
											url: "/cgi-bin/voip.cgi?run=conference_json",
											sig: "conference"
										} // parameters: line1, line2, line3, line4; lineN=1 means lineN will participate in the conference call
									}
								}
								//
								// error occured in SMJS - transmit the error further
								// 
								if (typeof txt == 'number') return txt;
								txt = txt.substring(txt.indexOf('{') - 1, txt.length - 3);
								txt = eval('(' + txt + ')');
								json_object = {};
								json_object.lastUpdate = new Date();
								for (i = 0; i < OBJECTS.length; i++) {
									json_object[OBJECTS[i]] = {};
									for (j = 0; j < txt[OBJECTS[i]]['body'].length; j++) {
										json_object[OBJECTS[i]][txt[OBJECTS[i]]['body'][j][0]] = txt[OBJECTS[i]]['body'][j][2];
									}
								}
								return json_object;
							};
						//
						// Store the config object in private member for later use and caching
						// NOTE: it can be a number also, because error occured in smjs
						// 
						CONFIG.OBJECT = parseConfig(get_remote_config(CONFIG.config.url));
						pcli('1');
						CONFIG.last_update = (new Date());
					};
				//
				// check cache and if it is not fresh or object is not available retrieve config
				// else just return 
				// 
				if (typeof CONFIG.OBJECT === 'undefined' || (new Date() - CONFIG.last_update > 10000) || typeof CONFIG.OBJECT == 'number') {
					pcli('Updateing the config');
					updateConfig();
				}
				return CONFIG.OBJECT;
			};
		//
		// Helper function, private members, should not be exposed
		// 
		var isPortNumber = function (a) {
				a = parseInt(a);
				if (isNaN(a) || a < 1 || a > 65535) {
					return null;
				}
				return a;
			};
		var resolveIface = function (a) {
				if (a === 'eth0' || typeof a == 'undefined') return 'lannetworking';
				if (a === 'wifi') return a;
				return null;
			};
		var printConfigObject = function () {
				return getConfig();
			};
		//
		// BEGIN WRAPPING 
		// 
		//  -> 3.1 System Functions
		this.getSerialNumber = function () {
			return smjs.getSerialNumber();
		};
		this.getMACAddress = function (a) {
			a = resolveIface(a);
			if (a == 'eht0') return getConfig()['lannetworking']['mac'];
			else return null;
		};
		//
		// not implemented!
		// 
		this.getUIResolution = function () {};
		this.setUIResolution = function () {};
		//
		// End not implemented!
		// 
		this.getNetworkInterfaceList = function () {
			return "eth0 wifi";
		};
		this.isDHCP = function (a) {
			a = resolveIface(a);
			if (a !== null) return (getConfig()[a][(a == 'wifi') ? a + '_dhcp' : 'isldhcp'] === "0") ? false : true;
			return a;
		};
		this.getIPAddress = function (a) {
			a = resolveIface(a);
			if (a !== null) {
				var result = getConfig()[a][(a == 'wifi') ? a + '_ip' : 'ip'];
				return (result == '') ? null : result;
			}
			return a;
		};
		this.getNetMask = function (a) {
			a = resolveIface(a);
			if (a !== null) {
				var result = getConfig()[a][(a == 'wifi') ? a + '_netmask' : 'netmask'];
				return (result == '') ? null : result;
			}
			return a;
		};
		this.getGateway = function (a) {
			a = resolveIface(a);
			if (a !== null) {
				var result = getConfig()[a][(a == 'wifi') ? a + '_gw' : 'gw'];
				return (result == '') ? null : result;
			}
			return a;
		};
		this.getDomain = function () {
			return null
		};
		this.getDNS = function (a) {
			resolveIface(a);
			if (a !== null) {
				var result = getConfig()[a][(a == 'wifi') ? a + '_dns' : 'nameserver'];
				return (result == '') ? null : result;
			}
			return a;
		};
		this.setDHCP = function (a, b) {
			if (typeof a != 'number') return 2;
			if (a !== 0 && a !== 1) {
				return 4;
			}
			b = resolveIface(b);
			if (b != null) {
				a = (a === 0) ? '0' : '1';
				return updateConfig(b, (b === 'wifi') ? 'wifi_dhcp' : 'isldchp', a);
			}
			else {
				return 4;
			}
		};
		this.setIPAddress = function (a, b) {
			if (typeof a != 'string' || (typeof b != 'undefined' && typeof b != 'string')) return 2;
			b = resolveIface(b);
			if (b !== null) {
				return updateConfig(b, (b === 'wifi') ? b + '_ip' : 'ip', a);
			}
			return 4;
		};
		this.setNetMask = function (a, b) {
			if (typeof a != 'string' || (typeof b != 'undefined' && typeof b != 'string')) return 2;
			b = resolveIface(b);
			if (b !== null) {
				return updateConfig(b, (b === 'wifi') ? b + '_netmask' : 'netmask', a);
			}
			return 4;
		};
		//
		// THIS FUNCTION IS UNIQUE FOR OUR DEVICE
		// 
		this.setDefaultInetIface = function (a) {
			//sets which device's GW will be set as fedault system wide
			if (typeof a != 'undefined' && typeof a != 'number') return 2;
			if (typeof a == 'undefined') return 1;
			if (isNaN(a) || a < 0 || a > 1) return 4;
			return updateConfig('lannetworking', 'defif', a);
		};
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.getDefailtInetIface = function () {
			//
			// return the default interface number as String ('0' or '1')
			// 
			var r = getConfig();
			if (typeof r == 'number') return r;
			return r['lannetworking']['defif'].toString();
		};
		this.setGateway = function (a, b) {
			if (typeof a != 'string' || (typeof b != 'undefined' && typeof b != 'string')) return 2;
			b = resolveIface(b);
			if (b !== null) {
				return updateConfig(b, (b === 'wifi') ? b + '_gw' : 'gw', a);
			}
			return 4;
		};
		this.setDomain = function () {
			return -1;
		};
		this.setDNS = function (a, b) {
			if (typeof a != 'string' || (typeof b != 'undefined' && typeof b != 'string')) return 2;
			b = resolveIface(b);
			if (b !== null) {
				return updateConfig(b, (b === 'wifi') ? b + '_dns' : 'nameserver', a);
			}
			return 4;
		};
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.getLANDisabled = function () {
			//
			// returns String, '0' - lan enabled, '1' - lan disabled
			// 
			var r = getConfig();
			if (typeof r == 'number') return null;
			return r['lannetworking']['landisabled'].toString();
		};
		this.browseLocalDevice = function (a) {
			return smjs.browseLocalDevice(a);
		};
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.getCallerID = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			if (a['voip']['callerid'] === '') return null;
			return a['voip']['callerid'];
		};
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.getBalance = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			return a['billing']['balance'];
		};
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.getVoIPStatus = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			return a['voip']['voipstatus'];
		};
		this.seek = function (i) {
			//
			// console.log( 'We will seek with ' + typeof i + ' ' + i );
			// 
			return smjs.seek(i);
		};
		this.wifiIsConnected = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			return a['wifi']['wrconn'];
		};
		this.getAdministrativePort = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			return a['lannetworking']['port'].toString();
		};
		this.setAdministrativePort = function (a) {
			a = isPortNumber(a);
			if (a !== null) {
				return updateConfig('lannetworking', 'port', a);
			}
			return 4;
		};
		this.getSubtitlesVisibility = function () {
			var a = getConfig();
			if (typeof a == 'number') return a;
			a = a['iptv']['subtitles'];
			return (a === '0') ? false : true;
		};
		this.setSubtitlesVisibility = function (b) {
			if (typeof b != 'boolean') return 2;
			return updateConfig('iptv', 'subtitles', (b === true) ? '1' : '0');
		};
		//
		// ADD UPGRADE FUNCATIONS
		// 
		this.onEvent = function (f) {
			smjs.onEvent(f);
		};
		this.onFirmwareEvent = function (f) {
			smjs.onFirmwareEvent(f);
		};
		this.onMessageListenerEvent = function (f) {
			smjs.onMessageListenerEvent(f);
		};
		this.onHotplugEVenet = function (f) {
			smjs.onHotplugEVenet(f);
		};
		this.getTrickPlaySpeed = function () {
			return -1;
		};
		this.setTrickPlaySpeed = function () {
			return -1;
		};
		this.getAudioDList = function () {
			return -1;
		};
		this.getAudioID = function () {
			return -1;
		};
		this.setAudioID = function (i) {
			return -1;
		};
		this.setAudioLanguage = function (s) {
			return -1;
		};
		this.setFavoriteAudioLanguage = function (s) {
			return -1;
		};
		this.getFavoriteAudioLanguage = function () {
			return -1;
		};
		this.getSubtitleIDList = function () {
			return smjs.getSubtitleIDList(arguments);
		};
		this.getSubtitleID = function () {
			return smjs.getSubtitleID(arguments);
		};
		this.setSubtitleID = function () {
			return smjs.setSubtitleID(arguments);
		};
		this.playYouTubeVideo = function (a) {
			return smjs.play_youtube(a);
		};
		this.onKeyPress = function (f) {
			//
			// NOTE: parameters are passed by value, including Objects, not by reference!
			// 
			smjs.onKeyPress(f);
		};
		this.play = function (a) {
			return smjs.play(a);
		}
		this.pause = function () {
			return smjs.pause();
		}
		this.stop = function () {
			return smjs.stop();
		}
		this.resume = function () {
			return smjs.resume();
		}
		this.setPosition = function (a) {
			return smjs.setPosition(a);
		}
		this.getPosition = function (a) {
			return smjs.getPosition(a);
		}
		this.getStreamDuration = function () {
			return smjs.getStreamDuration();
		}
		this.upgrade = function () {
			return smjs.upgrade();
		}
		this.getStorageValue = function (a) {
			return smjs.getStorageValue(a);
		}
		this.setStorageValue = function (a, b) {
			return smjs.setStorageValue(a, b);
		}
		this.loadURL = function (a) {
			return smjs.loadURL(a);
		}
		this.getRemoteURL = function (a) {
			return smjs.url_get(a);
		}
		this.closeNavigationWindow = function () {
			return smjs.closeNavigationWindow();
		}
		this.getSTBModel = function () {
			return smjs.getSTBModel();
		}
		this.getSoftwareBuildTime = function () {
			return smjs.getSoftwareBuildTime();
		}
		//
		// this makes segfault with wrong params
		// 
		this.getDate = function () {
			return smjs.getDate();
		}
		this.getSoftwareVersion = function () {
			return smjs.getSoftwareVersion();
		}
		this.getSoftwareBootloaderVersion = function () {
			return smjs.getSoftwareBootloaderVersion();
		}
		this.getPowerMode = function () {
			return smjs.getPowerMode();
		}
		this.setPowerMode = function () {
			return smjs.setPowerMode();
		}
		this.getTimeZone = function () {
			return smjs.getTimeZone();
		}
		this.setTimeZone = function () {
			return smjs.setTimeZone();
		}
		this.setSubtitleLanguage = function () {
			return smjs.setSubtitleLanguage();
		}
		this.removeSubtitles = function () {
			return smjs.removeSubtitles();
		}
		this.addSubtitleURL = function () {
			return smjs.addSubtitleURL();
		}
		this.setSubtitleURL = function () {
			return smjs.setSubtitleURL();
		}
		this.unsetSubtitleURL = function () {
			return smjs.unsetSubtitleURL();
		}
		this.setSubtitleEncoding = function () {
			return smjs.setSubtitleEncoding();
		}
		this.getSubtitleURL = function () {
			return smjs.getSubtitleURL();
		}
		this.clearSubtitleURL = function () {
			return smjs.clearSubtitleURL();
		}
		this.getStreamVideoInformation = function () {
			return smjs.getStreamVideoInformation();
		}
		this.getStreamAudioInformation = function () {
			return smjs.getStreamAudioInformation();
		}
		this.setVideoSize = function () {
			return smjs.setVideoSize();
		}
		this.getVideoSize = function () {
			return smjs.getVideoSize();
		}
		this.setAspectRatio = function () {
			return smjs.setAspectRatio();
		}
		this.getAspectRatio = function () {
			return smjs.getAspectRatio();
		}
		this.setScreenMode = function () {
			return smjs.setScreenMode();
		}
		this.getScreenMode = function () {
			return smjs.getScreenMode();
		}
		this.setOutputResolution = function () {
			return smjs.setOutputResolution();
		}
		this.getOutputResolution = function () {
			return smjs.getOutputResolution();
		}
		this.getAlpha = function () {
			return smjs.getAlpha();
		}
		this.setAlpha = function (alpha) {
			return smjs.setAlpha(alpha);
		}
		this.isMacrovisionEnabled = function () {
			return smjs.isMacrovisionEnabled();
		}
		this.setChromaKey = function () {
			return smjs.setChromaKey();
		}
		this.getChromaKey = function () {
			return smjs.getChromaKey();
		}
		this.setUI3D = function () {
			return smjs.setUI3D();
		}
		this.getVolume = function () {
			return smjs.getVolume();
		}
		this.setVolume = function (vol) {
			return smjs.setVolume(vol);
		}
		this.isMute = function () {
			return smjs.isMute();
		}
		this.setMute = function (a) {
			return smjs.setMute(a);
		}
		this.setAudioDualMonoMode = function () {
			return smjs.setAudioDualMonoMode();
		}
		this.getAudioDualMonoMode = function () {
			return smjs.getAudioDualMonoMode();
		}
		this.setDolbyDownmixMode = function () {
			return smjs.setDolbyDownmixMode();
		}
		this.getDolbyDownmixMode = function () {
			return smjs.getDolbyDownmixMode();
		}
		this.setDolbyDRCMode = function () {
			return smjs.setDolbyDRCMode();
		}
		this.getDolbyDRCMode = function () {
			return smjs.getDolbyDRCMode();
		}
		this.getPlayingFilePosition = function () {
			return smjs.getPlayingFilePosition();
		}
		this.getStorageState = function () {
			return smjs.getStorageState();
		}
		//
		// THIS FUNCTION IS UNIQUE
		// 
		this.setSubtitles = function (a) {
			if (typeof a !== 'boolean') return 2;
			a = (a) ? 1 : 0;
			var result = updateConfig('iptv', 'subtitles', a);
			return result;
		};
		//
		//  -> 3.5 Miscellaneous Functions
		// 
		this.dvbScan = function () {
			this.loadURL(window.location.protocol + '//' + window.location.host + '/cgi-bin/voip.cgi?run=dvbscan_json&cb=1305211482952&sig=dvbscan');
		};
		this.debugMsg = function (a, b, c) {
			smjs.debugMsg(a, b, c);
		};
		this.setDebugLevel = function (a) {
			smjs.setDebugLevel(a);
		};
		this.setSyslogServer = function (a, b) {
			smjs.setSyslogServer(a, b);
		};
		this.reboot = function () {
			smjs.reboot();
		};
		this.startMessageListener = function (a) {
			//
			// return = smjs.startMessageListener( a );
			// 
		};
		this.stopMessageListener = function () {};
		this.setopwer = function (str) {
			//parameter currently ignored
			smjs.setpower(str);
		};
		//
		// -> Unsupporteed and will not be supported
		// 
		var UNSUPPORTED = [
			'initSsdp',
			'uninitSsdp',
			'getSsdpList',
			'refreshSsdp',
			'UPnPInit',
			'UPnPUninit',
			'UPnPScanDevices',
			'UPnPGetDevices',
			'UPnPBrowseDevice',
			'UPnPGetMetadata',
			'UPnPServerInit',
			'UPnPServerUninit',
			'testBandwidth',
			'checkUpgrade',
			'cancelUpgradeCheck',
			'startMessageListener',
			'stopMessageListener',
			'removeSubtitles',
			'addSubtitleURL',
			'unsetSubtitleURL',
			'getFirstURL',
			'clearSubtitleURL',
			'removeTeletextSubtitles',
			'enableTeletext',
			'disableTeletext',
			'pltvRecord',
			'pltvGetStatus',
			'loopVOD',
			'loadId3Tags',
			'loadPlaylist',
			'enableMacrovision',
			'disableMacrovision',
			'initPDL',
			'uninitPDL',
			'startPDL',
			'pausePDL',
			'updateUrlPDL',
			'getListPDL',
			'deletePDL',
			'deleteAllPDL',
			'seekPDL'
			];
		this.UNSUPPORTED = UNSUPPORTED;
		for (var iter = 0; iter < UNSUPPORTED.length; iter++) {
			this[UNSUPPORTED[iter]] = function () {
				return -1;
			};
		}
		this.native = smjs.emulated ? false : true;
		return this;
	};
	*/
