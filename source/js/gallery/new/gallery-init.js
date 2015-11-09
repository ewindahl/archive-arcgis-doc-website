$(document).ready(function () {
    var hostname = window.location.hostname,
        tier = getTier(hostname);

    

   
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
    var tierObj = {
        tier: "dev",
        search: "//searchdev.esri.com/v3/index.cfm",
        gallery: "//search.esri.com/v3/index.cfm",
        ipLookupAPI: "/apps/shared/services/index.cfm?event=location.getCountryByIp",
        agolAuthCookie: "esri_auth",
        agolRestApi: "http://www.arcgis.com/sharing/rest/"
    };

   if (hostname == "docstg.arcgis.com") {
        tierObj.tier = "stg",
        tierObj.search = "//searchstg.esri.com/v3/index.cfm",
        tierObj.gallery = "//searchstg.esri.com/v3/index.cfm"
        return tierObj
    } else if (hostname == "doc.arcgis.com") {
        tierObj.tier = "prd",
        tierObj.search = "//search.esri.com/v3/index.cfm",
        tierObj.gallery = "//search.esri.com/v3/index.cfm"
    } else {
        tierObj.ipLookupAPI = "http://docdev.arcgis.com" + "/apps/shared/services/index.cfm?event=location.getCountryByIp";
    }

    return tierObj 
}