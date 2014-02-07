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
            p:"product:android-app|product:ios-app|product:win-phone-app|product:collector-android|product:collector-ios|product:esri-maps-office|product:esri-maps-sharepoint|product:ops-dashboard|product:arcgis-online"
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
        k:"collector-ios",
        q: {
          r:"",
          p:"(product:collector-ios)"
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
        k:"ops-dashboard",
        q: {
          r:"",
          p:"(product:ops-dashboard)"
        }
      },

    ]
  }
  ]
};