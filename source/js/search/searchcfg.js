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
            r:"search-collection:help|search-collection:forums", 
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
          r:"search-collection:forums",
		  p:""
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
            p:"product:android-app|product:ios-app|product:win-phone-app|product:collector-android|product:collector-ios|product:esri-maps-office|product:esri-maps-sharepoint|product:esri-maps-sharepoint-beta|product:ops-dashboard|product:ops-dashboard-browser|product:arcgis-online|product:explorer-ipad|product:explorer-iphone|product:explorer-mac|product:explorer-android-phone|product:explorer-android-tablet|product:esri-demographics|product:arcgis-geoplanner|product:arcgis-open-data|product:web-appbuilder|product:data-appl"
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
        k:"collector-android",
        q: {
          r:"",
          p:"(product:collector-android)"
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
        k:"collector-ios",
        q: {
          r:"",
          p:"(product:collector-ios)"
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
        k:"esri-maps-office",
        q: {
          r:"",
          p:"(product:esri-maps-office)"
        }
      },
      {
        k:"esri-maps-sharepoint",
        q: {
          r:"",
          p:"(product:esri-maps-sharepoint)"
        }
      },
	  {
        k:"esri-maps-sharepoint-beta",
        q: {
          r:"",
          p:"(product:esri-maps-sharepoint-beta)"
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
          r:"",
          p:"(product:ops-dashboard)"
        }
      },
	  {
        k:"web-appbuilder",
        q: {
          r:"",
          p:"(product:web-appbuilder)"
        }
      },

    ]
  }
  ]
};
