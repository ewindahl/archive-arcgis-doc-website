/* TODO:

back button - history management
window.onhashchange

--
refactoring:
    use mvc/observer pattern - bind/trigger + custom event?
    prefix $ to jquery obj
    model's genViewData should be a functor
    filters should be a separate display object with its own model?(a component of shell)

add transition effect when switching display type
--


*/



function debug(v) {
    //console.info(v);
};

function genGalleryModel(hash, mdfL) {

    var o = new GalleryModel(mdfL);
    o.init(hash);
    return o;


    function GalleryModel(mdfL) {
        this.startN = 0;
        this.numN = gcfg.numN;
        this.maxN = 0;
        this.sedata = null;
        this.query = ""; //decoded value
        this.mdf = {}; //metadata filter
        this.tier = getTier(window.location.hostname);

        this.display = 1; //display type
		this.clearAll = false;
		this.col = "All"; //decoded value
        this.type = "All";
        this.area = "All";
        this.rgnCode = null;
        this.npp = gcfg.numN;
        this.subCat = 0;
        this.agolHost = getTier(window.location.hostname).agolHost;
        this.userSessionObj = ($.cookie('esri_auth') && sitecfg.isValidToken) ? JSON.parse($.cookie('esri_auth')) : {};
        this.groupIds = null;
        this.regionCode = "WO";
        this.defaultRgnCode = "";
        //this.userToken = this.getToken ();

        this.init = function (hash) {
            this._initMDF(mdfL);
            //this.getAgolHost ();
            if (hash) {
                this.updateByHash(hash);
            }
        }

        this._initMDF = function (mdfL) {
            var i = mdfL.length,
                vals = null;

            while (i--) {
                var vals = mdfL[i].split(":");
                if(this.clearAll && ($("#preFilter") && $("#preFilter").val() == vals[0])){
					// reset back clearAll to false
					this.clearAll = false;
				}else{
					this.mdf[vals[0]] = { len: parseInt(vals[1], 10), state: "" };
				}
            }
        }

        this.clearMDF = function () {
			this.clearAll = true;
            this._initMDF(gcfg.mdfL);
        }

        this.genViewData = function () {
            var o = {
                hash: this._genHash(),
                //ajaxData: this._genAjaxData(),
            };

            return o;
        }

        this.getToken = function () {
            return (this.userSessionObj.token)?this.userSessionObj.token : null;
        }

        this.getAgolHost = function () {
            this.agolHost = (this.userSessionObj.urlKey)?"https://"+this.userSessionObj.urlKey+ "." +this.userSessionObj.customBaseUrl : this.agolHost;
        }

        this.userAccountType = function () {
            return (this.userSessionObj.urlKey)?"org" : "public";
        }


        this.genAJaxParamData = function () {
            var o = {
                ajaxData: this._genAjaxData(),
            };

            return o;
        }

        this.updateSEData = function (sedata) {
            this.sedata = sedata;
            this.startN = sedata.startI - 1;
            this.maxN = sedata.estN; //gsa: only return first 1000
        }


        this.updateByHash = function (hash) {
            var o = this._parseHash(hash);

            if (o.s) {
                this.startN = parseInt(o.s, 10);
                if (isNaN (this.startN)) {
                    this.startN = 0;
                }
            } else {
                this.startN = 0;
            }

            if (o.n) {
                this.numN = parseInt(o.n, 10);
                if (isNaN(this.numN)) {
                    this.numN = gcfg.numN;
                }
            } else {
                this.numN = gcfg.numN;
            }

            if (o.q) {
                this.query = decodeURIComponent(o.q);
            } else {
                this.query = "";
            }
			if (o.col) {
                this.col = decodeURIComponent(o.col);
            } else {
                this.col = "";
            }
            if (o.type) {
                this.type = decodeURIComponent(o.type);
            } else {
                this.type = "All";
            }

            if (o.area) {
                this.area = decodeURIComponent(o.area);
            } else {
                this.area = "All";
            }

            if (o.rgnCode) {
                this.rgnCode = decodeURIComponent(o.rgnCode);
                this.area = "regional"
            } else {
                this.rgnCode = null;
            }
            

            if (o.md) {
                this._setMdf(o.md);
            } else {
                this._initMDF(gcfg.mdfL);
            }

            if (o.subCat) {
                this.subCat = o.subCat;
            } else {
                this.subCat = 0;
            }

            

            if (o.d) {
                this.display = parseInt(o.d, 10);
                if (isNaN(this.display)) {
                    this.display = gcfg.displayType;
                }
            } else {
                this.display = gcfg.displayType;
            }
        }


        this.updateByFilter = function () {

            for (var key in this.mdf) {
                if (this.mdf.hasOwnProperty(key)) {
                    var binaryL = [];
                    var n = 0;
                    for (var i = 1, len = 1 + this.mdf[key].len; i < len; i++) {
                        if ($("#filters input:checkbox[name=" + key + "-" + (i) + "]:checked").length) {
                            binaryL.push("1");
                            n = n + 1;
                        } else {
                            binaryL.push("0");
                        }
                    }

                    if (n > 0) {
                        this.mdf[key].state = binaryL.join("");
                    } else {
                        this.mdf[key].state = "";
                    }
                }
            }

            this.startN = 0;
        }

        this.updateQuery = function () {
            this.query = $.trim($("#query").val());
            this.startN = 0;
        }
		
		this.updateCollection = function (col) {
            this.col = col;
			
			var valL = col.split(":");
			var mdf = this.mdf;
			for (var key in this.mdf) {
				if (key == valL[0]) {
					if (valL.length === 2) {
						var binaryL = [];
							for(i=1; i <= valL[1]; i++){
								//$("#filters input:checkbox[name="+valL[0]+"-"+i+"]").prop('checked',true);
								binaryL.push("1");
							}
						mdf[valL[0]].state = binaryL.join("");
					}
				}else{
					mdf[key].state = "";
				}
			}
			//console.log(mdf);
        }

        this.updateType = function (type) {
            this.type = type;
        }

        this.updateArea = function (area) {
            this.area = area;
        }

        this.updateRegionCode = function (rgnCode) {
            this.rgnCode = rgnCode;
        }

        this.updateSubCat = function (subCat) {
            this.subCat = subCat;
        }

        this.updateDisplayN = function (n) {
            var x = Math.max(1, n);
            x = Math.min(3, x);

            gcfg.cntL = gcfg.cntL || [15, 30, 45];
            if (x === 1) {
                this.numN = gcfg.cntL[0];
            } else if (x === 2) {
                this.numN = gcfg.cntL[1];
            } else if (x === 3) {
                this.numN = gcfg.cntL[2];
            } else {
                this.numN = gcfg.cntL[1];
            }

            this.startN = 0;
        }

        this.updateDisplay = function (n) {
            this.display = Math.max(1, n);
            this.display = Math.min(3, this.display);
        }

        this.gotoPage = function (x) {
            x = (x - 1) * this.numN;
            x = Math.min(this.maxN, x);
            this.startN = Math.max(0, x);
        }

        this.inc = function () {
            this.startN = Math.min(this.maxN, (this.startN+1) + this.numN);
        }

        this.dec = function () {
            this.startN = Math.max(0, this.startN - this.numN);
        }

        this.updatePagination = function (n) {
            this.startN = n || 0;
        }

        this._setMdf = function (val) {
            //val  = search-collection:110_search-category:100
            var mdf = this.mdf;
            $.each(val.split("_"), function (i, val) {
                var valL = val.split(":");
                if (valL.length === 2) {
                    if (mdf.hasOwnProperty(valL[0])) {
                        mdf[valL[0]].state = valL[1].substr(0, mdf[valL[0]].len);
                    }
                }
            });
            //this.startN = 0;

        }

        this._parseHash = function (hash) {
            //hash = #s=startN&n=numN&q=query&md=mdf

            var o = {};
            hash = $.trim(hash.substr(1));
            $.each(hash.split("&"), function (i, val) {
                var valL = val.split("=");
                if (valL.length === 2) {
                    o[valL[0]] = valL[1];
                } else {
                    o[valL[0]] = "";
                }
            });
            return o;
        },

        this._getAgolPrefRegion = function () {
                var ckObj =  ($.cookie('esri_auth') && sitecfg.isValidToken) ? JSON.parse($.cookie('esri_auth')) : false
                return (ckObj)?ckObj.region : null;
        },

        this._genHash = function () {
            //s=startN&n=numN&filter=0&q=query&md=mdf
            function mdf2str(mdf) {
                var l = []
                for (key in mdf) {
                    if (mdf.hasOwnProperty(key)) {
                        if (mdf[key].state) {
                            l.push(key + ":" + mdf[key].state);
                        }
                    }
                }
                return l.join("_");
            }

            var l = [];

            l.push("s=" + this.startN);
            l.push("subCat=" + this.subCat);
            l.push("type=" + this.type);
            l.push("area=" + this.area);
            if (this.rgnCode && this.area != "world" & this.area != "All"){
                l.push("rgnCode=" + this.rgnCode);
            }
            

            if (this.query) {
                l.push("q=" + encodeURIComponent(this.query));
            }
            var mdstr = mdf2str(this.mdf);
            if (mdstr) {
                l.push("md=" + mdstr);
            }
            return l.join("&");
        }

        this._genAjaxData = function (opt) {

            function _genTags(mdf) {
                var l = [];

                for (key in mdf) {
                    if (mdf.hasOwnProperty(key)) {
                        var state = mdf[key].state;
                        if (state) {
                            var vL = []
                            for (var i = 0, len = mdf[key].len; i < len; i++) {
                                if (state.charAt(i) === "1") {
                                    v = $("#filters input:checkbox[name=" + key + "-" + (i + 1) + "]").val();
                                    if (v) {
                                        $.each(v.split(" or "), function(k, sv){
                                          vL.push('tags' +  ':"' + sv + '"');
                                        });
                                        
                                    }
                                }
                            }
                            if (vL.length) {
                                l.push("(" + vL.join(" OR ") + ")");
                            }
                        }
                    }
                }
                return l.join(".");
            }

            function _getRegionalGroups(groupIds) {

                var l = [];
                if(groupIds) {
                    $.each(groupIds.split(","), function (i, val) {
                        l.push('group:"' + val +'"');
                    });
                    
                    return l.join(" OR ");
                }
                return ""
            }

            function _genQueryFieldsForGalleryType(galleryType) {
                var l = [];
                var returnQuery = "";
                if(galleryType != "All"){
                     //exclude all other types like arcgis.com is doing

                     var nl = [];
                     $.each(galleryTypeExcludeList, function (i, val) {
                        if(i == galleryType) {
                            $.each(val, function (j, sVal) {
                                nl.push('-type:"' + sVal + '"');
                            });
                        }
                     });
                     if (nl.length) {
                        returnQuery = nl.join(" ");
                     }

                     // Get the selected types
                     var types = galleryTypeList[galleryType];

                     $.each(types, function (i, val) {
                        l.push('type:"' + val + '"');
                     });

                     if (l.length) {
                        //return "(" + l.join(" OR ") + ")";
                        if(galleryType == "tool" ||  galleryType == "document"){
                            returnQuery = returnQuery + ' (typekeywords:"' + galleryType + '" OR ' + l.join(" OR ") + ')';
                        }else{
                            returnQuery = returnQuery + ' (' + l.join(" OR ") + ')';
                        }
                     }




                     /*if (l.length) {
                        returnQuery = returnQuery + " " + nl.join(" ");
                     }*/

                     return returnQuery;
                }
                return false;

            }

            /** -- **/

            var l = [];
            var qry = [];
           

			l.push("f=json");
            // Sort by date
			l.push("sortField=modified");
            l.push("sortOrder=desc");
            l.push("start=" + this.startN);
            l.push("num=" + this.numN);



            if (this.query) {
                //l.push("q=" + encodeURIComponent(this.query));
                qry.push(encodeURIComponent(this.query));
            }

            //var typePFields = _genPartialFieldsForGalleryType(this.type);
								
				//groups
            var groups = _getRegionalGroups(this.groupIds)
            qry.push("(" + groups + ")");

            var tags = _genTags(this.mdf);
            if (tags) {
                qry.push(tags);
            }

            /*if(this.userAccountType() == "org") {
                qry.push("orgid=" + this.userSessionObj.accountId);
            }*/

            var typePFields = _genQueryFieldsForGalleryType(this.type);
            if (typePFields){
                qry.push(typePFields)
            }

            /*if (this.getToken()){
                l.push("token=" + this.getToken());
            } else {
                qry.push('-type:"Service" AND -type: "Feature Collection" AND -type : "Shapefile"');
                
            }*/


            return l.join("&") + "&q=" + qry.join(" ");
        }


    }


}

