function genPageNav() {
    var o = {
        update: function (gm) {

//console.log(gm.sedata.rowL[0].t);            
			var pageI = gm.sedata.startI / gm.numN;
            pageI = (pageI === 0) ? 0 : Math.floor(pageI) + 1;

            var pageN = 0;
            if (gm.maxN > 0) {
                pageN = gm.maxN / gm.numN;
                if (gm.maxN % gm.numN > 0) {
                    pageN = Math.floor(pageN) + 1;
                }
            };

            var pageStr = (typeof txtPage === "undefined") ? "Page" : txtPage;
            var ofStr = (typeof txtOf === "undefined") ? "of" : txtOf;
            var itemsStr = (typeof txtItems === "undefined") ? "items" : txtItems;

            var txt = pageStr + " <input id='pageX' name='pageX' type='text' size='2' value='" + pageI + "'> " + ofStr + " " + pageN;
            txt = txt + " (" + gm.sedata.startI + " - " + gm.sedata.endI + " of " + gm.sedata.estN + " " + itemsStr + ")";
            if (gm.sedata.estN > 0) {
                $(".gl-pnavinfo").html(txt);
            } else {
                $(".gl-pnavinfo").empty();
            }

            txt = pageStr + " " + pageI + " " + ofStr + " " + pageN;
            txt = txt + " (" + gm.sedata.startI + " - " + gm.sedata.endI + " of " + gm.sedata.estN + " " + itemsStr + ")";
            if (gm.sedata.estN > 0) {
                $(".gl-pnavinfo-s").html(txt);
            } else {
                $(".gl-pnavinfo-s").empty();
            }

            if (gm.sedata.startI - gm.numN < 0) {
                $("#gl-prev").addClass("btn disabled");
            } else {
                var $o = $("#gl-prev");
                if ($o.hasClass("disabled")) {
                    $o.toggleClass("disabled");
                }
            }

            if (gm.sedata.endI < gm.sedata.estN) {
                var $o = $("#gl-next");
                if ($o.hasClass("disabled")) {
                    $o.toggleClass("disabled");
                }
            } else {
                $("#gl-next").addClass("disabled");
            }

        }
    };

    return o;
}

function genDisplay() {

    var o = {

        _genContribInfo: function (row) {
            var v = { show: false };

            if (gcfg.contrib === 1) {
                var contributor = row.md("g-contributor", "");
                v.show = true;
                if (contributor.length > 0) {
                    v.css = contributor + "-banner";
                    gcfg.contribkv = gcfg.contribkv || {"esri":"Esri Maps & Apps", "partner":"Partner Maps & Apps", "user":"User Maps & Apps" }
                    v.label = gcfg.contribkv[contributor];
                } else {
                    v.css = "";
                    v.label = "";
                }
            }

            return v;
        },

        display1: function (obj, i, row, buf) {
			alert("ss1");
            var itemID = row.agolId();
            var imgurl = row.agolImgUrl(itemID);
            var v = obj._genContribInfo(row);

            buf.push("<li class='item'>");
            if (v.show) {
                buf.push("<a href='" + row.agolItemUrl(itemID) + "' class='item-contrib " + v.css + " '>" + v.label + "</a>");
            }

            buf.push("<a href='" + row.agolItemUrl(itemID) + "'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");
            buf.push("<a class='item-title' href='" + row.agolItemUrl(itemID) + "' >");
            buf.push(row.md("agol-item-title", "n/a"));
            buf.push("</a>");
            buf.push("</li>");

        },

        display2: function (obj, i, row, buf) {
			alert("ss2");
            var itemID = row.agolId();
			

            if (i % 2 === 0) {
                buf.push("<li class='item'>");
            } else {
                buf.push("<li class='item item-even'>");
            }

            buf.push("<span class='item-idx'>" + (i + 1) + ".</span>");
            buf.push("<a class='item-title' href='" + row.agolItemUrl(itemID) + "' >");
            buf.push(row.md("agol-item-title", "n/a")); //row.val("t"));
            buf.push("</a>");
            buf.push("<br/>");
            buf.push("<span class='item-type'> " + row.md("agol-itemtype", "") + "</span>")
            buf.push("<span class='item-stat'>" + row.md("agol-numviews", "0") + " views | " + row.md("agol-numrating", "0") + " ratings | avg. rating: " + row.md("agol-avgrating", "0.0").slice(0, 3) + "" + "</span>");
            buf.push("</li>");

        },

        display3: function (obj, i, row, buf) {

            //var itemID = row.agolId();
			
            //var imgurl = row.agolImgUrl(itemID);
            //var v = obj._genContribInfo(row);

            buf.push("<li class='item'>");
            /*if (v.show) {
                buf.push("sssss<a href='" + row.agolItemUrl(itemID) + "' class='item-contrib " + v.css + " '>" + row.td("contentTitle","") + "</a>");
            }*/
            /*buf.push("<a href='" + row.agolItemUrl(itemID) + "'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");*/

            buf.push("<div class='item-info-wrap'>");
            buf.push("<a class='item-title' href='" + row.url + "' >");
            buf.push(row.title);
            buf.push("</a>");
            buf.push("<p class='item-snippet'> " + row.snippet + "</p>");
            /*buf.push("<div class='item-stat'>" + row.md("agol-numviews", "0") + " views | " + row.md("agol-numrating", "0") + " ratings | avg. rating: " + row.md("agol-avgrating", "0.0").slice(0, 3) + "" + "</div>");*/
            buf.push("</div>");

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


                    if (gm.sedata.estN > 0) {
                        buf.push("<ul id='gl-content-ul'>");
                        $.each(gm.sedata.rowL, function (i, val) {
                            displayFunc(o, gm.startN + i, new SERow(val), buf);
                        });
                        buf.push("</ul>");
                        buf.push("<div class='clear'></div>");

                        $("#gl-content").html(buf.join("")).removeClass().addClass("display" + gm.display);
                    } else {
                        $("#gl-content").html(gcfg.nullMsg);
                    }
                }

            } catch (ex) {
                debug(ex.message);
				console.log(ex.message);
                $("#gl-content").html(gcfg.errorMsg);

            }
        }
    };

    return o;
}

