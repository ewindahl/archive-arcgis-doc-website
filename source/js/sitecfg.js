/*
var host = "http://marketplacedevext.arcgis.com",
    searchHost = "http://searchdev.esri.com",
*/

var host = "http://marketplace.arcgis.com",
    searchHost = "http://searchdev.esri.com",
    //searchHost = "http://search.esri.com",
    sitecfg = {
	  	"debug" : false,

		"mkpSignin" : 	host + "/signin.html",
		"mkpConsole" : 	host + "/console.html",
		"mkpSearch" : 	host + "/search.html",

        "searchUrl" : searchHost + "/v3/index.cfm",

		"searchIfc" : "arcgis_doc_ifce",
	  	"searchView" : "arcgis_doc_vw"


//		"searchIfc" : "resourcesbeta",
//	  	"searchView" : "resourcesbeta"
	};