function SEData(data) {

    //this.hasError = data.haserror;
    //this.errMsg = data.errormessage;

    //var jxon = getXMLData($.parseXML(data.content).documentElement);
    //var jxon = getXMLData($.parseXML(data.content).documentElement);

    this.estN = (typeof data === "undefined") ? 0 : parseInt (data.total);
    this.startI = (typeof data === "undefined") ? 0 : parseInt (data.start);
    this.endI = (typeof data === "undefined") ? 0 : parseInt (data.num);

    this.rowL = (typeof data.results === "undefined") ? [] :
                      ((data.results instanceof Array) ? data["results"] : [data["results"]]);


};
SEData.prototype.getRow = function (i) {
    return new SERow(this.rowL[i]);

    
};


function SERow(data) {
    this.data = data;
    
    //return this.data

}
/*SERow.prototype.md = function (key, dval) {
    return (this._md.hasOwnProperty(key) ? this._md[key] : dval) || dval;
};
SERow.prototype.val = function (key, dval) {
    return this.data.hasOwnProperty(key) ? this.data[key] : dval;
};
SERow.prototype.id = function () {
    return "test"
    return this.md("id", "");
};*/
SERow.prototype.agolId = function () {
    return this.data["id"];
};
SERow.prototype.agolItemType = function () {
    var itemType = this.data["type"] || "None";
	
	if (itemType !== "None") {
        itemType  = (itemType.match(/Application/gi)) ? "app" : "map";
    }
	return itemType;
};
SERow.prototype.isLoginRequires = function () {
    var typeKeywords = this.data["typeKeywords"] || false;
    
    if (typeKeywords) {
        typeKeywords  = (typeKeywords.indexOf("Requires Subscription") >=0 || typeKeywords.indexOf("Requires Credits") >=0) ? true : false;
    }
    
    return typeKeywords;
};
SERow.prototype.ContentType = function () {
    var typeKeywords = this.data["typeKeywords"] || false;
    var contentType = {};
    
    if (typeKeywords.indexOf("Requires Subscription") >=0) {
        contentType['label']  = "Subscriber Content";
        contentType['title']  = "Included with your ArcGIS Online subscription.";
        contentType['img']  = getTier(window.location.hostname).agolCdnBasePath + "js/jsapi/esri/css/images/item_type_icons/premiumitem16.png";
    } else if (typeKeywords.indexOf("Requires Credits") >=0) {
        contentType['label']  = "Premium Content";
        contentType['title']  = "Included with your ArcGIS Online subscription and consumes credits.";
        contentType['img']  = getTier(window.location.hostname).agolCdnBasePath + "js/jsapi/esri/css/images/item_type_icons/premiumcredits16.png";
    }
    
    return contentType;
};
SERow.prototype.getType = function () {
    return this.data["type"] || "None";
};
SERow.prototype.getTypeKeywords = function () {
    return this.data["typeKeywords"] || "None";
};
SERow.prototype.agolItemUrl = function (agolId) {
	return "http://" + window.location.hostname + "/en/living-atlas/item/?itemId=" + agolId;
};
SERow.prototype.agolImgUrl = function (agolId) {
		var imgf = (this.data["largeThumbnail"] && this.data["largeThumbnail"] != "") ? this.data["largeThumbnail"] : this.data["thumbnail"],
		imgurl = gcfg.emptyImgUrl,
		host = getTier(window.location.hostname).agolHost || "http://www.arcgis.com";

    if(imgf == null){
        imgurl = "http://static.arcgis.com/images/desktopapp.png";
    }else if (imgf !== "None") {
        imgurl = host + "/sharing/content/items/" + agolId + "/info/" + imgf;
        //console.info(imgurl);
    }

    return imgurl;
};

