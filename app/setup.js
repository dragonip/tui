{ 
	"general" : [
		{
			"name": "version",
			"publishName": "##setup_text7##",
			"value": "##phver##",
			"type" : "static",
			"help": "##phver##"
		},
		{
			"name": "language",
			"publishName": "##setup_text9##",
			"value": "##language##",
			"type": "list",
			"values": {
                "1":"##setup_text10##",
                "2":"##setup_text11##",
                "3":"##setup_text12##",
                "4":"##setup_text13##",
                "5":"##setup_text14##",
                "6":"##setup_text106##",
                "7":"##setup_text107##",
                "8":"##setup_text108##",
                "9":"##setup_text109##",
                "10":"##setup_text110##",
                "11":"##setup_text111##",
                "12":"##setup_text112##",
                "13":"##setup_text113##",
                "14":"##setup_text122##",
                "15":"##setup_text123##",
                "16":"##setup_text126##",
                "17":"##setup_text127##",
                "18":"##setup_text128##",
                "19":"##setup_text129##"			
			},
			"help":"##setup_text15##"
		},
		{
			"name": "display_res",
			"publishName": "##setup_text16##",
			"value": "##display_res##",
			"type": "list",
			"values": {
                "480i":"480 (NTSC 4:3)",
                "480i_16x9":"480 (NTSC 16:9)",
                "576i":"576 (PAL 4:3)",
                "576i_16x9":"576 (PAL 16:9)",
                "720p50":"720p50 (16:9)",
                "720p":"720p (16:9)",
                "1080i50":"1080i50 (16:9)",
                "1080i":"1080i (16:9)",
                "1080p":"1080p25 (16:9)",
			}
			"help": "##setup_text17##"
		},
		{
			"name": "dateTime",
			"publishName":  "##setup_text91##",
			"value":  "##cur_time##",
			"type": "date",
			"help":  "##setup_text92##"
		},
		{
			"name": "upgrade",
			"publishName": "##setup_text85##",
			"type": "action",
			"action": "confirm",
			"confirmtext": "##setup_text86##<br><br>##setup_text84##",
			"exec": "",
			"help":"##setup_text93##
			
		},
<!-- #BEGINZONE dvb_zone -->
		{
			"name": "dvbscan",
			"publishName":"##setup_text97##",
			"type": "action",
			"action":"confirm",
			"confirmtext": "##setup_text98##<br><br>##setup_text84##",
			"exec":"",
			"help": "##setup_text99##"
			
		},
<!-- #ENDZONE dvb_zone -->
<!-- #BEGINZONE m70_zone -->
		{
			"name": "satellite",
			"publishName":"##setup_text125##",
			"value": "##cur_sat##",
			"type": "list",
			"values": 
			    <!-- #BEGINTABLE data1 -->!!!!!!!!!!!!!!!!!!!!!!!!!!
		        "##satellite##":"##satellite##",
		        <!--  #ENDTABLE data1 -->
			},
			"help": "##setup_text125##: ##cur_sat##"
		},
<!-- #ENDZONE m70_zone -->	
	]
}
                    

