$(document).ready(function () {

    /*
        data-appname="maps_for_cognos"
            data-plat="windows"
            data-plat="linux"
    
    */
    var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'].toLowerCase();
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>platform-placehoder</p>';
	
	var installAndConfigure = '<a data-appname="maps_for_cognos" data-plat="install-windows" data-prefix="/' + localedir +'/maps-for-cognos/-place-holder-folder-/install-windows" href="/en/maps-for-cognos/" data-langlabel="install-onwindows" class=""> ' + dict['install-onwindows'] + '</a>' +
        ' | ' +
        '<a data-appname="maps_for_cognos" data-plat="install-linux" data-prefix="/' + localedir +'/maps-for-cognos/-place-holder-folder-/install-linux" href="/en/maps-for-cognos/" data-langlabel="install-on-linux" class=""> ' + dict['install-on-linux'] + '</a>';
		
	var useMaps = '<a data-appname="maps_for_cognos_use_maps" data-plat="use-maps" data-prefix="/' + localedir +'/maps-for-cognos/-place-holder-folder-/use-maps" href="/en/maps-for-cognos/" data-langlabel="desktop" class="">  ' + dict['desktop'] + '</a>' +
        ' | ' +
        '<a data-appname="maps_for_cognos_use_maps" data-plat="use-maps-mobile" data-prefix="/' + localedir +'/maps-for-cognos/-place-holder-folder-/use-maps-mobile" href="/en/maps-for-cognos/" data-langlabel="mobile" class=""> ' + dict['mobile'] + '</a>';
		
		
	if(window.location.pathname.match( /(\/use-maps\/|\/use-maps-mobile\/)/)){
		//val = val.replace("platform-placehoder",useMaps);
		if(window.location.pathname.match( /(\/5.0.1\/)/)){
			val = val.replace("platform-placehoder",useMaps.replace(/-place-holder-folder-\//g,"5.0.1/"));
		}else if(window.location.pathname.match( /(\/6.0\/)/)){
			val = val.replace("platform-placehoder",useMaps.replace(/-place-holder-folder-\//g,"6.0/"));
		}else if(window.location.pathname.match( /(\/6.0.2\/)/)){
			val = val.replace("platform-placehoder",useMaps.replace(/-place-holder-folder-\//g,"6.0.2/"));
		}else{
			val = val.replace("platform-placehoder",useMaps.replace(/-place-holder-folder-\//g,""));
		}		
	} else {
		if(window.location.pathname.match( /(\/5.0.1\/)/)){
			val = val.replace("platform-placehoder",installAndConfigure.replace(/-place-holder-folder-\//g,"5.0.1/"));
		}else if(window.location.pathname.match( /(\/6.0\/)/)){
			val = val.replace("platform-placehoder",installAndConfigure.replace(/-place-holder-folder-\//g,"6.0/"));
		}else if(window.location.pathname.match( /(\/6.0.2\/)/)){
			val = val.replace("platform-placehoder",installAndConfigure.replace(/-place-holder-folder-\//g,"6.0.2/"));
		}else{
			val = val.replace("platform-placehoder",installAndConfigure.replace(/-place-holder-folder-\//g,""));
		}
	}
          
    var fnameFilter = {
             /*"about-apache-configuration.htm": "", "about-web-server-configuration.htm": "", "administrative-and-login-settings.htm": "", "change-the-logging-levels.htm": "",
            "communication-bi-bus-.htm": "", "configuration.htm": "", "configure-an-upstream-proxy.htm": "", "configure-apache.htm": "", "configure-login-settings.htm": "",
            "configure-proxy-settings.htm": "", "control-who-can-access-esri-maps-for-ibm-cognos.htm": "", "create-a-default-map.htm": "", "distribution-options.htm": "",
            "esri-maps-for-ibm-cognos-architecture.htm": "", "generate-an-application-id.htm": "", "ibm-cognos-architecture.htm": "", "ibm-cognos-files.htm": "", "ibm-cognos-fix-packs.htm": "",
            "install-and-configure-em4c-dispatcher.htm": "", "install-and-configure-em4c-gateway.htm": "", "install-and-configure-em4c-server-and-em4c-dispatcher.htm": "",
            "install-and-configure-em4c-server.htm": "", "install-and-configure-on-a-single-computer.htm": "", "installation-options.htm": "", "installation-sequence-for-server-components.htm": "",
            "items-added-to-a-map-enabled-report.htm": "", "required-ibm-cognos-capabilities.htm": "", "supported-arcgis-authentication-methods.htm": "", "supported-environments.htm": "",
            "test-the-configuration.htm": "", "uninstall-esri-maps-for-ibm-cognos.htm": "", "upgrade-esri-maps-for-ibm-cognos.htm": "","report-formats.htm": "","create-the-esri-maps-capability.htm": ""
			"configure-microsoft-internet-information-services-7-x-or-8-x.htm":""*/
        },

		
		//prodDVal = "install-windows",
		prodDVal = "install-windows",
		prodDValUseMaps = "use-maps",
		prodKey = "maps_for_cognos",
		prodKeyUseMaps = "maps_for_cognos_use_maps",
		homePath = "/en/maps-for-cognos",
		defaultSearchProdMeta = "esri-maps-cognos",
		pathname = window.location.pathname,
		parts = pathname.split("/"),
		fname = parts.pop(),
		fldpath = parts.join("/"),
		plat = $.cookie (prodKey) || prodDVal,
		useMapPlat = $.cookie(prodKeyUseMaps) || prodDValUseMaps,
		isHome = fldpath === homePath;

    function modHomeUrls(plat) {
	
        $("a[href]").each(function (i) {
            var $ele = $(this),
				href = $ele.attr("href"),
				parts = href.split("/");
            fname = parts.pop(),
            fld = parts.pop(),
			newHref = href.replace("/" + prodDVal + "/", "/" + plat + "/");
            if(href.match( /(\/use-maps|\/use-maps-mobile)/)){
				newHref = href.replace("/" + prodDValUseMaps + "/", "/" + useMapPlat + "/");
			}
			

            if (href.indexOf(homePath) === 0) {
                //console.log (href + "=>" + newHref);				
                $ele.attr("href", newHref);
            }
        })

    }
	
	function modHelpNavUrls (plt) {
		$(".section-bar nav a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href"),
				newHref = href.replace("/" + prodDVal + "/", "/" + plat + "/");
				if(href.match( /(\/use-maps|\/use-maps-mobile)/) && !window.location.pathname.match( /(\/5.0.1\/)/)){
					newHref = href.replace("/" + prodDValUseMaps + "/", "/" + useMapPlat + "/");
				}
				$ele.attr ("href", newHref);
		});
	}
	
	function updateSearchForm (){
		var prdPlat = $.cookie(prodKeyUseMaps) || prodDValUseMaps;
		var searchProdMeta = (prdPlat === prodDValUseMaps) ? defaultSearchProdMeta : defaultSearchProdMeta + "-mobile";
		
		$('#helpSearchForm input[name=product]').attr("value",searchProdMeta);
	}

    if (!isHome) {
        $('.reference-content .page-title').after(val);
		
		// Update product meta value in search form
		//updateSearchForm();
		
		modHelpNavUrls();
    } else {
        modHomeUrls(plat);
		
		// Update product meta value in search form
		updateSearchForm();
    }


    $("#plats a[data-appname]").each(function (i) {
        var $ele = $(this),
			prefix = $ele.data("prefix"),
			dplat = $ele.data("plat"),
			url;

        if ((fldpath == prefix)) {
            $ele.toggleClass("on");
            url = prefix + fldpath.replace(prefix, "") + "/" + fname;

        } else {
            $ele.toggleClass("off");
            url = prefix + "/" + fname;
			if (fnameFilter.hasOwnProperty(fname)) {
				url = prefix + "/";
			}

        }

        $ele.attr("href", url);
    });


    $('a[data-prefix]').on("click", function (evt) {
        var $ele = $(this),
			url = $ele.attr("href");

        $.cookie ($ele.data ("appname"), $ele.data ("plat"), {expires: new Date(2020,1,1), path:"/"});

        if (isHome) {
            modHomeUrls($ele.data("plat"));
        }
    })


});