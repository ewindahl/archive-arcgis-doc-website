function genPageNav() {
    var o = {
        update: function (gm) {
           

        },
        
    };

    return o;
}

function genDisplay() {

    var o = {

        _genContribInfo: function (row) {
            var v = { show: false };

            return v;
        },

        _getDisplayName: function(itemType,typeKeywords) {
          var typeKeywords = typeKeywords || [],
            displayName = itemType;

          if (itemType === "Feature Service" || itemType === "Feature Collection") {
            displayName = $.inArray("Table", typeKeywords) > -1 ? "Table" : "Feature Layer";
          } else if (itemType === "Image Service") {
            displayName = $.inArray("Elevation 3D Layer", typeKeywords) > -1 ? "Elevation Layer" : "Imagery Layer";
          } else if (itemType === "Scene Service") {
            displayName = "Scene Layer";
          } else if (itemType === "Stream Service") {
            displayName = "Feature Layer";
          } else if (itemType === "Microsoft Powerpoint") {
            // Unfortunately this was named incorrectly on server side, changing it there would result
            // in some issues
            displayName = "Microsoft PowerPoint";
          } else if (itemType === "GeoJson") {
            // Unfortunately this was named incorrectly on server side, changing it there would result
            // in some issues
            displayName = "GeoJSON";
          } else if (itemType === "Globe Service") {
            displayName = "Globe Layer";
          } else if (itemType === "Vector Tile Service") {
            displayName = "Tile Layer";
          } else if (itemType === "Map Service") {
            if ($.inArray("Hosted Service", typeKeywords) > -1 || $.inArray("Tiled", typeKeywords) > -1) {
              displayName = "Tile Layer";
            } else {
              displayName = "Map Image Layer";
            }
          }

          return displayName;
        },

        _getIconUrl: function (type,typeKeywords) {
            
          var itemType = (type)? type.toLowerCase() : "",
            typeKeywords = typeKeywords || [],
            imgDir = getTier(window.location.hostname).agolCdnBasePath + "esri/css/images/item_type_icons/",
            size = "16",  //for now we only support 16x16 pixel images
            isHosted = false,
            isTable = false,
            imgName;


          if (itemType.indexOf("service") > 0 || itemType === "feature collection" || itemType === "wms" || itemType === "wmts") {
            isHosted = $.inArray("Hosted Service", typeKeywords) > -1;
            if (itemType === "feature service" || itemType === "feature collection") {
              isTable = $.inArray("Table", typeKeywords) > -1;
              imgName = isTable ? "table" : (isHosted ? "featureshosted" : "features");
            } else if (itemType === "map service" || itemType === "wms" || itemType === "wmts") {
              imgName = (isHosted || $.inArray("Tiled", typeKeywords) > -1) ? "maptiles" : "mapimages";
            } else if (itemType === "scene service") {
              if ($.inArray("Line", typeKeywords) > -1) {
                imgName = "sceneweblayerline";
              } else if ($.inArray("3DObject", typeKeywords) > -1) {
                imgName = "sceneweblayermultipatch";
              } else if ($.inArray("Point", typeKeywords) > -1) {
                imgName = "sceneweblayerpoint";
              } else if ($.inArray("Integrated mesh", typeKeywords) > -1) {
                imgName = "sceneweblayermesh";
              } else if ($.inArray("PointCloud", typeKeywords) > -1) {
                imgName = "sceneweblayerpointcloud";
              } else if ($.inArray("Polygon", typeKeywords) > -1) {
                imgName = "sceneweblayerpolygon";
              } else {
                imgName = "sceneweblayer";
              }
            } else if (itemType === "image service") {
              imgName = $.inArray("Elevation 3D Layer", typeKeywords) > -1 ? "elevationlayer" : "imagery";
            } else if (itemType === "stream service") {
              imgName = "streamlayer";
            } else if (itemType === "vector tile service") {
              imgName = "vectortile";
            } else if (itemType === "datastore catalog service") {
              imgName = "datastorecollection";
            } else {
              imgName = "layers";
            }
          } else if (itemType == "web map" || itemType == "cityengine web scene") {
            imgName = "maps";
          } else  if (itemType == "web scene") {
            imgName = $.inArray("ViewingMode-Local", typeKeywords) > -1 ? "webscenelocal": "websceneglobal";
          } else if (itemType == "web mapping application" || itemType == "mobile application" || itemType == "application" ||
            itemType == "operation view" || itemType == "desktop application") {
            imgName = "apps";
          } else if (itemType === "map document" || itemType === "map package" || itemType === "published map" || itemType === "scene document" ||
            itemType === "globe document" || itemType === "basemap package" || itemType === "mobile basemap package" || itemType === "mobile map package" ||
            itemType === "project package" || itemType === "project template" || itemType === "pro map" || itemType === "layout" ||
            (itemType === "layer" && $.inArray("ArcGIS Pro", typeKeywords) > -1) || (itemType === "explorer map" && $.inArray("Explorer Document", typeKeywords))) {
            imgName = "mapsgray";
          } else if (itemType === "service definition" || itemType === "csv" || itemType === "shapefile" || itemType === "cad drawing" || itemType === "geojson") {
            imgName = "datafiles";
          } else if (itemType === "explorer add in" || itemType === "desktop add in" || itemType === "windows viewer add in" || itemType === "windows viewer configuration") {
            imgName = "appsgray";
          } else if (itemType === "rule package" || itemType === "file geodatabase" || itemType === "csv collection" || itemType === "kml collection" ||
            itemType === "windows mobile package" || itemType === "map template" || itemType === "desktop application template" ||
            itemType === "arcpad package" || itemType === "code sample" || itemType === "form" || itemType === "document link" || itemType === "tile package" || itemType === "vector tile package" || itemType === "scene package" ||
            itemType === "operations dashboard add in" || itemType === "rules package" || itemType === "image" || itemType === "workflow manager package" ||
            itemType === "desktop style" || (itemType === "explorer map" && $.inArray("Explorer Mapping Application", typeKeywords) > -1 || $.inArray("Document", typeKeywords) > -1)) {
            imgName = "datafilesgray";
          } else if (itemType === "geocoding service" || itemType === "network analysis service" || itemType === "geoprocessing service" ||
            itemType === "geodata service" || itemType === "geometry service" || itemType === "geoprocessing package" ||
            itemType === "locator package" || itemType === "geoprocessing sample" || itemType === "workflow manager service" || itemType === "raster function template") {
            imgName = "toolsgray";
          } else if (itemType === "layer" || itemType === "layer package" || itemType === "explorer layer") {
            imgName = "layersgray";
          } else if (itemType === "scene package") {
            imgName = "scenepackage";
          } else if (itemType === "tile package") {
            imgName = "tilepackage";
          } else if (itemType === "task file") {
            imgName = "taskfile";
          } else if (itemType === "report template") {
            imgName = "report-template";
          } else if (itemType === "statistical data collection") {
            imgName = "statisticaldatacollection";
          } else if (itemType === "route layer") {
            imgName = "routelayer";
          } else {
            imgName = "maps";
          }

          return (imgName) ? imgDir + imgName + size + ".png" : null;
        },
		  
        display1: function (obj, i, row, buf, col) {
            var itemID = row.agolId();
            var imgurl = row.agolImgUrl(itemID);
            var v = obj._genContribInfo(row);
            var targetUrl = row.agolItemUrl(itemID);
            var itemTitle = row.data["title"] || "n/a";
            var typeIconPath = obj._getIconUrl (row.getType(), row.getTypeKeywords())
            var typeDisplayName = obj._getDisplayName (row.getType(),row.getTypeKeywords())
            
            if (itemTitle.length > 40 ) {  
                itemTitle = itemTitle.substr(0,40) + " ...";
            }

            if(col && col == "demographics"){
                targetUrl = targetUrl + "&subType=demographics";
            } else if(col == "storymaps"){
                targetUrl = targetUrl + "&subType=storymaps";
            }

            if(row.isLoginRequires()){
                if(!$.cookie('esri_auth') || !sitecfg.isValidToken){
                    targetUrl = getTier(window.location.hostname).agolHost + "/home/signin.html?returnUrl="+encodeURIComponent(targetUrl);
                }
            }

            buf.push("<li class='item'>");
                        
            if (v.show) {
                buf.push("<a href='" + targetUrl + "'  class='item-contrib " + v.css + " '>" + v.label + "</a>");
            }

            buf.push("<a target='_blank' href='" + targetUrl + "'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");
            buf.push("<a class='item-title' target='_blank' title='" + row.data["title"] + "' href='" + targetUrl + "'>");
            buf.push(itemTitle);
            buf.push("</a>");
            buf.push("<span class='ownerName'>By <a href='JavaScript:void(0);' class='ownerNameLnk'>"+row.data["owner"]+"</a></span>");

           //console.log(typeIconPath);
            if(typeIconPath){
                buf.push("<span class='itemTypeIcon'><img class='grid-item-icon' src='" + typeIconPath + "' title='" + typeDisplayName + "'></span>");
            }

            var itemType = row.ContentType();
            if(itemType.hasOwnProperty('label')){
                buf.push("<span class='premiumItem'><img class='esri-premium-icon' src='" + itemType['img'] + "' title='"+itemType['title']+"'></span>");
            }
            buf.push("</li>");

        },


        update: function (gm) {
            try {
                if (gm.sedata.hasError === "true") {
                    $("#gl-content").html(gm.sedata.errMsg);
                } else {
                    var buf = [];
                    var o = this;

                    var displayFunc = {
                        1: this.display1,
                        2: this.display2,
                        3: this.display3
                    }[gm.display];


                    if (gm.sedata.rowL.length > 0) {
                        buf.push("<ul id='gl-content-ul'>");
                        $.each(gm.sedata.rowL, function (i, val) {
                            displayFunc(o, gm.startN + i, new SERow(val), buf, gm.col);
                        });
                        //buf.push("<li class='item' id='more-item'><div class='item-img see-more'>There's more. Click to load the next page.</div></li>");
                        buf.push("<li class='item more-spinner' style='display: none'><img alt='loading' src='/img/gallery/ajax-loader.gif'></li>");
                        buf.push("</ul>");
                        
                        
                        if($("#gl-content").length > 0){
                            $(".more-spinner").css("display","none");
                            $("#gl-content").append(buf.join(""));
                        }else{
                            $("#gl-content").html(buf.join("")).removeClass().addClass("display" + gm.display);
                        }
                    } else {
                        var errMsg = [];
                        var msg = (gm.type == "All")? "<p>Sorry. No results found.</br>The Living Atlas doesn’t contain any items that match that search term.</p><p>To find content, try entering a new search term or browse the themes of the atlas.</p>":"<p>Sorry. No results found.</br>Choose 'All' under Themes to view Living Atlas items.</p>"
                        errMsg.push("<div class='gl-content-errMsg'>")
                        errMsg.push(msg)
                        errMsg.push("</div>");
                        $("#gl-content").html(errMsg.join(""));
                    }
                }

            } catch (ex) {
                debug(ex.message);
                $("#gl-content").html(gcfg.errorMsg);

            }

            // Re-enable checkbox.
            $('input[type=checkbox]').prop('disabled',false);
        },

        populateProfilePopup: function(agolHost,data){

          if(!data.error){
            $(".profilePopup .spinner").hide();
            var usrThumbnailPath = (data.thumbnail)?agolHost+"/sharing/rest/community/users/"+data.username+"/info/"+data.thumbnail:"";
            
            $(".profilePopup .profileDetails").removeClass("hide");
            if(usrThumbnailPath != ""){
              $(".profilePopup .itemThumbnailContainer").html('<img src="'+usrThumbnailPath+'" class="profileThumbnail">');
            }
            $(".profilePopup .profileThumbnail").attr("src",usrThumbnailPath);
            $(".profilePopup .profile-name").text(data.fullName);
            
            var desc = (data.description)?data.description:"This user has not provided any personal information."
            $(".profilePopup .profile-content").html(desc);

             $(".profilePopup .profileLink").attr("href",agolHost+"/home/user.html?user="+data.username);
             $(".profilePopup .profileItemsLink").attr("href",agolHost+"/home/search.html?q=owner:"+data.username);
            $(".profilePopup .profileGroupLink").attr("href",agolHost+"/home/search.html?t=groups&q=owner:"+data.username);
          }

        }
    };

    return o;
}

