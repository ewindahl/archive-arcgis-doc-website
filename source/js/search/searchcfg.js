/*

k: url query parameter
l: url query parameter label
v: url query possible values 

v.k=parameter value
v.q=query
v.q.r = requiredfields
v.q.p = partialfields

*/

//todo: these cfg should be site specific

var filterCfgDefaults = {

    "marketplace" : {
      "collection" : "help"
    },

    //for apps
    "default" : {
      "collection" : "all", 
      "product" : "any"      
    }
};


var filterCfg = {
  
  "marketplace" : [
  {
    "k" : "collection",
    "l" : "collection",
    "v" : [
      {
        k:"help",
        q:{
            r:"search-collection:help",
            p:"product:marketplace"
            //p:"product:"
        }
      }
    ]
  }
  ],

  //for apps
  "default" : [
  {
    "k" : "collection",
    "l" : "collection",
    "v" : [
      {
        k:"all",
        q: {
            r:"search-collection:help|search-collection:blogs", 
            p:""
        }
      }, 
      {
        k:"help",
        q:{
            r:"search-collection:help",
            p:""
        }
      },
      /*{
        k:"forums",
        q:{
          r:"search-collection:forums",
  		  p:""
        }
      }
       
      {
        k:"videos",
        q:{
          r:"search-collection:videos"
        }
      },*/

      {
        k:"blogs",
        q:{
          r:"search-collection:blogs",
          sort:"date:D:S:d1" //sort by date descending
        }
      }
      
    ]
  },

  {
    "k" : "product",
    "l" : "product",
    "v" : [
      {
        k:"any",
        q:{
            r:"",
            p:"product:android-app|product:ios-app|product:win-phone-app|product:collector-android|product:collector-ios|product:collector-windows|product:esri-maps-office|product:esri-maps-sharepoint|product:esri-maps-sharepoint-beta|product:ops-dashboard|product:ops-dashboard-browser|product:arcgis-online|product:explorer-ipad|product:explorer-iphone|product:explorer-mac|product:explorer-android-phone|product:explorer-android-tablet|product:esri-demographics|product:arcgis-geoplanner|product:arcgis-open-data|product:web-appbuilder|product:data-appl|product:bus-analyst-online|product:community-analyst|product:esri-maps-cognos|product:esri-maps-cognos-mobile|product:esri-maps-dynamics|product:esri-maps-micro|product:esri-maps-sapbobj|product:esri-maps-salesforce|product:appstudio|product:navigator-iphone|product:navigator-ipad|product:living-atlas|product:arcgis-earth"
          }
      },
	  {
        k:"appstudio",
        q: {
          r:"",
          p:"(product:appstudio)"
        }
      },
      {
        k:"arcgis-earth",
        q: {
          r:"",
          p:"(product:arcgis-earth)"
        }
      },  
	  {
        k:"arcgis-online",
        q: {
          r:"",
          p:"(product:arcgis-online)"
        }
      }, 
      {
        k:"arcgis-open-data",
        q: {
          r:"",
          p:"(product:arcgis-open-data)"
        }
      }, 
	  {
        k:"android-app",
        q: {
          r:"",
          p:"(product:android-app)"
        }
      },
      {
        k:"ios-app",
        q: {
          r:"",
          p:"(product:ios-app)"
        }
      }, 
      {
        k:"win-phone-app",
        q: {
          r:"",
          p:"(product:win-phone-app)"
        }
      },
      {
        k:"bus-analyst-online",
        q: {
          r:"",
          p:"(product:bus-analyst-online)"
        }
      },
      {
        k:"collector-android",
        q: {
          r:"",
          p:"(product:collector-android)"
        }
      },
	   {
        k:"collector-ios",
        q: {
          r:"",
          p:"(product:collector-ios)"
        }
      },
      {
        k:"collector-windows",
        q: {
          r:"",
          p:"(product:collector-windows)"
        }
      },
		{
        k:"community-analyst",
        q: {
          r:"",
          p:"(product:community-analyst)"
        }
      },
		{
        k:"community-maps",
        q: {
          r:"",
          p:"(product:community-maps)"
        }
      },
	   {
        k:"data-appl",
        q: {
          r:"",
          p:"(product:data-appl)"
        }
      },
	    {
        k:"esri-demographics",
        q: {
          r:"",
          p:"(product:esri-demographics)"
        }
      },
	  {
        k:"explorer-android-phone",
        q: {
          r:"",
          p:"(product:explorer-android-phone)"
        }
      },
	  {
        k:"explorer-android-tablet",
        q: {
          r:"",
          p:"(product:explorer-android-tablet)"
        }
      },
	  {
        k:"explorer-ipad",
        q: {
          r:"",
          p:"(product:explorer-ipad)"
        }
      },
	  {
        k:"explorer-iphone",
        q: {
          r:"",
          p:"(product:explorer-iphone)"
        }
      },
	  {
        k:"explorer-mac",
        q: {
          r:"",
          p:"(product:explorer-mac)"
        }
      },
	  {
        k:"arcgis-geoplanner",
        q: {
          r:"",
          p:"(product:arcgis-geoplanner)"
        }
      },
      {
        k:"living-atlas",
        q: {
          r:"",
          p:"(product:living-atlas)"
        }
      },
      {
        k:"esri-maps-cognos",
        q: {
          r:"",
          p:"(product:esri-maps-cognos)"
        }
      },
      {
        k:"esri-maps-cognos-mobile",
        q: {
          r:"",
          p:"(product:esri-maps-cognos-mobile)"
        }
      },
      {
        k:"esri-maps-dynamics",
        q: {
          r:"",
          p:"(product:esri-maps-dynamics)"
        }
      },
      {
        k:"esri-maps-micro",
        q: {
          r:"",
          p:"(product:esri-maps-micro)"
        }
      },
      {
        k:"esri-maps-office",
        q: {
          r:"",
          p:"(product:esri-maps-office)"
        }
      },
      {
        k:"esri-maps-salesforce",
        q: {
          r:"",
          p:"(product:esri-maps-salesforce)"
        }
      },
      {
        k:"esri-maps-sapbobj",
        q: {
          r:"",
          p:"(product:esri-maps-sapbobj)"
        }
      },
      {
        k:"esri-maps-sharepoint",
        q: {
          r:"(product:esri-maps-sharepoint)",
          p:""
        }
      },
	  {
        k:"esri-maps-sharepoint-office365",
        q: {
          r:"",
          p:"(product:esri-maps-sharepoint-office365)"
        }
      },
		{
        k:"navigator-ipad",
        q: {
          r:"",
          p:"(product:navigator-ipad)"
        }
      },
		{
        k:"navigator-iphone",
        q: {
          r:"",
          p:"(product:navigator-iphone)"
        }
      },
      {
        k:"ops-dashboard-browser",
        q: {
          r:"",
          p:"(product:ops-dashboard-browser)"
        }
      },
	  {
        k:"ops-dashboard",
        q: {
          r:"(product:ops-dashboard)",
          p:""
        }
      },
	  {
        k:"web-appbuilder",
        q: {
          r:"",
          p:"(product:web-appbuilder)"
        }
      }

    ]
  }
  ]
};
