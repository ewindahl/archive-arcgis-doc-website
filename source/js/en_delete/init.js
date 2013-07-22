/*
!(function () {
	try {
		var afb = document.getElementById ("afb"),
			gsaf = document.getElementById ("primarySearch"),
			hn = window.location.hostname,
			afbpath = "/apps/feedback/dev_feedback.php",
			gsafpath = "/search/index.cfm";
		
		if (hn === "developers.arcgis.com") {
		
		} else if (hn === "developersdev.arcgis.com") {
			afb.setAttribute ("href", "http://resourcesdev.arcgis.com" + afbpath);
			gsaf.setAttribute ("action", "http://resourcesdev.arcgis.com" + gsafpath);
		
		} else if (hn === "developersstg.arcgis.com" || hn === "developersdevext.arcgis.com" || hn === "developersqa.arcgis.com") {
			afb.setAttribute ("href", "http://resourcesstg.arcgis.com" + afbpath);
			gsaf.setAttribute ("action", "http://resourcesstg.arcgis.com" + gsafpath);
		}
	} catch (e){}
})();
*/

!(function () {
	function insertJS (jsUrl) {
	}
	function insertCss (cssUrl) {
	}
	/*	
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
	*/
	try {
		var afb = document.getElementById ("afb"),
			gsaf = document.getElementById ("primarySearch"),
			hn = window.location.hostname,
			afbpath = "/apps/feedback/dev_feedback.php",
			gsafpath = "/search/index.cfm";
		
		if (hn === "doc.arcgis.com") {
		
		} else if (hn === "docdev.arcgis.com") {
			afb.setAttribute ("href", "http://resourcesdev.arcgis.com" + afbpath);
			gsaf.setAttribute ("action", "http://resourcesdev.arcgis.com" + gsafpath);

			insertCss ("/en/asset/css/workflow.css");
			insertJS ("/en/asset/js/workflow.js");

		} else if (hn === "docstg.arcgis.com") {
			afb.setAttribute ("href", "http://resourcesstg.arcgis.com" + afbpath);
			gsaf.setAttribute ("action", "http://resourcesstg.arcgis.com" + gsafpath);

			if (hn === "docstg.arcgis.com") {
				insertCss ("/en/asset/css/workflow.css");
				insertJS ("/en/asset/js/workflow.js");				
			}

		}
	} catch (e){}
})();

