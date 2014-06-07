function genPageNav() {
    var o = {
        update: function (gm) {

            if($("#gl-content-ul").length > 0){
                $("#gl-pagenav").html(this.generateLinks(gm));
            }

            if (gm.sedata.startI - gm.numN < 0) {
                $("._pagination_link_prev").addClass("disabled");
                 $("._pagination_link_first").addClass("disabled");
            } else {
                var $o = $("_pagination_link_prev");
                if ($o.hasClass("disabled")) {
                    $o.toggleClass("disabled");
                }
            }


            // GSA has browse limit of 1000 results
            if (gm.sedata.endI >= gm.maxN) {
                $("._pagination_link_next").addClass("disabled");
                 $("._pagination_link_last").addClass("disabled");
            } else {
                 var $o = $("._pagination_link_next");
                if ($o.hasClass("disabled")) {
                    $o.toggleClass("disabled");
                }
                var $o = $("._pagination_link_last");
                if ($o.hasClass("disabled")) {
                    $o.toggleClass("disabled");
                }
            }

           

        },


        generateLinks: function(gm)
        {
            
            if(gm.maxN >= 1000){
                gm.maxN = gm.maxN-gm.numN;
            }
            settings = {
                                first           : '<<', 
                                prev            : '<',
                                next            : '>',
                                last            : '>>',
                                spread          : 2,
                                total           : gm.maxN,
                                index           : gm.sedata.startI-1 || 0,
                                limit           : gm.numN,
                            };
                            
            var paginate = $('<div class="gl-pagination"></div>');

            var totalPages = Math.ceil(settings.total/settings.limit);
            var visiblePages = settings.spread * 2 + 1;
            var currentPage = Math.ceil(settings.index/settings.limit);
            var start = 0, end = 0;


            // get start and end page
            if(totalPages <= visiblePages) { start = 0; end = totalPages; }
            else if(currentPage < settings.spread){ start = 0; end = visiblePages; }
            else if(currentPage > totalPages - settings.spread-1){ start = totalPages-visiblePages; end=totalPages; }
            else{ start = currentPage-settings.spread; end=currentPage+settings.spread+1; }

            paginate.html('');
            
           

            // generate links
            if(settings.first) paginate.append(this.getLink(0, 'first'));
            if(settings.prev) paginate.append(this.getLink(currentPage === 0 ? 0 : currentPage-1, 'prev'));

            for(var i=start; i<end; i++) paginate.append(this.getLink(i, i*settings.limit === settings.index ? 'current' : null));
            
            if(settings.next) paginate.append(this.getLink(currentPage === totalPages ? totalPages : currentPage+1, 'next'));
            if(settings.last) paginate.append(this.getLink(totalPages-1, 'last'));

            return paginate;
        },

        getLink: function(i, key){
            
            var _self = this;
            var spanVal = i*settings.limit;
            return $('<label value="' + spanVal + '" class="pagination_link' + (key ? ' _pagination_link_' + key : '') + '"></label>').html(settings[key] || (i+1));
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
            var itemID = row.agolId();
            var imgurl = row.agolImgUrl(itemID);
            var v = obj._genContribInfo(row);
            var targetUrl = row.agolItemUrl(itemID);
            
            buf.push("<li class='item'>");
            if (v.show) {
                buf.push("<a href='" + targetUrl + "'  class='item-contrib " + v.css + " '>" + v.label + "</a>");
            }

            buf.push("<a href='" + targetUrl + "'>");
            buf.push("<img class='item-img' src='" + imgurl + "' />");
            buf.push("</a>");
            buf.push("<a class='item-title' href='" + targetUrl + "'>");
            buf.push(row.md("agol-item-title", "n/a"));
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


                    if (gm.sedata.estN > 0) {
                        buf.push("<ul id='gl-content-ul'>");
                        $.each(gm.sedata.rowL, function (i, val) {
                            displayFunc(o, gm.startN + i, new SERow(val), buf);
                        });
                        buf.push("</ul>");
                        //buf.push("<div class='clear'></div>");

                        $("#gl-content").html(buf.join("")).removeClass().addClass("display" + gm.display);
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

