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
      "collection" : "help", 
    },

    //for apps
    "default" : {
      "collection" : "all", 
      "product" : "any",      
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
            r:"search-collection:help", 
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
      {
        k:"forums",
        q:{
          r:"",
          s:"forums_jive",
		      pForums:""
        }
      },
      /* 
      {
        k:"videos",
        q:{
          r:"search-collection:videos"
        }
      },

      {
        k:"blogs",
        q:{
          r:"search-collection:blogs"
        }
      }
      */
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
            p:"product:android-app|product:ios-app|product:win-phone-app|product:collector-android|product:collector-ios|product:esri-maps-office|product:esri-maps-sharepoint|product:ops-dashboard|product:arcgis-online|product:explorer-ipad|product:explorer-iphone|product:explorer-mac|product:esri-demographics|product:arcgis-geoplanner",
            pForums:"keywords:app|keywords:android|keywords:ios|keywords:windows phone|keywords:collector|keywords:maps for office|keywords:maps for sharepoint|keywords:dashboard||keywords:operations dashboard|keywords:explorer|keywords:iphone|keywords:ipad|keywords:geoplanner|keywords:demographics|keywords:open-data"
          }
      },
	  {
        k:"arcgis-online",
        q: {
          r:"",
          p:"(product:arcgis-online)",
          pForums:"(keywords:Arcgis Online|keywords:Online|keywords:trust|keywords:open data)"
        }
      }, 
      {
        k:"android-app",
        q: {
          r:"",
          p:"(product:android-app)",
          pForums:"(keywords:android|keywords:ArcGIS app)"
        }
      },
      {
        k:"ios-app",
        q: {
          r:"",
          p:"(product:ios-app)",
          pForums:"(keywords:ios|keywords:ArcGIS app)"
        }
      }, 
      {
        k:"win-phone-app",
        q: {
          r:"",
          p:"(product:win-phone-app)",
          pForums:"(keywords:Windows Phone|keywords:ArcGIS app)"
        }
      },
      {
        k:"collector-android",
        q: {
          r:"",
          p:"(product:collector-android)",
          pForums:"(keywords:android|keywords:Collector)"
        }
      },

      {
        k:"collector-ios",
        q: {
          r:"",
          p:"(product:collector-ios)",
          pForums:"(keywords:ios|keywords:Collector)"
        }
      },
	  {
        k:"esri-demographics",
        q: {
          r:"",
          p:"(product:esri-demographics)",
          pForums:"(keywords:demographics)"
        }
      },
	  {
        k:"explorer-ipad",
        q: {
          r:"",
          p:"(product:explorer-ipad)",
          pForums:"(keywords:explorer|keywords:ipad)"
        }
      },
	  {
        k:"explorer-iphone",
        q: {
          r:"",
          p:"(product:explorer-iphone)",
          pForums:"(keywords:explorer|keywords:iphone)"
        }
      },
	  {
        k:"explorer-mac",
        q: {
          r:"",
          p:"(product:explorer-mac)",
          pForums:"(keywords:explorer|keywords:mac)"
        }
      },
	  {
        k:"arcgis-geoplanner",
        q: {
          r:"",
          p:"(product:arcgis-geoplanner)",
          pForums:"(keywords:geoplanner)"
        }
      },
      {
        k:"esri-maps-office",
        q: {
          r:"",
          p:"(product:esri-maps-office)",
          pForums:"(keywords:maps for office|keywords:office)"
        }
      },
      {
        k:"esri-maps-sharepoint",
        q: {
          r:"",
          p:"(product:esri-maps-sharepoint)",
          pForums:"(keywords:sharepoint|keywords:maps for sharepoint)"
        }
      },
      /*{
        k:"ops-dashboard-browser",
        q: {
          r:"",
          p:"(product:ops-dashboard-browser)"
        }
      },*/
	  {
        k:"ops-dashboard",
        q: {
          r:"",
          p:"(product:ops-dashboard)",
          pForums:"(keywords:operations|keywords:dashboard)",
          pForums:"(keywords:dashboard|keywords:operations dashboard)"
        }
      },

    ]
  }
  ]
};
