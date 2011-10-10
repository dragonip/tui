Loader.loaded("234", {
	config: {
		gridLayout: {
			head: {
				rows: 1,
				cols: 4
			},
			body: {
				rows: 6,
				cols: 4
			}
		},
		columns: {
			sizes: [40, 545, 20, 20],
			alignment: ["left", "left", "left", "left"]
		},
		actions: {
			select: {
				url: "test"
			}
		}
	},
	header: [{
		field: "Id",
		show: false,
		name: "id"
	},
	{
		field: "Index",
		show: true,
		name: "index_id"
	},
	{
		field: "Name",
		show: true,
		name: "name"
	},
	{
		field: "Description",
		show: false,
		name: "description"
	},
	{
		field: "Artist",
		show: false,
		name: "artists"
	},
	{
		field: "",
		show: true,
		mod: "lock",
		name: "lock"
	},
	{
		field: "",
		show: true,
		mod: "favorite",
		name: "favorite"
	},
	{
		field: "",
		show: false,
		name: "personal_rec"
	}],
	body: [
		["4", "4", "Test_flv ",
		{
			cost: "0.00USD ",
			genre: "Drama ",
			rating: "NR ",
			description: " ",
			artists: " ",
			thumb_url: " "
		},
		0, 0, "0,0,0 "], ],
});

