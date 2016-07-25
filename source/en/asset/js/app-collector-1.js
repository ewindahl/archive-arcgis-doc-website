$(document).ready(function() {

/*
	data-appname="collector"
		data-plat="android"
		data-plat="ios"

*/
var noSwitcherFileList = {
	   "high-accuracy-gps.htm": "Desktop",
		"troubleshoot-collect.htm": "Desktop",
		"gps-high-accuracy-receivers.htm": "Desktop",
		"gps-map-prep.htm": "Desktop",
		"troubleshoot-create-map.htm": "Desktop",
		"gps-config-metadata-storage.htm": "Desktop",
		"gps-receiver-support.htm": "Desktop"
	   
}

   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'].toLowerCase();
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
        '<a data-appname="collector" data-plat="android" data-prefix="/' + localedir +'/collector/android" href="/en/collector/" data-langlabel="android" class=""> Android</a>' +
        ' | ' +
        '<a data-appname="collector" data-plat="ios" data-prefix="/' + localedir +'/collector/ios" href="/en/collector/" data-langlabel="ios" class=""> iOS</a>' +
		   ' | ' +
        '<a data-appname="collector" data-plat="windows" data-prefix="/' + localedir + '/collector/windows" href="/en/collector/" data-langlabel="windows" class=""> Windows</a>' +
        '</p>',

		prodKey = "collector",
      prodDVal = "android",
      prodIOSVal = "ios",
		prodWindowsVal = "windows",
		homePath = "/en/collector",
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;

    if(!($.cookie (prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad)/gi))) {
      plat = prodIOSVal;
      if (!isHome) {
         UASpecificRedirect (plat, pathname);
      }
    } else if(!($.cookie (prodKey)) && (navigator.userAgent.match(/Windows NT/gi))) {
      plat = prodWindowsVal;
      if (!isHome) {
         UASpecificRedirect (plat, pathname);
      }
    }

   function UASpecificRedirect (plat, pathname) {

			var parts = pathname.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = pathname.replace ("/"+prodDVal+"/", "/"+plat+"/");

			if (pathname.indexOf (homePath) === 0 ) {
				window.location.replace(newHref);
            $.cookie (prodKey, plat, {expires: new Date(2020,1,1), path:"/"});
			}

	}

	function modHomeUrls (plat) {
		$("a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr ("href"),
				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plat+"/");

			if (href.indexOf (homePath) === 0 ) {
				//console.log (href + "=>" + newHref);
				$ele.attr ("href", newHref);
			}
		})

	}

	if (!isHome) {
		$('.reference-content .page-title').after (val);
	} else {
		modHomeUrls (plat);
		// Update product meta value in search form
		$('#helpSearchForm input[name=product]').attr("value", "collector-" + plat);
	}


	$("#plats a[data-appname]").each (function (i) {
		var $ele = $(this),
			prefix = $ele.data ("prefix"),
			dplat = $ele.data ("plat"),
			url;

		if ((fldpath.indexOf (prefix) === 0))  {
			$ele.toggleClass ("on");
			url = prefix + fldpath.replace (prefix, "") + "/" + fname;
		} else {
			$ele.toggleClass ("off");
			url = prefix + "/" + fldpath.split("/").pop() + "/" + fname;
			
			if(fname in noSwitcherFileList){
				// disable click
				url = "#";
				$ele.toggleClass ("is-disabled");
			}else{
				$ele.toggleClass ("off");
				url = prefix + "/" + fldpath.split("/").pop() + "/" + fname;
			}

		}

		$ele.attr ("href", url);
	});


	$('a[data-prefix]').on ("click", function (evt) {
		var $ele = $(this),
			url = $ele.attr("href");

		$.cookie ($ele.data ("appname"), $ele.data ("plat"), {expires: new Date(2020,1,1), path:"/"});

		if (isHome) {
			modHomeUrls ($ele.data ("plat"));
		}
	})



});