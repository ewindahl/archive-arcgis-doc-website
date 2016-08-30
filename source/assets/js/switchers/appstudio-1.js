$(document).ready(function() {

   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
		'<a data-appname="appstudio" data-plat="desktop" data-prefix="/' + localedir +'/appstudio/desktop" href="/en/appstudio/" data-langlabel="desktop" class=""> Desktop</a>' +
        ' | ' +
        '<a data-appname="appstudio" data-plat="browser" data-prefix="/' + localedir +'/appstudio/browser" href="/en/appstudio/" data-langlabel="online" class=""> Online</a>'
        '</p>',

		prodKey = "appstudio",
		prodDVal = "desktop",
		prodBrowserVal = "browser",
		prodBrowserMetaProd = "appstudio-browser",
		homePath = "/en/appstudio"

    
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;

    // If not windows desktop
	 if(!($.cookie (prodKey)) && !(navigator.userAgent.match(/Windows NT/gi))) {
      plat = prodBrowserVal;
      if (!isHome && !pathname.match( /(\/browser\/|\/extend-apps\/)/)) {
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


	function modHomeUrls (plt) {
		$("a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr ("href"),
				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace (prodDVal+"/", plt+"/"),
				keeplink = $ele.data ("modlink") === false;

			if (!keeplink) {
			    $ele.attr("href", newHref);
			}
		})
		
		// Update product meta value in search form
		if(plat == prodBrowserVal){
			$('#helpSearchForm input[name=product]').attr("value",prodBrowserMetaProd);
		}
		

	}
	
	function modContentLinks (plt) {
		$(".reference-content a[href], .column-16 a[href], .navigation-bar nav a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href"),
				parts = href.split("/"),
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
				
		});
	}

	if (!isHome) {
		if(window.location.pathname.match( /(\/create-apps\/)/)){
			$('.reference-content .page-title').after (val);
		}else{
			modContentLinks (plat);
			// Update product meta value in search form
			if(plat == prodBrowserVal){
				$('#helpSearchForm input[name=product]').attr("value",prodBrowserMetaProd);
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

		if ((fldpath.indexOf (prefix) === 0) )  {
			$ele.toggleClass ("on");
			url = prefix + fldpath.replace (prefix, "") + "/" + fname;
		} else {
			$ele.toggleClass ("off");
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