SERow.prototype.agolTargetUrl = function (itemURL) {
    var targetURL = this.data["url"] || null;

    if (targetURL == "None" || targetURL == null) {
        targetURL = itemURL ;
    }

	return targetURL;
};



function createGalleryShell() {
    var shell = {
        gm: null,
        display: null,
        pageNav: null,
        reloadCount: 0,

        init: function (gm) {
            if (gm.query) {
                $("#query").val(gm.query);
            }

            this._updateFilter(gm);

            //this.updateFeatured(gm);

        },

        updateHash: function (gm, vdata0) {
            var vdata = vdata0 || gm.genViewData();
            if (vdata.hash) {
                window.location.hash = vdata.hash;
            }

        },

        /*updateGeneralItem: function (gm) {
            this.gm = gm;

            var vdata = gm.genViewData();

            if (gm.query) {
                $("#query").val(gm.query);
            }

                       
            // REgular items
            $.ajax({
                url: gm.tier.gallery,
                dataType: "jsonp",
                context: this,
                data: vdata.ajaxData,
                timeout: 6000,
                beforeSend: function () {
                    //$("#gl-content").empty();
                    $("#spinner").show();
                },
                success: function (data) {
                    $("#spinner").hide();
                    this._updateModelAndView(data);
                    gm.queryStatus = "completed";
                },
                error: function (xhr, status, err) {
                    $("#gl-content").html(gcfg.errorMsg);
                    $("#spinner").hide();
                }
            });

        },*/


        updateRicky: function (){
            
                
        },
        update: function (gm) {
            //this.updateFeatured(gm);
            this.gm = gm;
            var gs = this

            $.ajax({
                type: "GET",
                url: gm. agolHost + "/sharing/rest/portals/self?f=json",
                //data: {"f":"json"},
                data: {},
                dataType: "jsonp"
            }).done(function (msg){
                regionCode = gm.rgnCode || gm._getAgolPrefRegion() || msg.ipCntryCode;
                gm.defaultRgnCode = gm._getAgolPrefRegion() || msg.ipCntryCode;

                if(regionCode == "WO"){
                   $(".world-showme-filter").hide()
                }else{
                    $(".world-showme-filter").show()
                }
                $("#countryName").text((conuntryCodeMapping[regionCode]) ? conuntryCodeMapping[regionCode]:regionCode)
                $("#countryName").attr("code",regionCode);
                                                         
                 /*
                 grouptype == all   then region+world
                 grouptype == "regional" then regional Only
                 grouptype == "world" then world only.*/
                 if(gm.area == "regional" && regionCode != "WO"){
                     ownerName = "(Esri_cy_" + regionCode +")"
                 } else if(gm.area == "world" || (gm.area == "regional" && regionCode == "WO")) {
                     ownerName = "(esri)"
                 }else{
                     ownerName = "(esri OR Esri_cy_" + regionCode +")"
                 }
                
              $.ajax({
                    type: "GET",
                    url: gm.agolHost + '/sharing/rest/community/groups',
                    data: {'f':'json', 'q':'tags:"gallery" AND owner:' + ownerName },
                    dataType: "jsonp",
                }).done(function (msg){

                var l = [];
                for (i = 0, len = msg.results.length; i < len; i++) {
                    l.push(msg.results[i].id);
                }
                gm.groupIds = l.join(",");


                // Main ajax call details
                var vHashdata = gm.genViewData();
                var vdata = gm.genAJaxParamData();

                if (gm.query) {
                    $("#query").val(gm.query);
                }

                gs.updateHash(gm, vHashdata);

                gs._updateFilter(gm);

            
                $.ajax({
                    url: gm.agolHost + "/sharing/rest/search" ,
                    dataType: "jsonp",
                    context: gs,
                    data: vdata.ajaxData,
                    //timeout: 10000,
                    //async: false,
                    beforeSend: function () {
                        $("#spinner").show();
                    },
                    success: function (data) {
                        $("#spinner").hide();
                        gs._updateModelAndView(data);
                        gs.reloadCount += 1
                        gm.queryStatus = "completed";
                        //this._setFeaturedData(data, this.gm);
                    },
                    error: function (xhr, status, err) {
                        $("#gl-content").html(gcfg.errorMsg);
                        $("#spinner").hide();
                    }
                });

            }); //end of done
        }); // End of 2nd done

        },

        _updateFilter: function (gm) {
            var mdf = gm.mdf,
                i = 0,
                len = 0;

            for (var key in mdf) {
                if (mdf.hasOwnProperty(key)) {
                    /* iterate thru the bit array and set the <input> state */
                    var state = mdf[key].state;
                    if (state) {
                        for (i = 0, len = state.length; i < len; i++) {
                            var selector = "#filters input:checkbox[name=" + key + "-" + (i + 1) + "]";
                            if (state.charAt(i) === "1") {
                                $(selector).attr("checked", "true");
                            }else{
                                $(selector).removeAttr("checked");
                            }
                        }
                    } else {
                        for (i = 0, len = mdf[key].len; i < len; i++) {
                            var selector = "#filters input:checkbox[name=" + key + "-" + (i + 1) + "]";
                            $(selector).removeAttr("checked");
                        }

                    }
                }
            }

            if(gm.subCat <= 0){
           //$("#filters .current").trigger('click');
                $("#filters input:checkbox").removeAttr('checked');
            }
        },

        updateDisplay: function () {
            if (this.display) {
                this.display.update(this.gm);
            }
        },

        _updateModelAndView: function (data) {

            var sedata = new SEData(data);
            

            this.gm.updateSEData(sedata);

            
            //this.gm.sedata.rowL = this.mergeData(this.gm,sedata);


            if (this.display === null) {
                this.display = genDisplay();
            }
            this.display.update(this.gm);

            if (this.pageNav === null) {
                this.pageNav = genPageNav();
            }
            this.pageNav.update(this.gm);
        },

        getProfileInfo: function (gm, username) {
            //this.updateFeatured(gm);
            this.gm = gm;
            var gs = this

            $.ajax({
                type: "GET",
                url: gm.agolHost + "/sharing/rest/community/users/" + username + "?f=json",
                data: {},
                dataType: "jsonp"
            }).done(function (data){
                gs.display.populateProfilePopup(gm.agolHost, data);
            });
        }

    }

    return shell;
}

