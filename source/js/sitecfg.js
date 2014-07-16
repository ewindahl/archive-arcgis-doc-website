/*
var host = "http://marketplacedevext.arcgis.com",
    searchHost = "http://searchdev.esri.com",
*/

var _agolHost = "//www.arcgis.com",
	_mkpHost = "//marketplace.arcgis.com",
    _searchHost = "//searchstg.esri.com",

    sitecfg = {
	  	"debug" : false,
	
	    "portalHostname" : _agolHost,

		"agolSignin" : 	_agolHost + "/home/signin.html",
		"agolProfile" :  "/home/user.html",
		"agolHelp" :  	 "/home/support.html",

		"mkpSignin" : 	_mkpHost + "/signin.html",
		"mkpConsole" : 	_mkpHost + "/console.html",
		"mkpSearch" : 	_mkpHost + "/search.html",

        "searchUrl" : 	_searchHost + "/v3/index.cfm",

		"searchIfc" : "forums_jive_ifce",//arcgis_doc_ifce",
	  	"searchView" : "forums_jive_vw", //arcgis_doc_vw"
	  	"includeForumResult" : true

	};
