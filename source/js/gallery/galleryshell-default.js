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
        this.fStartN = 0;
        this.numN = gcfg.numN;
        this.fNumN = gcfg.numN;
        this.maxN = 0;
        this.sedata = null;
        this.query = ""; //decoded value
        this.mdf = {}; //metadata filter
        this.tier = getTier(window.location.hostname);

        this.display = 1; //display type
		this.clearAll = false;
		this.col = "All"; //decoded value
        this.type = "All";
        this.npp = gcfg.numN;;

        this.init = function (hash) {
            this._initMDF(mdfL);
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
            var opt = {featured:1}
            var o = {
                hash: this._genHash(),
                ajaxData: this._genAjaxData(),
                ajaxFeaturedData: this._genAjaxData(opt)
            };

            return o;
        }

        this.updateSEData = function (sedata) {
            this.sedata = sedata;
            this.startN = sedata.startI - 1;
            this.maxN = Math.min(1000, sedata.estN); //gsa: only return first 1000
        }

        this.updateFSEData = function (sedata) {
            this.sedata = sedata;
            this.fStartN = sedata.startI - 1;
            this.fMaxN = Math.min(1000, sedata.estN); //gsa: only return first 1000
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

            if (o.fs) {
                this.fStartN = parseInt(o.fs, 10);
                if (isNaN (this.fStartN)) {
                    this.fStartN = 0;
                }
            } else {
                this.fStartN = 0;
            }

            if (o.n) {
                this.numN = parseInt(o.n, 10);
                if (isNaN(this.numN)) {
                    this.numN = gcfg.numN;
                }
            } else {
                this.numN = gcfg.numN;
            }

            if (o.fn) {
                this.fNumN = parseInt(o.fn, 10);
                if (isNaN(this.fNumN)) {
                    this.fNumN = gcfg.numN;
                }
            } else {
                this.fNumN = gcfg.numN;
            }

            if (o.npp) {
                this.npp = parseInt(o.npp, 10);
                if (isNaN(this.npp)) {
                    this.npp = gcfg.numN;
                }
            } else {
                this.npp = gcfg.numN;
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

            if (o.md) {
                this._setMdf(o.md);
            } else {
                this._initMDF(gcfg.mdfL);
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
            this.fStartN = 0;
        }

        this.updateQuery = function () {
            this.query = $.trim($("#query").val());
            this.startN = 0;
            this.fStartN = 0;
            this.fNumN = this.numN;

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

        this.updateNpp = function (n) {
            //this.npp = n || 30;
            
            if(n == 0){
                this.fStartN = 0;
                this.startN = 0;
                this.npp = 0;
                this.fNumN = 30;
                this.numN = 0;
            }else{
                this.fStartN = n||this.npp;
                this.fNumN = this.fNumN;
                this.npp = this.npp + parseInt(n,10);

                if(this.fNumN <= 0){
                    this.startN = this.startN + this.numN;
                    this.numN = n || this.numN;
                }else{
                    //this.fStartN = this.npp;
                    //this.fNumN = this.fNumN;
                }
             }

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
            this.fStartN = 0;

        }

        this.updateDisplay = function (n) {
            this.display = Math.max(1, n);
            this.display = Math.min(3, this.display);
        }

        this.gotoPage = function (x) {
            x = (x - 1) * this.numN;
            x = Math.min(this.maxN, x);
            this.startN = Math.max(0, x);
            this.fStartN = Math.max(0, x);
        }

        this.inc = function () {
            this.startN = Math.min(this.maxN, this.startN + this.numN);
            this.fStartN = Math.min(this.fMaxN, this.fStartN + this.numN);
        }

        this.dec = function () {
            this.startN = Math.max(0, this.startN - this.numN);
            this.fStartN = Math.max(0, this.fStartN - this.numN);
        }

        this.updatePagination = function (n) {
            this.startN = n || 0;
            this.fStartN = n || 0;
            this.fNumN = 30;
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
        }

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
            l.push("n=" + this.numN);
            l.push("d=" + this.display);
			l.push("col=" + this.col);
            l.push("type=" + this.type);
            l.push("fs=" + this.fStartN);
            l.push("fn=" + this.fNumN);
            l.push("npp=" + this.npp);

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

            function _genPartialFields(mdf) {
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
                                        vL.push(key + ":" + v);
                                    }
                                }
                            }
                            if (vL.length) {
                                l.push("(" + vL.join("|") + ")");
                            }
                        }
                    }
                }
                return l.join(".");
            }


            function _genPartialFieldsForGalleryType(galleryType) {
                var l = [];
                if(galleryType != "All"){
                     var types = gcfg.type[galleryType];
                     $.each(types.split("|"), function (i, val) {
                        l.push("agol-itemtype:" + encodeURIComponent(val));
                     });
                     return l.join("|");
                }
                return false;

            }

            /** -- **/

            var l = [];

            /* internal flags */
            l.push("callback=?");
            l.push("format=jsonp");
            l.push("event=search.renderSearch");
            l.push("interfaceName=resourcesbeta");
            l.push("searchViewname=resourcesbeta_gallery");
            //l.push("lr=lang_en");
            l.push("Oe=utf8");
            l.push("filter=0");

            // Additional category if any
            if(gcfg.addlCategory && gcfg.addlCategory != ""){
                l.push("requiredfields=search-collection:" + gcfg.collection + ".(search-category:" + gcfg.category + "|search-category:" + gcfg.addlCategory +")");
            } else {
                l.push("requiredfields=search-collection:" + gcfg.collection + ".search-category:" + gcfg.category);
            }

			// Sort by date
			l.push("sort=date:D:S:d1");
            //l.push("inmeta:la-featured1:1 AND inmeta:last-modified:2012-06-16..");

            /* public flags */
            


            if (this.query) {
                l.push("q=" + encodeURIComponent(this.query));
            }

            var pfields = _genPartialFields(this.mdf);
            var typePFields = _genPartialFieldsForGalleryType(this.type);

            if (pfields && typePFields){
                pfields = pfields+".("+typePFields+")";
            } else if (typePFields){
                pfields = typePFields;
            }

            if(opt && opt.featured){
                 pfields = (pfields)? pfields + ".(la-featured:yes)" : "(la-featured:yes)";
                 l.push("start=" + this.fStartN);
                l.push("num=" + this.fNumN);
                //l.push("start=" + this.startN);
                //l.push("num=" + this.numN);
            }else {
                 pfields = (pfields)? pfields+".(-la-featured:yes)" : "(-la-featured:yes)";
                 l.push("start=" + this.startN);
                l.push("num=" + this.numN);
            }

            
            if (pfields) {
                l.push("partialfields=" + pfields);
            }

            l.push("getfields=*");

            return l.join("&");
        }


    }


}

