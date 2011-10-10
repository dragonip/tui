Loader.loaded(
        "iptv",
        {       
                config : {
                        gridLayout : { 
                                head : {rows : 1, cols : 5}, 
                                body : {rows : 6, cols : 5}
                        },
                        columns : {
                                sizes : [40, 40, 120, 20, 20],
                                alignment : ["center", "left", "left", "left", "left"]
                        },
                        actions : {
                                select : {url : "test"}
                        }
                },
                body : [
                        
                        ["45", "9", "Test5", "http://192.168.0.11/imgs/btv_logo_b.gif ", 0, 1, "6,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["41", "6", "Test1 - Some long name here expected. Testing Long IPTV Content object Names. Test1 - Some long name here expected. Testing Long IPTV Content object Names.", "http://192.168.0.11/imgs/bnt_logo.jpg ", 0, 1, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "This is a test channel 1 ",
                                artists : "James Brown "
                        }, "Test5"],
                        
                        ["4", "4", "Test_flv", "  ", 0, 0, "0,0,0 ",
                        {
                                genre : "Drama ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["42", "7", "Test2", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["43", "8", "Test1 - Some long name here expected. Testing Long IPTV Content object Names. Test1 - Some long name here expected. Testing Long IPTV Content object Names.", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["51", "10", "Test6", "  ", 0, 0, "0,0,0 ",
                        {
                                genre : "News ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["52", "11", "Test7", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["72", "13", "IPTV Test", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["29", "14", "Test1_Timeshift", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["30", "15", "Test5_Timeshift", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["48", "48", "Multiplexer1", "  ", 0, 0, "2,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["53", "53", "Multiplexer", "  ", 0, 0, "1,0,0 ",
                        {
                                genre : "Others ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["64", "100", "CNN-LATE", "  ", 0, 0, "0,0,0 ",
                        {
                                genre : "Drama ",
                                rating : "G ",
                                description : "  ",
                                artists : "  "
                        }, "Test5"],
                        
                        ["23", "+", "iptv_test", "http://192.168.0.11/imgs/bnt_logo.jpg ", 0, 0, " ",
                        {
                                genre : "FOLDER",
                                rating : " NR",
                                description : " ",
                                artists : " "
                        }, "Test5"],
                        
                        ["9099", "9099", "test", "", 0, 0, "",
                        {
                                genre : "User Video",
                                rating : "",
                                description : "This is a direct URL",
                                artists : ""
                        }, "http://206.191.11.112/cpac1flh"],
                        
                        ["9991", "9991", "birko", "", 0, 0, "",
                        {
                                genre : "User Video",
                                rating : "",
                                description : "borko test",
                                artists : ""
                        }, "http://eurostream.tv:1111"],
                        
                ],
                
                dirs: {
                        
                                "23" : { location : {url: "app/sampledata/iptv_dir_23.js", sig: "23"}},
                        
                }
                
                
        }
);
