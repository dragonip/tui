Loader.loaded(
        "vod",
        {       
                config : {
                        gridLayout : { 
                                head : {rows : 1, cols : 4}, 
                                body : {rows : 6, cols : 4}
                        },
                        columns : {
                                sizes : [40, 545, 20, 20],
                                alignment : ["left", "left", "left", "left"]
                        },
                        actions : {
                                select : {url : "test"}
                        }
                },
                header : [
                        { field : "Id", show : false, name:"id"},
                        { field : "Index", show : true, name:"index_id"},
                        { field : "Name", show : true, name:"name"},
                        { field : "Description", show : false, name:"description"},
                        { field : "Artist", show : false, name:"artists"},
                        { field : "", show : true, mod : "lock", name:"lock"},
                        { field : "", show : true, mod : "favorite", name:"favorite"},
                        { field : "", show : false, name:"personal_rec"}
                ],
                body : [
                        
                        ["9", "9", "Bulgarian Folk@800kbps",
                        {
                                cost : "0.00USD ",
                                genre : "Drama ",
                                rating : "R ",
                                description : "Folk Music Program @ 800kbps ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 1, 1, "0,0,0 "],
                        
                        ["3", "3", "Bulgaria",
                        {
                                cost : "0.00USD ",
                                genre : "Documentary ",
                                rating : "NR ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["5", "10", "m53_test",
                        {
                                cost : "10.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "0,0,0 "],
                        
                        ["19", "19", "ad1",
                        {
                                cost : "0.00USD ",
                                genre : "Drama ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "0,0,0 "],
                        
                        ["101", "20", "FLV_VOD",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["25", "25", "Hitch_CD2",
                        {
                                cost : "0.00USD ",
                                genre : "Drama ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "http://192.168.0.11/imgs/btv_logo_b.gif " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["75", "75", "TA7399Kids.mp4",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["69", "101", "DolphinsAll",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["73", "102", "TA7358_ONM.mov",
                        {
                                cost : "2.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["102", "103", "VOD_TEST",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["32", "104", "Wall-E",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["14", "111", "Terminator 640x480",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "0,0,0 "],
                        
                        ["15", "112", "Spawn",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "0,0,0 "],
                        
                        ["115", "115", "briggoescrown.mp4",
                        {
                                cost : "0.00USD ",
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  ",
                                thumb_url : "  " 
                        }, 0, 0, "1,0,0 "],
                        
                        ["234", "+1", "test",
                        {
                                cost : " ",
                                genre : "FOLDER",
                                rating : " NR",
                                description : " ",
                                artists : " ",
                                thumb_url : " " 
                        }, 0, 0, " "],
                        
                        ["9999", "9999", "Dolphin",
                        {
                                cost : "",
                                genre : "User Video",
                                rating : "",
                                description : " ",
                                artists : "",
                                thumb_url : "" 
                        }, 0, 0, ""],
                        
                ],
                
                dirs: {
                        
                                "234" : { location : {url: "app/sampledata/vod_dir_234.js", sig: "234"}},
                        
                }
                        
                
        }
);