function SEData(data) {

    this.hasError = data.haserror;
    this.errMsg = data.errormessage;

    var jxon = getXMLData($.parseXML(data.content).documentElement);

    this.estN = (typeof jxon.res === "undefined") ? 0 : parseInt (jxon.res["m"]);
    this.startI = (typeof jxon.res === "undefined") ? 0 : parseInt (jxon.res["@sn"]);
    this.endI = (typeof jxon.res === "undefined") ? 0 : parseInt (jxon.res["@en"]);

    this.rowL = (typeof jxon.res === "undefined") ? [] :
                      ((jxon.res.r instanceof Array) ? jxon.res["r"] : [jxon.res["r"]]);



};
SEData.prototype.getRow = function (i) {
    return new SERow(this.rowL[i]);
};


function SERow(data) {
    this.data = data;
    this._md = (function (md) {
        var r = {};
        /* should limit the key set - only use subset*/
        if (md) {
            var i = md.length,
                v = null;

            while (i--) {
                v = md[i];
                r[v["@n"]] = v["@v"];
            }
        }
        return r;
    })(data["mt"]);

}
SERow.prototype.md = function (key, dval) {
    return (this._md.hasOwnProperty(key) ? this._md[key] : dval) || dval;
};
SERow.prototype.val = function (key, dval) {
    return this.data.hasOwnProperty(key) ? this.data[key] : dval;
};
SERow.prototype.agolId = function () {
    return this.md("agol-item-id", "");
};
SERow.prototype.agolItemType = function () {
    var itemType = this.md("agol-itemtype", "");
	
	if (itemType !== "None") {
        itemType  = (itemType.match(/application/gi)) ? "app" : "map";
    }
	return itemType;
};
SERow.prototype.agolItemUrl = function (agolId) {
	var itemType = this.agolItemType();
    /*var host = gcfg.host || "http://www.arcgis.com";
    return host + "/home/item.html?id=" + agolId;*/
	return "item/?itemId=" + agolId;
};
SERow.prototype.agolImgUrl = function (agolId) {
		var imgf = (this.md("agol-large-thumbnail", null) != "None") ? this.md("agol-large-thumbnail", null) : this.md("agol-thumbnail", null),
		imgurl = gcfg.emptyImgUrl,
		host = gcfg.host || "http://www.arcgis.com";

    if (imgf !== "None") {
        imgurl = host + "/sharing/content/items/" + agolId + "/info/" + imgf;
        //console.info(imgurl);
    }

    return imgurl;
};

