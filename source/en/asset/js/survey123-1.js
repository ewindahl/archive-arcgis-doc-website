$(document).ready(function() {

/*
	data-appname="survey123"
		data-plat="desktop"
		data-plat="browser"

*/
	var noSwitcherFileList = {
	   "xlsformessentials.htm": "Desktop",
		"xlsformsappearance.htm": "Desktop",
		"xlsformnotes.htm": "Desktop",
		"locations.htm": "Desktop",
		"xlsformmultiplelanguagesupport.htm": "Desktop",
		"xlsformrepeats.htm": "Desktop",
		"xlsformcascadingselects.htm": "Desktop",
		"xlsformformulas.htm": "Desktop",
		"xlsformrelevant.htm": "Desktop",
		"xlsforminstancename.htm": "Desktop",
		"xlsformmedia.htm": "Desktop",
		"xlsformsubmissionurl.htm": "Desktop",
		"prepopulateanswers.htm": "Desktop",
		"esricustomcolumns.htm": "Desktop",
		"preparebasemaps.htm": "Desktop",
		"UseOfflineBasemaps.htm": "Desktop"	
	   
	}
	
	
   var localedir = "en";
   if(window.docConfig !== undefined){
      localedir =   docConfig['localedir'];
   }
   var dict = (window.localeJsonObj || {})[localedir];
   
    var val = '<p id="plats">' +
        '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
		'<a data-appname="survey123" data-plat="desktop" data-prefix="/' + localedir +'/survey123/desktop" href="/en/survey123/" data-langlabel="desktop" class=""> Desktop</a>' +
        ' | ' +
        '<a data-appname="survey123" data-plat="browser" data-prefix="/' + localedir +'/survey123/browser" href="/en/survey123/" data-langlabel="browser" class=""> Browser</a>' +
        '</p>',

		prodKey = "survey123",
		prodDVal = "desktop",
		prodDesktopVal = "desktop",
		prodBrowserVal = "browser",
		homePath = "/en/survey123"
    
		pathname = window.location.pathname,
		parts = pathname.split ("/"),
		fname = parts.pop(),
		fldpath = parts.join ("/"),
		plat = $.cookie (prodKey) || prodDVal,
		isHome = fldpath === homePath;

    if(!($.cookie (prodKey)) && !(navigator.userAgent.match(/Windows NT/gi))) {
      plat = prodBrowserVal;
      if (!isHome && !pathname.match( /(\/browser\/)/)) {
         UASpecificRedirect (plat, pathname);
      }
    }
	 
	function isValidPattern(pattern) {
		if (!pattern.match( /(\/analyze-results\/)/)){
			return true;
		} else {
			return false;
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

			if (!keeplink && href.indexOf (homePath) === 0 && isValidPattern(href)) {
				//console.log (href + "=>" + newHref);
			    $ele.attr("href", newHref);
			}
		})
		
		// Update product meta value in search form
		$('#helpSearchForm input[name=product]').attr("value","survey123-" + plat);
		

	}

	function modContentLinks (plt) {
		$(".navigation-bar nav a[href], .reference-content a[href], .column-16 a[href]").each (function (i) {
			var $ele = $(this),
				href = $ele.attr("href");

				parts = href.split("/");
				fname = parts.pop(),
				fld = parts.pop(),
				newHref = href.replace ("/"+prodDVal+"/", "/"+plt+"/");
				
				if(isValidPattern(href)){
					$ele.attr ("href", newHref);
				}
		});
	}
	

	if (!isHome) {
			if(!window.location.pathname.match( /(\/analyze-results\/)/)){
				$('.reference-content .page-title').after (val);
			}else{
				modContentLinks (plat);
				// Update product meta value in search form
				$('#helpSearchForm input[name=product]').attr("value","survey123-" + plat);
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