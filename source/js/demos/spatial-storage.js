require(["dojo/on","dojo/query","esri/map","esri/layers/graphics","esri/layers/FeatureLayer"],function(e,t){function s(){if(n)return;i.addClass("visible").removeClass("hidden");var e=new esri.InfoTemplate("${NAME}, ${COUNTRY}"," Population: ${POPULATION}");n=new esri.layers.FeatureLayer("https://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0",{mode:esri.layers.FeatureLayer.MODE_ONDEMAND,outFields:["*"],opacity:.9,infoTemplate:e});var t=u("/img/blue-dot-small.png",0,0,7);n.renderer=new esri.renderer.SimpleRenderer(t);var s=u("/img/red-dot-small.png",0,0,10);n.setSelectionSymbol(s),r.addLayer(n),dojo.connect(n,"onSelectionComplete",function(e){var t;for(var n=0;n<e.length;n++)t?t.union(e[n]._extent):t=e[n]._extent;t&&r.setExtent(t),i.addClass("hidden").removeClass("visible")});var o=document.getElementById("searchBySQL");o.disabled=!1}function o(){if(!n){a("Please add the Cities data first!");return}r.infoWindow.hide(),i.addClass("visible").removeClass("hidden");var e=document.getElementById("searchBySQL"),t=e.options[e.selectedIndex].value,s=new esri.tasks.Query;s.where=t,n.selectFeatures(s,esri.layers.FeatureLayer.SELECTION_NEW)}function u(e,t,n,r){return new esri.symbol.PictureMarkerSymbol({angle:0,xoffset:t,yoffset:n,type:"esriPMS",url:e,contentType:"image/png",width:r,height:r})}function a(e){var t=document.getElementById("userMessage");t.innerHTML=e}function f(e,t){var n=document.getElementById(e);n&&(n.className=t)}t("#searchBySQL").on("change",o);var n,r=new esri.Map("spatial-storage-demo",{basemap:"gray",center:[0,45],zoom:3,minZoom:2});r.on("load",function(){r.disableMapNavigation(),r.enableRubberBandZoom(),r.enableDoubleClickZoom(),r.enablePan(),s()}),r.on("click",function(){if(!r.infoWindow)return;r.infoWindow.hide()});var i=t(".spatial-storage-demo #progress");i.addClass("visible"),dojo.connect(r,"onUpdateStart",function(){i.addClass("visible").removeClass("hidden")}),dojo.connect(r,"onUpdateEnd",function(){i.addClass("hidden").removeClass("visible")})});