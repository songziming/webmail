seajs.config({
		base: "/js/",
		alias: {
			"main" : "/script/main.js",
			"jquery": "/lib/jquery.js",
			"is": "/lib/is.min.js",
			"highcharts": "/lib/hightcharts.js",
			"Map": "/lib/Map.js",
			"header": "/script/headerController.js",
			"left": "/script/leftController.js"
		}
	});
	alert("233");
	seajs.use("main");