/*
var host = "http://marketplacedevext.arcgis.com",
    searchHost = "http://searchdev.esri.com",
*/

var _searchHost = "//searchdev.esri.com",
	_agolHost = "//devext.arcgis.com",
	_mkpHost = "//marketplace.arcgis.com";
	
if(window.location.hostname.match( /(docstg.arcgis.com)/)) {
	searchHost = "//searchstg.esri.com";
	_agolHost = "//qaext.arcgis.com";
} else if(window.location.hostname.match( /(doc.arcgis.com)/)) {
	searchHost = "//search.esri.com";
	_agolHost = "//www.arcgis.com";
}


    sitecfg = {
	  	"debug" : false,
	
	    "portalHostname" : _agolHost,

		"agolSignin" : 	_agolHost + "/home/signin.html",
		"agolProfile" :  "/home/user.html",
		"agolHelp" :  	 "/home/support.html",
		"agolSignout" :  "https:" + _agolHost + "/sharing/rest/oauth2/signout",

		"mkpSignin" : 	_mkpHost + "/signin.html",
		"mkpConsole" : 	_mkpHost + "/console.html",
		"mkpSearch" : 	_mkpHost + "/search.html",

        "searchUrl" : 	_searchHost + "/v3/index.cfm",

		"searchIfc" : "arcgis_doc_ifce",
	  	"searchView" : "arcgis_doc_vw"

	};
