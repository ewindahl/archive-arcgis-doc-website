$(document).ready(function() {

/*
	data-appname="collector"
		data-plat="android"
		data-plat="ios"

*/
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'].toLowerCase();
   }
   var dict = (window.localeJsonObj || {})[localedir];

    var val = '<p id="plats" class="doc-platform-switcher">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
        '<a data-appname="operations-dashboard" data-plat="windows-desktop" data-prefix="/' + localedir +'/operations-dashboard/windows-desktop" href="/' + localedir +'/en/operations-dashboard/" data-langlabel="windows" class="">Windows</a>' +
        '<a data-appname="operations-dashboard" data-plat="web" data-prefix="/' + localedir +'/operations-dashboard/web" href="/' + localedir +'/en/operations-dashboard/" data-langlabel="browser" class="">Browser</a>' +
        '</p>',

		prodKey = "operations-dashboard",
		prodDVal = "windows-desktop",
		prodWebVal = "web",
		prodDSearchMetaProd = "ops-dashboard",
		prodWebSearchMetaProd = "ops-dashboard-browser",
		homePath = "/en/operations-dashboard",
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;



	if(!($.cookie (prodKey)) && !(navigator.userAgent.match(/Windows NT/gi))) {
      plat = prodWebVal;
      if (!isHome && !pathname.match( /(\/web\/|\/author\/|\/overview\/)/)) {
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

			if (href.indexOf (homePath+"/" + prodDVal + "/user/") === 0 ) {
				//console.log (href + "=>" + newHref);
				$ele.attr ("href", newHref);
			}
		})

		// Update product meta value in search form
		if(plat == prodWebVal){
			$('#helpSearchForm input[name=product]').attr("value",prodWebSearchMetaProd);
		}

	}

	function modContentLinks (plt) {
		$(".sub-nav nav a[href], .reference-index a[href], .column-17 a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				if(href.match( /(\/user\/)/)){
					$ele.attr ("href", newHref);
				}
		});
	}

	if (!isHome) {
		if(window.location.pathname.match( /(\/user\/)/)){
			$('main h1').after (val);
		}else{
			modContentLinks (plat);
			// Update product meta value in search form
			if(plat == prodWebVal){
				$('#helpSearchForm input[name=product]').attr("value",prodWebSearchMetaProd);
			}
		}
	} else {
		modHomeUrls (plat);
	}


	$("#plats a[data-appname]").each (function (i) {
		var $ele = $(this),
			prefix = $ele.data ("prefix"),
			dplat = $ele.data ("plat"),
			url;

		if ((fldpath.indexOf (prefix) === 0))  {
			$ele.toggleClass ("is-active");
			url = prefix + fldpath.replace (prefix, "") + "/" + fname;
		} else {
			$ele.toggleClass ("available");
			url = prefix + "/" + fldpath.split("/").pop() + "/" + fname;

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
