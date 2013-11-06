$(document).ready(function() {

/*
	data-appname="arcgisapp"
		data-plat="android"
		data-plat="ios"
		data-plat="windowsphone"

*/
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }

    var val = '<p id="plats">' +
        '<span class="viewing">Viewing: </span>' +
        '<a data-appname="arcgisapp" data-plat="android" data-prefix="/' + localedir +'/arcgis-app/android" href="/en/arcgis-app/" data-langlabel="android" class=""> Android</a>' +
        ' | ' +
        '<a data-appname="arcgisapp" data-plat="ios" data-prefix="/' + localedir +'/arcgis-app/ios" href="/en/arcgis-app/" data-langlabel="ios" class=""> iOS</a>' +
        ' | ' +
        '<a data-appname="arcgisapp" data-plat="windows-phone" data-prefix="/' + localedir +'/arcgis-app/windows-phone" href="/en/arcgis-app/" data-langlabel="windows-phone" class=""> Windows Phone</a>' +
        '</p>',

		prodKey = "arcgisapp",
		prodDVal = "android",
      prodIOSVal = "ios",
      prodWPVal = "windows-phone",
		homePath = "/en/arcgis-app",
		forumPath = "/en/arcgis-app/forum"

    fnameFilter = {
        "composing-the-map.htm": "", "connect-to-a-mobile-content-server.htm": "", "get-started-faqs.htm": "",
        "publishing-maps-to-your-arcgis-server.htm": "", "understanding-the-map-format.htm": "",
        "uploading-the-map-to-the-mobile-content-server.htm": "", "use-the-app-faqs.htm": "",
        "what-s-new.htm": "", "work-with-my-data-faqs.htm": ""
    },

		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath,
		isForum = fldpath === forumPath;

    if(!($.cookie (prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad)/gi))) {
      plat = prodIOSVal;

      if (!isHome) {
         UASpecificRedirect (plat, pathname);
      }
    } else if (!($.cookie (prodKey)) && (navigator.userAgent.match(/(windows phone)/gi))){
      plat = prodWPVal;
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


	function modHomeUrls (plt) {
		$("a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr ("href"),
				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/"),
				keeplink = $ele.data ("modlink") === false;

			if (!keeplink && href.indexOf (homePath) === 0 ) {
				//console.log (href + "=>" + newHref);
			    $ele.attr("href", newHref);
			}
		})

	}

	function modForumUrls (plt) {
		$(".navigation-bar nav a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

			//http://stackoverflow.com/questions/280634/endswith-in-javascript
			if (href.indexOf("/help/", href.length - "/help/".length) !== -1) {
				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
			}
		});
	}

	if (!isHome) {
		if (isForum) {
			modForumUrls (plat);
		} else {
			$('.reference-content .page-title').after (val);
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

		if (!fnameFilter.hasOwnProperty (fname)) {
			url = prefix + "/" + "help";
		}

		$ele.attr ("href", url);
		//console.log(url);
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
