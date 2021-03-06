$(document).ready(function() {

   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
   var dict = (window.localeJsonObj || {})[localedir];

    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
        '<a data-appname="navigator" data-plat="android-phone" data-prefix="/' + localedir +'/navigator/android-phone" href="/en/navigator/" data-langlabel="android-phone" class=""> Android Phone</a>' +
        ' | ' +
        '<a data-appname="navigator" data-plat="android-tablet" data-prefix="/' + localedir +'/navigator/android-tablet" href="/en/navigator/" data-langlabel="android-tablet" class=""> Android Tablet</a>' +
        ' | ' +
		    '<a data-appname="navigator" data-plat="ipad" data-prefix="/' + localedir +'/navigator/ipad" href="/en/navigator/" data-langlabel="ipad" class=""> iPad</a>' +
        ' | ' +
        '<a data-appname="navigator" data-plat="iphone" data-prefix="/' + localedir +'/navigator/iphone" href="/en/navigator/" data-langlabel="iphone" class=""> iPhone</a>'
        '</p>',

		prodKey = "navigator",
    prodTVal = "ipad",
		prodIOSVal = "iphone",
    prodDVal = "android-phone"
    prodATVal = "android-tablet",
		homePath = "/en/navigator"


		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;
    if(!($.cookie (prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh|Android)/gi))) {
      if(navigator.userAgent.match(/(iPhone)/gi)){
			  plat = prodIOSVal;
		  }
      if(navigator.userAgent.match(/(iPad)/gi)){
			  plat = prodTVal;
		  }
      if(navigator.userAgent.match(/(Android)/gi)){
        if(navigator.userAgent.match(/(Mobile)/gi)){
          plat = prodDVal;
        }else{
          plat = prodATVal;
        }
      }

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
				newHref = href.replace (prodDVal+"/", plt+"/"),
				keeplink = $ele.data ("modlink") === false;

			if (!keeplink) {
			    $ele.attr("href", newHref);
			}
		})

		// Update product meta value in search form
		$('#helpSearchForm input[name=product]').attr("value","navigator-" + plat);


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
		if(!window.location.pathname.match( /(\/prepare-maps\/)/)){
			$('.reference-content .page-title').after (val);
		}else{
			modContentLinks (plat);
			// Update product meta value in search form
			$('#helpSearchForm input[name=product]').attr("value","navigator-" + plat);
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
