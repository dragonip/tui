{
	header: {
		globalCallback: "window.GlobalFunction",
		tag: "unique ID",
		method: "get_url|request|play|stop|pause|calld",
		transport: "javascript|socket",
		type: "request|event|reply|response",
		mode: "sync|async"
	},
	request: {
		templateurl: "",
		template: "",
		url: "",//play|get_url|jsonget
		content: 
	},
	=====
	event: {
		key: "up",
	},
	response: {
		status: "ERR_*"
	}//,
//	status: {}
}

