$(document).ready(function () {

    /*
        data-appname="maps_for_cognos"
            data-plat="windows"
            data-plat="linux"
    
    */
    var val = '<p id="plats">' +
        '<span class="viewing">Viewing: </span>' +
        '<a data-appname="maps_for_cognos" data-plat="install-windows" data-prefix="/en/maps-for-cognos/install-windows" href="/en/maps-for-cognos/" class=""> Install on Windows</a>' +
        ' | ' +
        '<a data-appname="maps_for_cognos" data-plat="install-linux" data-prefix="/en/maps-for-cognos/install-linux" href="/en/maps-for-cognos/" class=""> Install on Linux and Unix</a>' +
        '</p>',
        /*  
        fnameFilter = {
            "about-apache-configuration.htm" : "", "about-web-server-configuration.htm" : "", "administrative-and-login-settings.htm" : "",
            "changing-the-logging-levels-.htm" : "", "communication-bi-bus-.htm" : "", "configuration-.htm" : "", "configure-an-upstream-proxy.htm" : "",
            "configure-login-settings.htm" : "", "configure-proxy-settings.htm" : "", "configuring-apache-.htm" : "", "controlling-who-can-access-esri-maps-for-ibm-cognos.htm" : "",
            "creating-a-default-map.htm" : "", "distribution-options.htm" : "", "esri-maps-for-ibm-cognos-architecture.htm" : "", "generate-an-application-id.htm" : "",
            "ibm-cognos-architecture.htm" : "", "ibm-cognos-files.htm" : "", "ibm-cognos-fix-packs.htm" : "", "installation-options-.htm" : "", "installation-sequence-for-server-components-.htm" : "",
            "installing-and-configuring-em4c-dispatcher-.htm" : "", "installing-and-configuring-em4c-gateway-.htm" : "", "installing-and-configuring-em4c-server-.htm" : "",
            "installing-and-configuring-em4c-server-and-em4c-dispatcher-.htm" : "", "installing-and-configuring-on-a-single-computer-.htm" : "", "items-added-to-a-map-enabled-report.htm" : "",
            "required-ibm-cognos-capabilities.htm" : "", "supported-arcgis-authentication-methods.htm" : "", "supported-environments-.htm" : "", "testing-the-configuration.htm" : "", 
            "uninstall-esri-maps-for-ibm-cognos-.htm" : "", "upgrade-esri-maps-for-ibm-cognos.htm" : ""
        },*/
		prodKey = "maps_for_cognos",
		prodDVal = "install-windows",
		homePath = "/en/maps-for-cognos",
		pathname = window.location.pathname,
		parts = pathname.split("/"),
		fname = parts.pop(),
		fldpath = parts.join("/"),
		plat = $.cookie(prodKey) || prodDVal,
		isHome = fldpath === homePath;

    function modHomeUrls(plat) {
        $("a[href]").each(function (i) {
            var $ele = $(this),
				href = $ele.attr("href"),
				parts = href.split("/");
            fname = parts.pop(),
            fld = parts.pop(),
            newHref = href.replace("/" + prodDVal + "/", "/" + plat + "/");

            if (href.indexOf(homePath) === 0) {
                //console.log (href + "=>" + newHref);				
                $ele.attr("href", newHref);
            }
        })

    }

    if (!isHome) {
        $('.reference-content h2:first').after(val);
    } else {
        modHomeUrls(plat);
    }


    $("#plats a[data-appname]").each(function (i) {
        var $ele = $(this),
			prefix = $ele.data("prefix"),
			dplat = $ele.data("plat"),
			url;

        if ((fldpath.indexOf(prefix) === 0)) {
            $ele.toggleClass("on");
            url = prefix + fldpath.replace(prefix, "") + "/" + fname;

        } else {
            $ele.toggleClass("off");
            url = prefix + "/" + fname;

        }
        /*
        if (!fnameFilter.hasOwnProperty(fname)) {
            url = prefix + "/";
        }*/
        $ele.attr("href", url);
    });


    $('a[data-prefix]').on("click", function (evt) {
        var $ele = $(this),
			url = $ele.attr("href");

        $.cookie($ele.data("appname"), $ele.data("plat"), { expires: new Date(2020, 1, 1), path: "/" });

        if (isHome) {
            modHomeUrls($ele.data("plat"));
        }
    })


});
