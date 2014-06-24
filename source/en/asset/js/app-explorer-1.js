$(document).ready(function() {

/*
	data-appname="explorer"
		data-plat="android"
		data-plat="ipad"
		data-plat="windowsphone"

*/
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
        '<a data-appname="explorer" data-plat="ipad" data-prefix="/' + localedir +'/explorer/ipad" href="/en/explorer/" data-langlabel="ipad" class=""> iPad</a>' +
        ' | ' +
        '<a data-appname="explorer" data-plat="iphone" data-prefix="/' + localedir +'/explorer/iphone" href="/en/explorer/" data-langlabel="iphone" class=""> iPhone</a>' +
        ' | ' +
        '<a data-appname="explorer" data-plat="mac" data-prefix="/' + localedir +'/explorer/mac" href="/en/explorer/" data-langlabel="mac" class=""> Mac</a>'
        '</p>',

		prodKey = "explorer",
		prodDVal = "ipad",
		prodIOSVal = "iphone",
		prodMacVal = "mac",
		prodWPVal = "windows-phone",
		homePath = "/en/explorer",
		forumPath = "/en/explorer/forum"

    
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath,
		isForum = fldpath === forumPath;

console.log(navigator.userAgent);
    if(!($.cookie (prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh)/gi))) {
      if(navigator.userAgent.match(/(iPhone)/gi)){
		plat = prodIOSVal;
	  }else if(navigator.userAgent.match(/(Macintosh)/gi)){
		plat = prodMacVal;
	  }

      if (!isHome) {
         UASpecificRedirect (plat, pathname);
      }
    }/* else if (!($.cookie (prodKey)) && (navigator.userAgent.match(/(windows phone)/gi))){
      plat = prodWPVal;
      if (!isHome) {
         UASpecificRedirect (plat, pathname);
      }
    }*/

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
	
	function modHelpNavUrls (plt) {
		$(".navigation-bar nav a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodIOSVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
				console.log(href);
		});
	}
	
	function modContentLinks (plt) {
		$(".reference-content a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodIOSVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
				console.log(href);
		});
	}

	if (!isHome) {
		if (isForum) {
			modForumUrls (plat);
		} else {
			
			if(window.location.pathname.match( /(\/use-maps\/)/)){
				$('.reference-content .page-title').after (val);
			}else{
				modHelpNavUrls (plat);
				modContentLinks (plat);
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

		/*if (!fnameFilter.hasOwnProperty (fname)) {
			url = prefix + "/" + "help";
		}*/

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