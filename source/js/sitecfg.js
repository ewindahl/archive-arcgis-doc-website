/*
var host = "http://marketplacedevext.arcgis.com",
    searchHost = "http://searchdev.esri.com",
*/

var _searchHost = "//searchdev.esri.com",
	_agolHost = "//devext.arcgis.com",
	_mkpHost = "//marketplace.arcgis.com",
	_esriHost = "http://dev.esri.com",
	trialUrl = "//learndev.arcgis.com";
	
if(window.location.hostname.match( /(docstg.arcgis.com)/)) {
	_searchHost = "//searchstg.esri.com";
	_agolHost = "//qaext.arcgis.com";
	trialUrl = "https://learnstg.arcgis.com";
	_esriHost = "http://cmsqa.esri.com";
} else if(window.location.hostname.match( /(doc.arcgis.com)/)) {
	_searchHost = "//search.esri.com";
	_agolHost = "//www.arcgis.com";
	trialUrl = "https://learn.arcgis.com";
	_esriHost = "http://www.esri.com";
}


    sitecfg = {
	  	"debug" : false,
	
	    "portalHostname" : _agolHost,

		"agolSignin" : 	_agolHost + "/home/signin.html",
		"agolProfile" :  "/home/user.html",
		"agolHelp" :  	 "/home/support.html",
		"agolSignout" :  "/sharing/rest/oauth2/signout",
		"trialDownloadUrl": trialUrl + "/en/trial/",

		"mkpSignin" : 	_mkpHost + "/signin.html",
		"mkpConsole" : 	_mkpHost + "/console.html",
		"mkpSearch" : 	_mkpHost + "/search.html",

        "searchUrl" : 	_searchHost + "/v3/index.cfm",
		  "esriHostname" : _esriHost,

		"searchIfc" : "arcgis_doc_ifce",
	  	"searchView" : "arcgis_doc_vw"

	};
	
	if(window.location.port && window.location.port == "4567"){
		sitecfg.localhost = true;
	}
