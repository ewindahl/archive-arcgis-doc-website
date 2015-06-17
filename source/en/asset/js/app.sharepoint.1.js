$(document).ready(function() {

   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'].toLowerCase();
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
        '<a data-appname="sharepoint" data-plat="foundation-server" data-prefix="/' + localedir +'/maps-for-sharepoint/foundation-server" href="/en/maps-for-sharepoint/" data-langlabel="sharepoint-foundation-server" class=""> Foundation/Server</a>' +
        ' | ' +
        '<a data-appname="sharepoint" data-plat="office-365" data-prefix="/' + localedir +'/maps-for-sharepoint/office-365" href="/en/maps-for-sharepoint/" data-langlabel="sharepoint-office-365" class=""> Office 365</a>' +
        '</p>',
		  
		noSwitcherFileList = {
        "test.htm": ""
		},

		prodKey = "sharepoint",
      prodDVal = "foundation-server",
		homePath = "/en/maps-for-sharepoint",
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
	function modContentUrls (plt) {
		$(".navigation-bar nav a[href], .reference-content a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				$ele.attr ("href", newHref);
		});
	}

	if (!isHome) {
			if(!(fname in noSwitcherFileList) && (window.location.pathname.match( /(\/esri-maps-web-part\/|\/install-and-configure\/)/))){
				$('.reference-content .page-title').after (val);
			}else{
				modContentUrls (plat);
				// Update product meta value in search form
				//$('#helpSearchForm input[name=product]').attr("value","esri-maps-sharepoint-" + plat);
			}
	} else {
		modHomeUrls (plat);
		// Update product meta value in search form
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