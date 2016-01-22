$(document).ready(function () {
    var hostname = window.location.hostname,
        tier = getTier(hostname);

    if ($('#featured-sp .w-content').length > 0) {
        $('#featured-sp .w-content').before('<ul id="nav">').cycle({
            pager: '#nav',
            timeout: 15000,
            pause: true,
            pagerAnchorBuilder: function (idx, slide) {
                return '<li><div class="ft-tab"><div class="ft-headtab"><a href="#"></a></div></div></li>';
            }
        });
    }

    if ($('#gallery-cont').length > 0) {
        $('#gallery-cont')
            .cycle({
                fx: 'scrollHorz',
                sync: true,
                timeout: 0,
                prev: '#glprev',
                next: '#glnext'
            });
    }

    if ($('#newsticker').length > 0) {
        $('#newsticker').cycle({
            fx: 'fade',
            speed: 600,
            pause: 1
        });
    }

/*
    if ($('.colorbox-iframe').length > 0) {
        $('.colorbox-iframe').colorbox({ iframe: true, scrolling: false, innerWidth: "716", innerHeight: "420", maxWidth: "90%", maxHeight: "90%" });
    }
*/

    if ($('.colorbox-iframe').length > 0) {
        $('.colorbox-iframe').colorbox({ iframe: true, scrolling: false, innerWidth: "970", innerHeight: "560", maxWidth: "90%", maxHeight: "90%" });
    }

    if ($("#q").length > 0) {
        $("#q").focus(function () {
            if ($(this).val() == $(this)[0].defaultValue) {
                $(this).val('');
            }
        })
    }


    if ($("#primarySearch").length > 0) {
        $("#primarySearch").attr("action", "http://" + tier.hostname + "/search/");
    }

    //showLogin(tier); done in setlang.js

    //modFeedback(tier); done in setlang.js

    if (typeof initWS != "undefined") {
        initWS();
    }

});


function getTier(hostname) {
    var devTier = {
        tier: "dev",
        hostname: "resourcesdev.arcgis.com",
        search: "//searchdev.esri.com/v3/index.cfm",
        gallery: "//search.esri.com/v3/index.cfm"
    };

    if (hostname == "docdev.arcgis.com") {
        return devTier;
    } else if (hostname == "docstg.arcgis.com") {
        return {
            tier: "stg",
            hostname: "resourcesstg.arcgis.com",
            search: "//searchstg.esri.com/v3/index.cfm",
            gallery: "//searchstg.esri.com/v3/index.cfm"
        }
    } else if (hostname == "doc.arcgis.com") {
        return {
            tier: "prd",
            hostname: "resources.arcgis.com",
            search: "//search.esri.com/v3/index.cfm",
            gallery: "//search.esri.com/v3/index.cfm"
        }
    } else {
        return devTier;
    } 
}