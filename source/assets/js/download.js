/*
Download.js can be used to support tokenized download on our web pages.
It supports two type of downloads.
1. Public account specific download
2. Org account specific download

How it works:
When user clicks on download links, it checks whether user is signed in or not. if not signed in it will redirect user to login page and trigger the download automatically when user sign back in.
If user is already signed in with the valid account and click on download link, download will start soon.
If user is signed in with a public account, org specific download links will be grayed out. Clicking on grayed out will show an alert message.
An alert message will be flashed, If user is signed in with an expired org account and click on Org specific download link.

Dependencies:
siteCfg.securedDownloadUrl
sitecfg.agolSignin
esri_auth_extn - cookie just to avoid making one more rest call as we already makes one rest call from signin.js. So it's better to create a session specific cookie from sign in.js

Download links should be defined under a div with class .secured-public (for public accounts) or .secured-org (for org accounts).
Download link class should be '.download-link'

*/
$(document).ready(function() {
	var dload = {};

	setTimeout(function(){
	dload.methods = (function(){
		var accountCookieObj = ($.cookie('esri_auth')) ? JSON.parse($.cookie('esri_auth')) : false,
		 accountExtnCookieObj = ($.cookie('esri_auth_extn')) ? JSON.parse($.cookie('esri_auth_extn')) : false;
		var proxyPath = "/apps/proxy/proxy.php";
		var downloadAPI = sitecfg.securedDownloadUrl;

		return {


			loginType: function () {
				if(accountCookieObj && accountExtnCookieObj){
					return "org"
				}else if(accountCookieObj) {
					return "public"
				}else{
					return ""
				}
			},
			getOrgType: function () {
				if(accountExtnCookieObj){
					return accountExtnCookieObj.type
				} else {
					return false
				}
			},
			IsValidSubscription: function () {
				if(accountExtnCookieObj && accountExtnCookieObj.state == "active"){
					return true
				} else {
					return false
				}
			},
			getDownloadLink : function(filename, foldername){
				var result,
				token = accountCookieObj.token;

				$.ajax({

					url: (navigator.userAgent.match(/msie/i)) ? proxyPath + "?" + downloadAPI + filename + "?folder=" + foldername + "&" + "token=" + token : downloadAPI + filename,
					type: 'GET',
					dataType: 'json',
					async:false,
					data: (navigator.userAgent.match(/msie/i))?{} : { token: token, folder: foldername},
					success: function (data) {
						if (data) {
							result = data;
						}
					},
					error: function (request, status, error) {
							result = {"code": 203,"message": null,"status": "failure"};
					}
				});
				return result;
			},
			downloadFile : function(url) {
	    		$('body').append('<iframe src="' + url.replace(/https?:\/\/software\.esri\.com/, "https://software-download.arcgis.com") + '" style="display:none;"></iframe>');
	  		}
		}
	})();


	function getUrlVars ()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}

	function updateSizeLabel (cardObj)
	{
		alert($(cardObj).find(".download-link").attr("data-file-size"));
		var fileSize = $(cardObj).find(".download-link").attr("data-file-size")
		if(fileSize && fileSize.trim() != ""){
			$(cardObj).find(".file-size").text(fileSize)
		}
	}



//Execution
	var redirect = window.encodeURIComponent(window.location.href),
		loginHref = sitecfg["agolSignin"]+"?returnUrl=" + redirect + "?dload=",
		dloadObj = dload.methods;

	// UI Manipulation
	// On select version drop down item
	$(".download-section .card .dropdown-link").click(function (){
		var fileName = $(this).attr("data-app-file")
		var folderName = $(this).attr("data-app-folder")
		var fileSize = $(this).attr("data-file-size")
		var versionLabel = $(this).text()

		var parentObj = $(this).parentsUntil( ".card" )
		 parentObj.find(".dropdown-wrapper .dropdown-selected").fadeOut(50, function(){
            parentObj.find(".dropdown-wrapper .dropdown-selected").text(versionLabel).fadeIn().delay(100);
       });
		parentObj.find(".download-link").attr("data-filename", fileName)
		parentObj.find(".download-link").attr("data-folder", folderName)
		parentObj.find(".download-link").attr("data-file-size", fileSize)

		updateSizeLabel (parentObj)
		return false;
	});


	$(".downloads .card").each(function () {
		if($(this).find("nav a").length == 1){
			//Remove dropdown icon
			$(this).find (".dropdown-selected").removeClass("dropdown")
		}
		$(this).find("nav a").first().trigger("click")

		updateSizeLabel ($(this))
	});


	if(dload.methods.loginType() == "public"){
		// disable Org specific download buttons
		$(".secured-org .download-link").addClass("disabled")
	}




	// Org Account Tokenized downloads.
	$(".secured-org .download-link").click(function (){
		var fileName = $(this).attr("data-filename");
		var folderName = $(this).attr("data-folder");

		if(dload.methods.loginType() != "" ){
			if (dload.methods.getOrgType() && dload.methods.IsValidSubscription()){
				if(fileName != ""){
					var data = dload.methods.getDownloadLink(fileName, folderName);
					dload.methods.downloadFile(data.url);
				}
			} else {
				var localedir = (typeof(docConfig) !== 'undefined') ? docConfig['locale'].toLowerCase():false;
				var localeDict = (localedir && window.localeJsonObj)?window.localeJsonObj[localedir]:false;

				alert ((localeDict && localeDict['invalid-org-acct']) ? localeDict['invalid-org-acct'] : "Please login with a valid Organizationl account!")
				return false;
			}

		} else {
			window.location = loginHref + fileName;
			return false;
		}
	});


	// Public account tokenized downloads
	$(".secured-public .download-link").click(function (){
		var fileName = $(this).attr("data-filename");
		var folderName = $(this).attr("data-folder");

		if(dload.methods.loginType() != "" ){
			if(fileName != ""){
				var data = dload.methods.getDownloadLink(fileName, folderName);
				dload.methods.downloadFile(data.url);
			}
		} else {
			window.location = loginHref + fileName;
			return false;
		}

	});


	// Post sign in trigger download automatically.
	if(getUrlVars ()["dload"]){
		var downloadFileName = getUrlVars ()["dload"];
		if(downloadFileName != "") {
			$('a[data-filename="' + downloadFileName + '"]').click();
		}
	}
	}, 1000);




//js from dveelopers download page
	(function (calcite){
	  var versions = calcite.nodeListToArray(document.querySelectorAll('.js-version'));

	  function switchVersions (e) {

	    var i;
	    var sdkVersion = calcite.eventTarget(e).getAttribute('data-sdk');
	    var versionBreakdown = sdkVersion.split('-');
	    var sdk = versionBreakdown[0]+'-'+versionBreakdown[1];
	    var version = '';

	    // // update the checkmarks
	    var checkmarks = calcite.nodeListToArray(document.querySelectorAll('.js-version[data-sdk^=' + sdk + ']'));

	    // Reassemble the version in case it also had a '-' in it. We have to handle problems like "os-x-10.2.6-2"
	    for (i = versionBreakdown.length - 1; i >= 0; i --) {
	      if (isNaN(parseInt(versionBreakdown[i], 10))) {
	        break;
	      } else {
	        version = versionBreakdown[i] + (version === '' ? '' : '-') + version;
	      }
	    }

	    for (i = checkmarks.length - 1; i >= 0; i--) {
	      calcite.removeClass(checkmarks[i], 'version-is-active');
	    }

	    // // update the text
	    calcite.addClass(calcite.eventTarget(e), 'version-is-active');
	    calcite.nodeListToArray(calcite.closest('dropdown', calcite.eventTarget(e)).querySelectorAll('.js-dropdown-toggle'))[0].textContent = 'Version ' + version;

	    // toggle the versions
	    var allVersions = calcite.nodeListToArray(document.querySelectorAll('.js-download[data-sdk^=' + sdk + ']'));
	    var showVersions = calcite.nodeListToArray(document.querySelectorAll('.js-download[data-sdk="' + sdkVersion + '"]'));

	    for (i = allVersions.length - 1; i >= 0; i--) {
	      calcite.addClass(allVersions[i], 'hide');
	    }

	    for (i = showVersions.length - 1; i >= 0; i--) {
	      calcite.removeClass(showVersions[i], 'hide');
	    }

	    calcite.preventDefault(e);
	  }

	  for (var i = versions.length - 1; i >= 0; i--) {
	    calcite.addEvent(versions[i], calcite.click(), switchVersions);
	  }
	}(window.calcite));

});
