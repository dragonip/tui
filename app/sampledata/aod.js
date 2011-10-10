Loader.loaded(
	"aod",
	{	
		config : {
			gridLayout : { 
				head : {rows : 1, cols : 5},
				body : {rows : 6, cols : 5}
			},
			columns : {
				sizes : [37, 37, 550, 20, 20],
				alignment : ["left", "left", "left", "left", "left"]
			},
			actions : {
				select : {url : "test"}
			}
		},
		body : [
                [62,"5 ","NFSHP Hot Action Cop - Going Down On It (AOD) ","","2.00USD ",0,0, "0,0,0 ","http://www.bloodys.com/wp-content/uploads/2008/06/firefox-logo.jpg "],
                [76,"+ ","AOD folder ","FOLDER","",0,0, " ","  "]
		],
		
		dirs: {
			
				"76" : { location : {url: "app/sampledata/aod_dir_76.js", sig: "76"}}
			
		}
		
	}
);
