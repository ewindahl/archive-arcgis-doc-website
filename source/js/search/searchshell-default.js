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

        this.display = 3; //display type

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
                this.mdf[vals[0]] = { len: parseInt(vals[1], 10), state: "" };
            }
        }

        this.clearMDF = function () {
            this._initMDF(gcfg.mdfL);
        }

        this.genViewData = function () {
            var o = {
                hash: this._genHash(),
                ajaxData: this._genAjaxData()
            };

            return o;
        }

        this.updateSEData = function (sedata) {
            this.sedata = sedata;
            this.startN = sedata.startI - 1;
            this.maxN = Math.min(1000, sedata.estN); //gsa: only return first 1000
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
        }

        this.updateQuery = function () {
            this.query = $.trim($("#query").val());
            this.startN = 0;

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
            this.startN = Math.min(this.maxN, this.startN + this.numN);
        }

        this.dec = function () {
            this.startN = Math.max(0, this.startN - this.numN);
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

            this.startN = 0;

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

            if (this.query) {
                l.push("q=" + encodeURIComponent(this.query));
            }
            var mdstr = mdf2str(this.mdf);
            if (mdstr) {
                l.push("md=" + mdstr);
            }
            return l.join("&");
        }

        this._genAjaxData = function() {

            function _genPartialFields(mdf) {
                var l = [];

                for (key in mdf) {

                    if (mdf.hasOwnProperty(key)) {
                        var state = mdf[key].state;
                        if (state) {
                            //alert(key);
                            var vL = [];
                            for (var i = 0, len = mdf[key].len; i < len; i++) {
                                if (state.charAt(i) === "1") {
                                    v = $("#filters input:checkbox[name=" + key + "-" + (i + 1) + "]:checked").val();

                                    // Look for corresponding search-category if any
                                    if (key == "search-collection") {
                                        cv = $("#filters input:hidden[name=" + "search-category" + "-" + (i + 1) + "]").val();
                                        if (cv) {
                                            vL.push(key + ":" + v + "." + "search-category:" + cv)
                                        } else {
                                            vL.push(key + ":" + v);
                                        }
                                    } else {


                                        if (v) {
                                            vL.push(key + ":" + v);
                                        }
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

            /** -- **/

            var l = [];

            /* internal flags */
            l.push("callback=?");
            l.push("format=jsonp");
            l.push("event=search.renderSearch");
            l.push("interfaceName=developers");
            l.push("searchViewname=developers_en");
            l.push("lr=lang_en");
            l.push("Oe=utf8");
            l.push("filter=0");
            //l.push("requiredfields=search-collection:" + gcfg.collection + ".search-category:" + gcfg.category);
            //l.push("requiredfields=search-collection:" + gcfg.collection);

            /* public flags */
            l.push("start=" + this.startN);

            l.push("num=" + this.numN);


            if (this.query) {
                l.push("q=" + encodeURIComponent(this.query));
            }

            var pfields = _genPartialFields(this.mdf);
            if (pfields) {
                //l.push("partialfields=" + pfields);
                l.push("requiredfields=" + pfields);
            }

            l.push("getfields=*");
            //console.log(pfields);
            return l.join("&");
        }


    }


}

function SEData(data) {

    this.hasError = data.haserror;
    this.errMsg = data.errormessage;

    if (data.content) {
        var jxon = getXMLData($.parseXML(data.content).documentElement);

        this.estN = (typeof jxon.res === "undefined") ? 0 : parseInt(jxon.res["m"]);
        this.startI = (typeof jxon.res === "undefined") ? 0 : parseInt(jxon.res["@sn"]);
        this.endI = (typeof jxon.res === "undefined") ? 0 : parseInt(jxon.res["@en"]);

        this.rowL = (typeof jxon.res === "undefined") ? [] :
                      ((jxon.res.r instanceof Array) ? jxon.res["r"] : [jxon.res["r"]]);
    }
    
	
	//alert(JSON.stringify(jxon));  
	//alert(jxon.toSource());


};
SEData.prototype.getRow = function (i) {
    return new SERow(this.rowL[i]);
};


function SERow(data) {
	//console.log(data['t']);
    this.data = data;
    this._md = (function (md) {
        var r = {};
        // should limit the key set - only use subset/
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
 var rslt = {};
rslt['title'] =  data['t'];
rslt['url'] =  data['u'];
rslt['snippet'] = data['s'];
rslt['metaData'] = this._md;
rslt['modifiedDate'] = data['fs']['@value'];


	return rslt;
}

/*
SERow.prototype.contentTitle = function () {
    return this.td("agol-item-id", "");
	
};
SERow.prototype.td = function (key, dval) {
    return (this.data.hasOwnProperty(key) ? this._td[key] : dval) || this._td[key];

};*/


SERow.prototype.md = function (key, dval) {
    return (this._md.hasOwnProperty(key) ? this._md[key] : dval) || dval;
};
SERow.prototype.val = function (key, dval) {
    return this.data.hasOwnProperty(key) ? this.data[key] : dval;
};
SERow.prototype.agolId = function () {
    return this.md("agol-item-id", "");
	
};

SERow.prototype.agolItemUrl = function (agolId) {
    var host = gcfg.host || "http://www.arcgis.com";
    return host + "/home/item.html?id=" + agolId;
};
SERow.prototype.agolImgUrl = function (agolId) {
    var imgf = this.md("agol-thumbnail", null),
		imgurl = gcfg.emptyImgUrl,
		host = gcfg.host || "http://www.arcgis.com";

    if (imgf !== "None") {
        imgurl = host + "/sharing/content/items/" + agolId + "/info/" + imgf;
        //console.info(imgurl);
    }

    return imgurl;
};

function createGalleryShell() {
    var shell = {
        gm: null,
        display: null,
        pageNav: null,

        init: function(gm) {
            if (gm.query) {
                $("#query").val(gm.query);
            }

            this._updateFilter(gm);


        },

        updateHash: function(gm, vdata0) {

        var vdata = vdata0 || gm.genViewData();
        
            if (vdata.hash) {
                window.location.hash = vdata.hash;
            }

        },

        update: function(gm) {
            this.gm = gm;

            var vdata = gm.genViewData();

            if (gm.query) {
                $("#query").val(gm.query);
            }

            this.updateHash(gm, vdata);

            this._updateFilter(gm);

            debug(vdata.ajaxData);

            $.ajax({
                url: gm.tier.gallery,
                dataType: "jsonp",
                context: this,
                data: vdata.ajaxData,
                timeout: 6000,
                beforeSend: function() {
                    $("#dynamicContent").empty();
                    $("#spinner").show();
                },
                success: function(data) {
                    $("#spinner").hide();
                    this._updateModelAndView(data);
                },
                error: function(xhr, status, err) {
                    $("#dynamicContent").html(gcfg.errorMsg);
                    $("#spinner").hide();
                }
            });

        },


        _updateFilter: function(gm) {
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

        updateDisplay: function() {
            if (this.display) {
                this.display.update(this.gm);
            }
        },

        _updateModelAndView: function(data) {

            var sedata = new SEData(data);



            this.gm.updateSEData(sedata);

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

$(document).ready(function() {

    /** init data model **/
    var gModel = null;
    var gShell = createGalleryShell();
    var mdfL = gcfg.mdfL; //metadata filter


    /** init event handler **/

    $("#query").bind({
        "keydown": function(evt) {
            if (evt.keyCode == "13") {
                gModel.updateQuery();
                gShell.update(gModel);
            }
        },
        "focus": function(evt) {
            if ($(this).val() == $(this)[0].defaultValue) {
                $(this).val('');
            }
        }
    });

    $("#filters").bind("change", function(evt) {
        gModel.updateByFilter();
        gShell.update(gModel);
    });

    $("#search").bind("click", function(evt) {
        gModel.updateQuery();
        gShell.update(gModel);

        if ($("#searchBox input:text[name=query]").val() == "") {
            //alert("Please enter a search keyword");
            //$("#searchBox input:text[name=query]").focus()
        }
        evt.stopImmediatePropagation();
        return false;
    });

    $("#gl-pagenav").delegate("#pageX", "keydown", function(evt) {
        if (evt.keyCode == "13") {
            var x = parseInt($("#pageX").val(), 10);
            if (!isNaN(x)) {
                gModel.gotoPage(x);
                gShell.update(gModel);
            }
            evt.stopImmediatePropagation();
            return false;
        }
    });


    $("#display3").bind("click", function(evt) {
        gModel.updateDisplay(parseInt(evt.target.id.slice("display".length), 10));
        gShell.updateHash(gModel);
        gShell.updateDisplay(gModel);

        //temp hack
        $("#display1, #display2, #display3").removeClass();
        $("#" + evt.target.id).addClass("displaytype_selected");

        evt.stopImmediatePropagation();
        return false;
    });

    $("#numn1, #numn2, #numn3").bind("click", function(evt) {
        gModel.updateDisplayN(parseInt(evt.target.id.slice("numn".length), 10));
        gShell.update(gModel);

        //temp hack
        $("#numn1, #numn2, #numn3").removeClass();
        $("#" + evt.target.id).addClass("displayn_selected");

        evt.stopImmediatePropagation();
        return false;
    });

    $("#gl-prev").bind("click", function(evt) {
        if (!$(this).hasClass("disabled")) {
            gModel.dec();
            gShell.update(gModel);
        }
        evt.stopImmediatePropagation();
        return false;
    });

    $("#gl-next").bind("click", function(evt) {
        if (!$(this).hasClass("disabled")) {
            gModel.inc();
            gShell.update(gModel);
        }
        evt.stopImmediatePropagation();
        return false;
    });

    $("#gl-filter-clear").bind("click", function(evt) {
        gModel.clearMDF();
        gShell.update(gModel);
        evt.stopImmediatePropagation();
        return false;
    });

    window.onhashchange = function(evt) {
        var curHash = window.location.hash;

        if (curHash) {
            var vdata = gModel.genViewData();
            if (vdata.hash) {
                if ("#" + vdata.hash !== curHash) {
                    //debug("curHash=" + curHash);
                    gModel.updateByHash(curHash);
                    gShell.update(gModel);
                }
            }
        }
    }

    /** init page **/
    try {

        var initval = "s=0&n=" + gcfg.numN;
        if (window.location.hash) {
            initval = window.location.hash;
        }
        gModel = genGalleryModel(initval, mdfL);
        //console.log(gModel);

        gShell.init(gModel);
        gShell.update(gModel);

    } catch (ex) {
        debug(ex.message);
    }

});