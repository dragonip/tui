[
	{
		"id": ##obj_id##, //{Number} positive integer or 0 for directories
		"sortIndex": ##index_id##, //{Number} positive integer or 0 for directories
		"publishName": "##video_name##", //{String} 
		"type": "", //{String} lowercase name (iptv, vod, ppv, aod, uservideo, radio, dir, useraudio)
		"thumbnail": "##logo_img##", //{String} Any URL in http[s] protocol or empty string
		"isLocked": false,  //{Boolean} 
		"isBookmarked": false, //{Boolean}
		"currency": "BGN",  //{String}.length === 3, UpperCase or emptry string
		"cost": 1.02, //{Number}, float with precision 2 or 0
		"time": ##duration##, //{Number|null}, integer, seconds or null if no time information is available
		"personalRecordingOptions": {
			"canRecord": true, // {Boolean}, mand.
			"canWatchTimes": 0,  //{Number} positive integer or 0
			"expiresInDays": 0 //{Number} positive integer or 0
		},
		"rating" : "##rating##", // {String} text
		"description" : "##descr##", //{String}
		"genre": "##genre##", //{String} will be converted to laower case, translatable, or empty string
		"artists" : "##artist##", //{String}
		"year": "##year##", //{String}
		"playURI": "##location##", //{String} valid playback URI or emptry string for directories
		"isDir": "LoadURL"||false, //{Boolean|String} False is the item is not a directory or valid URL to load dir content
	}
]
