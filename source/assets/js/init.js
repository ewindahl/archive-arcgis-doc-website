!(function () {
	function insertJS (jsUrl) {
		var js = document.createElement('script');
		js.src = jsUrl;
		document.body.appendChild(js);
	}
	function insertCss (cssUrl) {
		var css = document.createElement('link');
		css.rel = "stylesheet";
		css.type = "text/css";
		css.href = cssUrl;
		document.getElementsByTagName('head')[0].appendChild(css);
	}

	try {
		var hn = window.location.hostname;
		insertJS("/assets/js/anchor.js");
		if (hn === "doc.arcgis.com") {

		} else if (hn === "docdev.arcgis.com") {

			insertCss ("/cdn/css/workflow.css");
			insertJS ("/assets/js/workflow.js");

		} else if (hn === "docstg.arcgis.com") {

			insertCss ("/cdn/css/workflow.css");
			insertJS ("/assets/js/workflow.js");

		}
	} catch (e){
		//console.log (e);
	}
})();