//                        ["reboot", "##setup_text87##", "", 
//                                {
//                                        actionType : "dialogAction",
//                                        action: CONFIG.COMMANDS.REBOOT,
//                                        message: "##setup_text88##<br><br>##setup_text84##",
//                                        dialogType: "confirm"
//                                }, "##setup_text94##"
//                        ],
//                        ["exit", "##setup_text89##", "", 
//                                {
//                                        actionType : "dialogAction",
//                                        action: CONFIG.COMMANDS.TURN_OFF,
//                                        message: "##setup_text90##<br><br>##setup_text84##",
//                                        dialogType: "confirm"
//                                }, "##setup_text95##"
//                        ],
//                        ["voucher", "##setup_text102##", "", "string", "##setup_text103##"]
//                ]
//        },
//        "iptv" : {
//                body : [
//                        ["subtitles", "##setup_text75##", "##subtitles##",
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"##setup_text37##",
//                                                "0":"##setup_text38##"
//                                        }
//                                }, "##setup_text76##"],
//                        ["fontsize", "##setup_text124##", "##fontsize##",
//                                {
//                                        "type":"list",
//                                        "data":{"0":"Auto", "1":"1", "2":"2", "3":"3", "4":"4", "5":"5", "6":"6", "7":"7", "8":"8", "9":"9", "10":"10"}
//                                }, "Choose subtitles font size."],
//                        ["subtlang", "##setup_text77##", "##subtlang##",
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"##setup_text10##",
//                                                "2":"##setup_text11##",
//                                                "3":"##setup_text12##",
//                                                "4":"##setup_text13##",
//                                                "5":"##setup_text14##"
//                                        }
//                                }, "##setup_text78##"],
//                        ["plock", "##setup_text79##", "*******", "password", "##setup_text80##"],
//                        ["bufftime", "##setup_text114##", "##bufftime##", {
//                                "type":"list",
//                                "data":{ "0":"0", "2":"2", "4":"4", "6":"6", "8":"8", "10":"10", "12":"12", "14":"14", "16":"16"}
//                                }, "##setup_text96##"],
//                        <!-- #BEGINZONE unused_zone -->
//                        ["pvrrec", "Local Timeshift Recording", "##pvrrec##", {
//                                "type":"list",
//                                "data":{ "0":"Disabled", "30":"30 min", "60":"60 min", "90":"90 min", "120":"120 min"}
//                                }, "Local Timeshift Recording Status"],
//                        <!-- #ENDZONE unused_zone -->
//                        ["seektype", "##setup_text115##", "##seektype##", {
//                                "type":"list",
//                                "data":{ "0":"Once", "1":"Continuous"}
//                                }, "##setup_text115##"],
//                        ["seektm", "##setup_text118##", "##seektm##", {
//                                "type":"list",
//                                "data":{ "0":"Auto", "3":"3 sec", "5":"5 sec", "7":"7 sec", "10":"10 sec", "20":"20 sec"}
//                                }, "##setup_text119##"],
//                        ["layout", "##setup_text100##", "##layout##", {
//                                "type":"list",
//                                "data":{ "0":"List", "1":"Mosaic"}
//                                }, "##setup_text101##"],
//                        <!-- #BEGINZONE unused_zone -->
//                        ["satRetrieve", "##setup_text81##", "", "dialogAction", {
//                                action: CONFIG.SCREENS.SETUP.getSatChannels,
//                                message: "##setup_text82##<br><br>##setup_text83##<br><br>##setup_text84##",
//                                dialogType: "confirm"
//                                }]
//                        <!-- #ENDZONE unused_zone -->
//                        ["dlna", "##setup_text104##", "##dlna##", {
//                                "type":"list",
//                                "data":{ "0":"OFF", "1":"ON"}
//                                }, "##setup_text105##"],
//                ]
//        },
//        "lannetworking" : {
//                body : [
//                        ["landisabled", "##setup_text20##", "##landisabled##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"##setup_text21##",
//                                                "1":"##setup_text22##"
//                                        }
//                                }, "##setup_text23##"],
//                        ["defif", "##setup_text120##:", "##defif##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"LAN",
//                                                "1":"WIRELESS"
//                                        }
//                                }, "##setup_text121##"],
//                        ["mac", "##setup_text24##", "##mac_addr##", "static", "##setup_text25##"],
//                        ["port", "##setup_text26##", "##httpd_port##", "number", "##setup_text27##"],
//                        ["ip", "##setup_text28##", "##ip##", "ipaddress", "##setup_text29##"],
//                        ["netmask", "##setup_text30##", "##netmask##", "ipaddress", "##setup_text31##"],
//                        ["gw", "##setup_text32##", "##gateway##", "ipaddress", "##setup_text33##"],
//                        ["nameserver", "##setup_text34##", "##dns##", "ipaddress", "##setup_text35##"],
//                        ["isldhcp", "##setup_text36##", "##isldhcp##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"##setup_text37##",
//                                                "0":"##setup_text38##"
//                                        }
//                                }, "##setup_text39##"]
//                ]
//        },
//        "wifi" : {
//                body : [
//                        ["wrconn", "##setup_text40##", "##wrconn##", "static", "##setup_text41##"],
//                        ["wrlevel", "##setup_text42##", "##wrlevel## dBm", "static", "##setup_text43##"],
//                        ["wrstat", "##setup_text44##", "##wrstat##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"##setup_text21##",
//                                                "0":"##setup_text22##"
//                                        }
//                                }, "##setup_text45##"],
//                        ["ssidname", "##setup_text46##", "##ssidname##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                <!-- #BEGINTABLE data1 -->
//                                                "##ssid##":"##ssid##",
//                                                <!-- #ENDTABLE data1 -->
//                                        }
//                                }, "##setup_text47##"],
//                        <!-- #BEGINZONE unused_zone2 -->
//                        ["ssidname", "SSID Name", "##ssidname##", "string", "Name of wifi network to which to connect."],
//                        ["aconnect", "Auto Connect", "##aconnect##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"YES",
//                                                "0":"NO"
//                                        }
//                                }, "Auto connect to the specified wireless network"],
//                        <!-- #ENDZONE unused_zone2 -->
//                        <!-- #BEGINZONE unused_zone -->
//                        ["encrypt", "##setup_text48##", "##encrypt##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "3":"WPA2",
//                                                "2":"##setup_text49##",
//                                                "1":"##setup_text50##",
//                                                "0":"##setup_text51##"
//                                        }
//                                }, "##setup_text52##"],
//                        ["encbits", "##setup_text53##", "##encbits##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"64 Bits",
//                                                "1":"128 Bits"
//                                        }
//                                }, "##setup_text54##"],
//                        ["encrypttype", "Encryption Type", "##encrypttype##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"TKIP",
//                                                "1":"AES"
//                                        }
//                                }, "Specify encryption type. Press 'OK' to edit"],
//                        <!-- #ENDZONE unused_zone -->
//                        ["enckey", "##setup_text55##", "##enckey##", "string", "##setup_text56##"],
//                        <!-- #BEGINZONE unused_zone -->
//                        ["enctype", "##setup_text57##", "##enctype##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"Hex",
//                                                "1":"String"
//                                        }
//                                }, "##setup_text58##"],
//                        ["wifimode", "##setup_text59##", "##wifimode##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "0":"Managed",
//                                                "1":"Ad-Hoc"
//                                        }
//                                }, "##setup_text60##"],
//                        <!-- #ENDZONE unused_zone -->
//                        ["wifi_dhcp", "##setup_text61##", "##wifi_dhcp##", 
//                                {
//                                        'type':'list',
//                                        'data':{
//                                                "1":"##setup_text37##",
//                                                "0":"##setup_text38##"
//                                        }
//                                }, "##setup_text62##"],
//                        ["wifi_ip", "##setup_text63##", "##wifi_ip##", "ipaddress", "##setup_text64##"],
//                        ["wifi_netmask", "##setup_text65##", "##wifi_netmask##", "ipaddress", "##setup_text66##"],
//                        ["wifi_gw", "##setup_text67##", "##wifi_gateway##", "ipaddress", "##setup_text68##"],
//                        ["wifi_dns", "##setup_text69##", "##wifi_dns##", "ipaddress", "##setup_text70##"],
//                ]
//        },
//        "voip" : {
//                body : [
//                        ["callerid", "##setup_text71##", "##userid##", "string", "##setup_text72##"],
//                        ["voipstatus", "##setup_text73##", "##devstat##", "static", "##setup_text74##"]
//                ]
//        },
//        <!-- #BEGINZONE unused_zone -->
//        "billing" : {
//                body : [
//                        ["balance", "##setup_text18##", "##cbalance##", "static", "##setup_text19##"],
//                ]
//        },
//        <!-- #ENDZONE unused_zone -->
//});
