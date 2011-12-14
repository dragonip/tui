define({
	player: {
		states: {
			playing: 'Playing: ',
			buffering: 'Buffering: ',
			paused: 'Paused: ',
			starting: 'Starting: ' 
		}
	},
	lists: {
		noContent: "There are no items in this category",
		lock: "Lock",
		unlock: "Unlock",
		bookmark: "Bookmark",
		unbookmark: "Unbookmark",
		actionFailed: "The selected action cannot be completed"
	},
	epg: {
		panels: {
			bottom: {
				upDown: "Move",
				info: "Hide EPG",
				ok: "Activate",
				'return': "Deactivate",
				ok_alternate: "Rec/Switch"
			}
		}
	},
	games: {
		panels: {
			bottom: {
				ok: "Start game",
				'return': "End game"
			}
		},
		hints: {
			Sudoku: {
				ok: "Check validity",
				arrows: "Move around"
			},
			Tetris: {
				arrows: 'Move'
			},
			SizzleBox: {
				arrows: 'Move tiles'
			},
			Hangman: {
				arrows: "Select letter",
				ok: "Use letter"
			}
		}
	},
	screens: {
		iptv: {
			panels: {
				bottom: {
					info: 'Show EPG',
					ok: 'Play',
					playPause: 'Show menu'
				}
			}
		},
		callcenter: {
			panels: {
				bottom: {
					
				}
			},
			list: {
				
			}
		},
		sms: {
			panels: {
				bottom: {
					arrows: "Navigate"
				}
			},
			list: {
				header: {
					
				},
				body: {
					to: "To:",
					message: "Text:"
				}
			}
		},
		phonebook: {
			panels: {
				bottom: {
					ok: "Call now",
					info: "Contact options",
					upDown: "Select"
				}
			},
			list: {
				header: {
					name: "Name",
					number: "Number",
					speedDial: "SD"
				}
			}
		},
		voicemail: {
			panels: {
				bottom: {
					upDown: "Navigation",
					ok: "Listen"
				}
			},
			list: {
				header: {
					
				},
				body: {
					caller: "Call from",
					time: "Time of call"
				}
			}
		},
		callhistory: {
			panels: {
				bottom: {
					ok: "Call"
				}
			},
			list: {
				header: {
					caller: "Caller Name",
					time: "Time of call",
					duration: "Call duration",
					type: "Type"
				}
			}
		},
		chooser: {
			panels: {
				bottom: {
					leftRight: "Select task",
					ok: "Go to task"
				}
			},
			list: {
				header: {
					
				},
				body: {
					callcenter: "Call Centre",
					history: "Call History",
					voicemail: "Voice Mail",
					sms: "Send SMS",
					phonebook: "Phonebook"			
				}
			}
		},
		incall: {
			panels: {
				bottom: {
					'return': 'Go to menu',
					upDown: 'Switch line'
				}
			},
			list: {
				header: {
					
				},
				body: {
					statuses: {
						nocall: "No current call"
					}
				}
			}
		}
	},
	components: {
		dialogs: {
			select: "Select action",
			lock: "Parental control password",
			wrongPassword: "The password was incorrect",
			ok: 'OK',
			cancel: 'Cancel',
			ytube: {
				mostPopular: "Most popular",
				topRated: "Top Rated",
				mostViewed: "Most Viewed",
				recent: "Recent Videos",
				'search': "Search",
				select: 'Choose Category',
				searchquery: 'Enter your search query'
			}
		}
	}
});