$(document).ready(function () {

    /** init data model **/
    var gModel = null;
    var gShell = createGalleryShell();
    var mdfL = gcfg.mdfL; //metadata filter


    /** init event handler **/
   
    $("#query").bind({
        "keydown": function (evt) {
            if (evt.keyCode == "13") {
                $("#gl-content").empty();
                $("#spinner").show();

                gModel.updateQuery();
                gShell.update(gModel);

                evt.stopImmediatePropagation();
                //$("#search, #gl-search-btn").trigger('click');

                return false;
            }
        },
        "input": function (evt) {
            //trigger after removing the search keyword
            if($(this).val().length <= 0){
                $("#gl-cl-btn").hide()
                $("#gl-content").empty();
                $("#spinner").show();

                gModel.updateQuery();
                gShell.update(gModel);
                evt.stopImmediatePropagation();
            }
        },
        "focus": function (evt) {
            if ($(this).val() == $(this)[0].defaultValue) {
                $(this).val('');
            }
        },
        "keyup": function (evt) {
            var query = $(this).val()
            if (!query.trim()) {
                $("#gl-cl-btn").hide()
            } else {
                $("#gl-cl-btn").show()
            }
        }
    });

    $("#filters .ctrlbox").bind("change", function (evt) {
        $("#gl-content").empty();
        $("#spinner").show();
        gModel.updateByFilter();

        //Disable checkboxes until page is loaded completel
        $('input[type=checkbox]').prop('disabled',true);

		var totalSelectedCheckBox = $('input[type=checkbox]').filter(':checked').length;
		$(".filter-label").each(function (evt){
				if($(this).hasClass('current') && totalSelectedCheckBox <= 0){
					gModel.updateCollection($(this).attr("col"));
                    $("#filters input:checkbox").removeAttr('checked');
				}
		});
        if(totalSelectedCheckBox > 0){
            //Expose Reset button
            $(".current .reset-filter").css("display","block");
            gModel.updateSubCat(1);
        }else{
            $(".current .reset-filter").css("display","none");
            gModel.updateSubCat(0);
        }
        //gModel.updatePagination(0);
		gShell.update(gModel);
    });

    $("#search, #gl-search-btn").bind("click", function (evt) {
        $("#gl-content").empty();
        $("#spinner").show();

        gModel.updateQuery();
        gShell.update(gModel);

        evt.stopImmediatePropagation();
        return false;

        
    });

	

    $("#display1, #display2, #display3").bind("click", function (evt) {
        gModel.updateDisplay(parseInt(evt.target.id.slice("display".length), 10));
        gShell.updateHash(gModel);
        gShell.updateDisplay(gModel);

        //temp hack
        $("#display1, #display2, #display3").removeClass();
        $("#" + evt.target.id).addClass("displaytype_selected");

        evt.stopImmediatePropagation();
        return false;
    });

    

    $("#gl-content").on("click", "#more-item", function (evt) {
           var startNumber = $(this).attr("value");

            //gModel.updatePagination(startNumber);
            gShell.update(gModel);
           
                       
        evt.stopImmediatePropagation();
        return false;
        
    });
    


    $("#gl-filter-clear").bind("click", function (evt) {
        resetSearch(evt)
        gModel.clearMDF();
        gShell.update(gModel);
        evt.stopImmediatePropagation();
        return false;
    });
	
	$(".filter-label").bind("click", function (evt) {

        gModel.startN = 0;
		  $("#gl-content").empty();
        $("#spinner").show();
				
		/*if($(this).hasClass('current') && $(this).attr('col') != "All"){
			$(this).removeClass('current');
			gModel.updateCollection('All');
			$("#allCollections").addClass('current');
		}else{*/
			$(".filter-label").each(function (evt){
					$(this).removeClass('current');
				});
			$(this).addClass("current");
			gModel.updateCollection($(this).attr("col"));
		//}
			
		//gModel.updatePagination(0);
        gModel.updateSubCat(0);
        gShell.update(gModel);
		$("#filters input:checkbox").removeAttr('checked');
        $(".reset-filter").css("display","none");
		        
        evt.stopImmediatePropagation();
    });

    /* Show me section */
    $("#areaDropDown").bind("click", function (evt) {
        $("#menutreeArea").toggle('slow');
    });
    $("#typeDropDown").bind("click", function (evt) {
        $("#menutreeType").toggle('slow');
    });

    // Tablet/movile view related
    $(".tablet-theme-dropDown").bind("click", function (evt) {
        $("#navFilters").toggle('slow');
    });
    
    $("#menutreeArea .showme-filter-label").bind("click", function (evt) {
		 
		 gModel.startN = 0;
		 $("#gl-content").empty();
       $("#spinner").show();
                
        $("#menutreeArea .showme-filter-label").each(function (evt){
                $(this).removeClass('current');
            });
        $(this).addClass("current");
        gModel.updateArea($(this).attr("type"));
            
        //gModel.updatePagination(0);
        gShell.update(gModel);
        
                
        evt.stopImmediatePropagation();
        return false;
    });

    $("#menutreeType .showme-filter-label").bind("click", function (evt) {
         
         gModel.startN = 0;
         $("#gl-content").empty();
       $("#spinner").show();
                
        $("#menutreeType .showme-filter-label").each(function (evt){
                $(this).removeClass('current');
            });
        $(this).addClass("current");
        gModel.updateType($(this).attr("type"));
            
        //gModel.updatePagination(0);
        gShell.update(gModel);
        
                
        evt.stopImmediatePropagation();
        return false;
    });

    
    $("#reference-index").on("click", ".item-regionCode", function (evt) {
    //$(".item-regionCode").bind("click",function (evt){
       gModel.startN = 0;
       $("#gl-content").empty();
       $("#spinner").show();

        gModel.updateRegionCode($(this).attr("code"));
        $("#regionList").toggle();
        gShell.update(gModel);
        evt.stopImmediatePropagation();
        return false;
    });

    $("#regionList").hide()
    $(".change-region").bind("click",function (evt){
        $("#regionList").html(regionList()).toggle();
    });

    $("#reference-content").on("click",".ownerName a", function (evt){
        $(".profilePopup .profileDetails").addClass("hide");
        $(".profilePopup").css({"top":$(this).offset().top+"px", "left":$(this).offset().left+"px", "display":"block"})
        
        
        $(".profilePopup .spinner").show();

        gShell.getProfileInfo(gModel, $(this).text())
    });
    $(".profilePopup .icon-close").bind("click",function (evt){
        $(".profilePopup").toggle();
        $(".profilePopup .itemThumbnailContainer").empty();
        $(".profilePopup .profile-name").empty();
        $(".profilePopup .profile-content").empty();
    });

    

    function regionList () {
        var vL = [],
        itemStatus = (gModel.defaultRgnCode == $("#countryName").attr("code"))?"current":"";

        vL.push('<div class="dropdown-menu"><ul>')
        vL.push('<li><label class="item-regionCode ' + itemStatus + '" code="'+gModel.defaultRgnCode+'">' + conuntryCodeMapping[gModel.defaultRgnCode] +  ' (Default)</label></li>');
        $.each(conuntryCodeMapping, function(k, v){
            itemStatus = (k == $("#countryName").attr("code"))?"current":"";
            if(k != "WO" && k != gModel.defaultRgnCode){
                vL.push('<li><label class="item-regionCode ' + itemStatus + '" code="'+k+'">' + v +  '</label></li>');
            }
            
        });
        vL.push('</ul></div>')

        return vL.join(" ");
    }

    $(window).scroll(function () {
        if ($(document).height() <= $(window).scrollTop() + $(window).height()+300) {

            // GSA has browse limit of 1000 results
            if ((gModel.queryStatus && gModel.queryStatus == "completed") && (gModel.sedata.rowL.length >= gModel.numN)) {
                $(".more-spinner").css("display","block");
                gModel.queryStatus = null;
                
                gModel.inc();
                gShell.update(gModel);
                               
                return false;
            }
        }
    });

    /* End of show me section */

    window.onhashchange = function (evt) {
        var curHash = window.location.hash;
 
        //$("#filters .ctrlbox").trigger("change");
        if (curHash) {
            var vdata = gModel.genViewData();
            
            if (vdata.hash) {
                if ("#" + vdata.hash !== curHash) {
                    //debug("curHash=" + curHash);
                    //$("#gl-content").empty();
                    $("#gl-content").empty();
                    $("#spinner").show();
                    gModel.updateByHash(curHash);
                    gShell._updateFilter(gModel);
                    gShell.update(gModel);
                    if (gModel.query) { $("#gl-cl-btn").show(); }
                }
            }
        }
    }

    /** init page **/
    try {
        var initval = "#s=0&n=" + gcfg.numN;
        if (window.location.hash) {
            initval = window.location.hash;
        }
        
        gModel = genGalleryModel(initval, mdfL);
        housekeeping();
        gModel.startN = 0;
        gShell.init(gModel);
        gShell.update(gModel);
        if (gModel.query) { $("#gl-cl-btn").show(); }
    } catch (ex) {
        debug(ex.message);
    }

    $("#gl-cl-btn").click(function (evt) {   
        return resetSearch(evt)
    });

    function resetSearch(evt) {
        $("#query").val("");
        $("#gl-cl-btn").hide();

        $("#gl-content").empty();
        $("#spinner").show();

        if (gShell.reloadCount >= 1) {
            gModel.updateQuery();
            gShell.update(gModel);
            gShell.reloadCount = 0; // reset the ajax reload counter
            evt.stopImmediatePropagation();
        }
        return false
    }

    function housekeeping(){
        if(getUrlVars()['md']){
            var col = getUrlVars()['md'].split(":")[0];
				gModel.col = col;
           
           $(".filter-label").removeClass("current");
           $("."+col+"-filter").addClass("current");

           
           if (gModel.subCat > 0){
                $(".current .reset-filter").css("display","block");
           }
           
        }

        if(getUrlVars()['type']){
            var type = getUrlVars()['type'];

           $("#menutreeType .showme-filter-label").removeClass("current");
           $("#menutreeType ."+type+"-showme-filter").addClass("current");
           $("#menutreeType").css("display","block");
        }

        if(getUrlVars()['area']){
            var area = getUrlVars()['area'];
           
           $("#menutreeArea .showme-filter-label").removeClass("current");
           $("#menutreeArea ."+area+"-showme-filter").addClass("current");
           $("#menutreeArea").css("display","block");

        }

		// For safari back button issue.
		window.onunload = function(){};

    }

    function getUrlVars ()
    {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
    }

});
