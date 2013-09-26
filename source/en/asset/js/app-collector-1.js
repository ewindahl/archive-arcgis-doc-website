$(document).ready(function() {

/*
	data-appname="collector"
		data-plat="android"
		data-plat="ios"

*/
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
    var val = '<p id="plats">' +
        '<span class="viewing">Viewing: </span>' +
        '<a data-appname="collector" data-plat="android" data-prefix="/' + localedir +'/collector/android" href="/en/collector/" data-langlabel="android" class=""> Android</a>' +
        ' | ' +
        '<a data-appname="collector" data-plat="ios" data-prefix="/' + localedir +'/collector/ios" href="/en/collector/" data-langlabel="ios" class=""> IOS</a>' +
        '</p>',

		prodKey = "collector",
		prodDVal = "android",
		homePath = "/en/collector",
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;

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
		$('.reference-content h2:first').after (val);
	} else {
		modHomeUrls (plat);
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