SERow.prototype.agolTargetUrl = function (itemURL) {
    var targetURL = this.md("agol-target-url", null);

    if (targetURL == "None" || targetURL == null) {
        targetURL = itemURL ;
    }

	return targetURL;
};

SERow.prototype.agolFeaturedItem = function () {
    var featuredItem = this.md("la-featured", "");
    
    if (featuredItem !== "None") {
        return featuredItem;
    }
    return false;
};

function createGalleryShell() {
    var shell = {
        gm: null,
        display: null,
        pageNav: null,
        reloadCount: 0,
        featureddata:null,
        numberofRegularItemsRequires:0,

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

        updateGeneralItem: function (gm) {
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
                    this.reloadCount += 1
                },
                error: function (xhr, status, err) {
                    $("#gl-content").html(gcfg.errorMsg);
                    $("#spinner").hide();
                }
            });

        },


        update: function (gm) {
            //this.updateFeatured(gm);
            this.gm = gm;

            var vdata = gm.genViewData();

            if (gm.query) {
                $("#query").val(gm.query);
            }

            this.updateHash(gm, vdata);

            this._updateFilter(gm);

            // Featured Item
            $.ajax({
                url: gm.tier.gallery,
                dataType: "jsonp",
                context: this,
                data: vdata.ajaxFeaturedData,
                timeout: 6000,
                async: false,
                beforeSend: function () {
                    $("#gl-content").empty();
                    $("#spinner").show();
                },
                success: function (data) {
                    this._setFeaturedData(data, this.gm);
                    this.updateGeneralItem(gm)
                    //this._setFeaturedData(data, this.gm);
                },
                error: function (xhr, status, err) {
                    //$("#gl-content").html(gcfg.errorMsg);
                    //$("#spinner").hide();
                }
            });

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
                            if (state.charAt(i) === "1") {
                                var selector = "#filters input:checkbox[name=" + key + "-" + (i + 1) + "]";
                                $(selector).attr("checked", "true");
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
        },

        updateDisplay: function () {
            if (this.display) {
                this.display.update(this.gm);
            }
        },
        _setFeaturedData: function (data,gm){
            this.featureddata = new SEData(data);
            this.gm.updateFSEData(this.featureddata);
            this.numberofRegularItemsRequires = 0;


            if(this.featureddata){
                var totalFeaturedItemPerPage =  this.featureddata.endI-(this.featureddata.startI-1);
                //var totalFeaturedItemPerPage =  this.featureddata.endI;
                var totalFeaturedResult = this.featureddata.estN;
                if(totalFeaturedItemPerPage < 30){
                    this.numberofRegularItemsRequires = 30 - totalFeaturedItemPerPage;
                }

                if(this.numberofRegularItemsRequires > 0){
                    console.log("ss"+this.numberofRegularItemsRequires);
                    gm.numN = this.numberofRegularItemsRequires;
                    gm.fNumN = 0;
                }else{
                    gm.numN = 0;
                }
            }

            console.log(totalFeaturedItemPerPage+"-"+totalFeaturedResult+"-"+this.numberofRegularItemsRequires);


        },

        mergeData: function(gm,sedata){
            
            //var totalFeaturedNumber = (this.updateFeatured.estN)?this.updateFeatured.estN:0;
           if(this.featureddata){
                var estN = (this.featureddata.estN)?this.featureddata.estN:0;
                var endI = (this.featureddata.endI)?this.featureddata.endI:0;

                 console.log(this.featureddata);
                if( this.numberofRegularItemsRequires > 0){
                    sedata.rowL = this.featureddata.rowL.concat(sedata.rowL); 
                }else{
                    sedata.rowL = this.featureddata.rowL;
                }

                
            } 
            //this.featureddata = null;
            return sedata.rowL;
            
             

        },

        _updateModelAndView: function (data) {

            var sedata = new SEData(data);

            

            this.gm.updateSEData(sedata);

            
            this.gm.sedata.rowL = this.mergeData(this.gm,sedata);

            //console.log(sedata);
            //if(this.featureddata){
                //sedata.rowL = this.mergeData(this.gm,sedata);
            //}

            

            if (this.display === null) {
                this.display = genDisplay();
            }
            this.display.update(this.gm);

            if (this.pageNav === null) {
                this.pageNav = genPageNav();
            }
            this.pageNav.update(this.gm);
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
                gModel.updateQuery();
                gShell.update(gModel);
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
        gModel.updateByFilter();

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
        }else{
            $(".current .reset-filter").css("display","none");
        }
        //gModel.updatePagination(0);
        gModel.updateNpp(0);
		gShell.update(gModel);
    });

    $("#search, #gl-search-btn").bind("click", function (evt) {
        gModel.updateQuery();
        gShell.update(gModel);

        evt.stopImmediatePropagation();
        return false;
    });

	$("#gallerySearchForm").bind("submit", function (evt) {
        gModel.updateQuery();
        gShell.update(gModel);

        evt.stopImmediatePropagation();
        return false;
    });
	
    /*$("#gl-pagenav").delegate("#pageX", "keydown", function (evt) {
        if (evt.keyCode == "13") {
            var x = parseInt($("#pageX").val(), 10);
            if (!isNaN(x)) {
                gModel.gotoPage(x);
                gShell.update(gModel);
            }
            evt.stopImmediatePropagation();
            return false;
        }
    });*/


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

    $("#numn1, #numn2, #numn3").bind("click", function (evt) {
        gModel.updateDisplayN(parseInt(evt.target.id.slice("numn".length), 10));
        gShell.update(gModel);

        //temp hack
        $("#numn1, #numn2, #numn3").removeClass();
        $("#" + evt.target.id).addClass("displayn_selected");

        evt.stopImmediatePropagation();
        return false;
    });

    /*$("#gl-prev").bind("click", function (evt) {
        if (!$(this).hasClass("disabled")) {
            gModel.dec();
            gShell.update(gModel);
        }
        evt.stopImmediatePropagation();
        return false;
    });

    $("#gl-next").bind("click", function (evt) {
        if (!$(this).hasClass("disabled")) {
            gModel.inc();
            gShell.update(gModel);
        }
        evt.stopImmediatePropagation();
        return false;
    });*/

    
    $("#gl-pagenav").on("click", ".pagination_link", function (evt) {
        if (!$(this).hasClass("_pagination_link_current") && !$(this).hasClass("disabled")) {
            var startNumber = $(this).attr("value");

            gModel.updatePagination(startNumber);
            gShell.update(gModel);
        }
                
        evt.stopImmediatePropagation();
        return false;
        
    });

    $("#gl-content").on("click", "#more-item", function (evt) {
           var startNumber = $(this).attr("value");

            //gModel.updatePagination(startNumber);
            gModel.updateNpp($(this).attr("value"));
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
        gModel.updateNpp(0);
        gShell.update(gModel);
		$("#filters input:checkbox").removeAttr('checked');
        $(".reset-filter").css("display","none");
		        
        evt.stopImmediatePropagation();
    });

    /* Show me section */
    $(".showme-dropDown").bind("click", function (evt) {
        $("#showMeFilters").toggle('slow');
    });

    // Tablet/movile view related
    $(".tablet-theme-dropDown").bind("click", function (evt) {
        $("#navFilters").toggle('slow');
    });
    
    $(".showme-filter-label").bind("click", function (evt) {
                
        $(".showme-filter-label").each(function (evt){
                $(this).removeClass('current');
            });
        $(this).addClass("current");
        gModel.updateType($(this).attr("type"));
            
        //gModel.updatePagination(0);
        gModel.updateNpp(0);
        gShell.update(gModel);
        
                
        evt.stopImmediatePropagation();
        return false;
    });

    /* End of show me section */

    window.onhashchange = function (evt) {
        var curHash = window.location.hash;
 
        if (curHash) {
            var vdata = gModel.genViewData();
 
            if (vdata.hash) {
                if ("#" + vdata.hash !== curHash) {
                    //debug("curHash=" + curHash);
                    gModel.updateByHash(curHash);
                    gShell.update(gModel);
                    if (gModel.query) { $("#gl-cl-btn").show(); }
                }
            }
        }
    }

    /** init page **/
    try {
        var initval = "#s=0&n=" + gcfg.numN + "&d=1&filter=0";
        if (window.location.hash) {
            initval = window.location.hash;
        }
        
        gModel = genGalleryModel(initval, mdfL);
        housekeeping();
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

        if (gShell.reloadCount > 1) {
            gModel.updateQuery();
            gShell.update(gModel);
            gShell.reloadCount = 0; // reset the ajax reload counter
            evt.stopImmediatePropagation();
        }
        return false
    }

    function housekeeping(){
        if(getUrlVars()['col']){
            var col = getUrlVars()['col'].split(":")[0];
           
           $(".filter-label").removeClass("current");
           $("."+col+"-filter").addClass("current");
        }

        if(getUrlVars()['type']){
            var type = getUrlVars()['type'];
           
           $(".showme-filter-label").removeClass("current");
           $("."+type+"-showme-filter").addClass("current");
           $("#showMeFilters").css("display","block");

        }
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

    $(window).scroll(function () {
        if ($(document).height() <= $(window).scrollTop() + $(window).height()+400) {
            //alert("End Of The Page");
            
            //gShell.update(gModel);
        }
    });

});
