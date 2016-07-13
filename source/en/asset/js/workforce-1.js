$(document).ready(function() {

/*
	data-appname="workforce"
		data-plat="ipad"
		data-plat="iphone"

*/
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
		'<a data-appname="workforce" data-plat="ipad" data-prefix="/' + localedir +'/workforce/ipad" href="/en/workforce/" data-langlabel="ipad" class=""> iPad</a>' +
        ' | ' +
        '<a data-appname="workforce" data-plat="iphone" data-prefix="/' + localedir +'/workforce/iphone" href="/en/workforce/" data-langlabel="iphone" class=""> iPhone</a>' +
        '</p>',

		prodKey = "workforce",
		prodDVal = "ipad",
		prodIpadVal = "ipad",
		prodIOSVal = "iphone",
		homePath = "/en/workforce"
    
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;

    if(!($.cookie (prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad)/gi))) {
      if(navigator.userAgent.match(/(iPhone)/gi)){
		plat = prodIOSVal;
	  }else if(navigator.userAgent.match(/(iPad)/gi)){
		plat = prodIpadVal;
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
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/"),
				newHref = newHref.replace ("/"+prodIpadVal+"/", "/"+plt+"/"); // Temporary, Once links on erb are fixed, we can remove this
				keeplink = $ele.data ("modlink") === false;

			if (!keeplink && href.indexOf (homePath) === 0 ) {
				//console.log (href + "=>" + newHref);
			    $ele.attr("href", newHref);
			}
		})
		
		// Update product meta value in search form
		$('#helpSearchForm input[name=product]').attr("value","workforce-" + plat);
		

	}

	function modHelpNavUrls (plt) {
		$(".navigation-bar nav a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
		});
	}
	
	function modContentLinks (plt) {
		$(".reference-content a[href], .column-16 a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				newHref = newHref.replace (prodIpadVal+"/", plt+"/"); // Temporary, Once links on erb are fixed, we can remove this
				$ele.attr ("href", newHref);
				
		});
	}

	if (!isHome) {
			if(window.location.pathname.match( /(\/fieldwork\/)/)){
				$('.reference-content .page-title').after (val);
			}else{
				modHelpNavUrls (plat);
				modContentLinks (plat);
				// Update product meta value in search form
				$('#helpSearchForm input[name=product]').attr("value","workforce-" + plat);
			}
	} else {
		modHomeUrls (plat);
		modContentLinks (plat);
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