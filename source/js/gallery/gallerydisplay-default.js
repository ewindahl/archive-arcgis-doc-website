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
            var itemID = row.agolId();
            var imgurl = row.agolImgUrl(itemID);
            var v = obj._genContribInfo(row);
            var targetUrl = row.agolItemUrl(itemID);

            var itemTitle = row.md("agol-item-title", "n/a");
            if (itemTitle.length > 40 ) {  
                itemTitle = itemTitle.substr(0,40) + " ...";
            }  

            if(row.md("la-demographics") || row.md("la-lifeStyles")){
                targetUrl = targetUrl + "&subType=demographics";
            }


            buf.push("<li class='item'>");

            if(row.agolFeaturedItem()){
                buf.push("<span class='featured'>Featured</span>");
            }
            
            if (v.show) {
                buf.push("<a href='" + targetUrl + "'  class='item-contrib " + v.css + " '>" + v.label + "</a>");
            }

            buf.push("<a href='" + targetUrl + "'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");
            buf.push("<a class='item-title' href='" + targetUrl + "'>");
            buf.push(itemTitle);
            buf.push("</a>");
			buf.push("<span class='ownerName'>By "+row.md("agol-owner", "n/a")+"</span>");
            buf.push("</li>");

        },

        display2: function (obj, i, row, buf) {
            var itemID = row.agolId();
            var targetUrl = row.agolItemUrl(itemID);

            if (i % 2 === 0) {
                buf.push("<li class='item'>");
            } else {
                buf.push("<li class='item item-even'>");
            }

            buf.push("<span class='item-idx'>" + (i + 1) + ".</span>");
            buf.push("<a class='item-title' href='" + targetUrl + "' target='_blank'>");
            buf.push(row.md("agol-item-title", "n/a")); //row.val("t"));
            buf.push("</a>");
            buf.push("<br/>");
            buf.push("<span class='item-type'> " + row.md("agol-itemtype", "") + "</span>")
            buf.push("<span class='item-stat'>" + row.md("agol-numviews", "0") + " views | " + row.md("agol-numrating", "0") + " ratings | avg. rating: " + row.md("agol-avgrating", "0.0").slice(0, 3) + "" + "</span>");
            buf.push("</li>");

        },

        display3: function (obj, i, row, buf) {
            var itemID = row.agolId();
            var imgurl = row.agolImgUrl(itemID);
            var v = obj._genContribInfo(row);
            var targetUrl = row.agolItemUrl(itemID);

            buf.push("<li class='item'>");
            if (v.show) {
                buf.push("<a href='" + targetUrl + "' class='item-contrib " + v.css + " '>" + v.label + "</a>");
            }
            buf.push("<a href='" + targetUrl + "' target='_blank'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");

            buf.push("<div class='item-info-wrap'>");
            buf.push("<a class='item-title' href='" + targetUrl + "' target='_blank'>");
            buf.push(row.md("agol-item-title", "n/a"));
            buf.push("</a>");
            // -- default -- buf.push("<p class='item-snippet'><span class='item-type'>[" + row.md("agol-itemtype", "") + "]</span> " + row.md("agol-snippet", "") + "</p>");
            if(row.md("agol-snippet", "") != "None"){
				buf.push("<p class='item-snippet'>" + row.md("agol-snippet", "") + "</p>");
			}
            buf.push("<div class='item-stat'>" + row.md("agol-numviews", "0") + " views | " + row.md("agol-numrating", "0") + " ratings | avg. rating: " + row.md("agol-avgrating", "0.0").slice(0, 3) + "" + "</div>");
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


                    if (gm.sedata.rowL.length > 0) {
                        buf.push("<ul id='gl-content-ul'>");
                        $.each(gm.sedata.rowL, function (i, val) {
                            displayFunc(o, gm.startN + i, new SERow(val), buf);
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
                        errMsg.push("<div class='gl-content-errMsg'>")
                        errMsg.push("<p>Sorry. No results found.</br>The Living Atlas doesn't contain any items that match that query.</p><p>To find content, try entering a new query or browse the themes of the atlas.</p>")
                        errMsg.push("</div>");
                        $("#gl-content").html(errMsg.join(""));
                    }
                }

            } catch (ex) {
                debug(ex.message);
                $("#gl-content").html(gcfg.errorMsg);

            }
        }
    };

    return o;
}

