$(document).ready (function (){
  
  $("#helpSearchForm").submit(function() {
    var term = $("#helpSearchForm > input[name='q']").val() || "",
    	col = $("#helpSearchForm > input[name='collection']").val() || "",
    	prod = $("#helpSearchForm > input[name='product']").val() || "",
        lang = $("#helpSearchForm > input[name='language']").val() || "en",
        plat = $("#helpSearchForm > input[name='platform']").val() || "",
        soln = $("#helpSearchForm > input[name='solution']").val() || "",
        version = $("#helpSearchForm > input[name='version']").val() || "",
    	query = "/search/?";

    if (plat === "detect") {
        var agent = navigator.userAgent,
            iosFlg = agent.match(/(iPhone|iPod|iPad)/gi),
            androidFlg = agent.match(/(Android)/gi),
            winFlg = agent.match(/(Windows Phone)/gi);

        if (prod === "collector-android") {
            if (iosFlg) {
                prod = "collector-ios";
            }
        } else if (prod === "android-app") {
            if (iosFlg) {
                prod = "ios-app";
            } else if (winFlg) {
                prod = "win-phone-app";
            }
        }
    }

    query = query + "q=" + encodeURIComponent(term);
    query = query + "&collection=" + encodeURIComponent(col);
    
    if (prod) {
        query = query + "&product=" + encodeURIComponent(prod);
    }

    if (soln) {
        query = query + "&solution=" + encodeURIComponent(soln);
    }
    if (version) {
        query = query + "&version=" + encodeURIComponent(version);
    }

    query = query + "&language=" + encodeURIComponent(lang);
    
    window.location.href = query;

    return false;
  });

});