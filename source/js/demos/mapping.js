require(["dojo/on","dojo/query","dojo/dom-attr","esri/map"],function(e,t,n){t(".thumbnail-holder button").on("touchend, click",function(e){var n=t(this),i=n.attr("data-basemap")[0];r.setBasemap(i)});var r=new esri.Map("mapping-demo",{basemap:"hybrid",center:[-6.171459,53.347831],zoom:11,minZoom:2});r.on("load",function(){r.disableMapNavigation(),r.enableRubberBandZoom(),r.enableDoubleClickZoom(),r.enablePan()})});