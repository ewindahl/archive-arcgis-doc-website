$(document).ready(function() {

  function getCookie(ckname) {

	var cookieJar = {
			//https://developer.mozilla.org/en-US/docs/DOM/document.cookie
        	getItem: function (sKey) {
                   	if (!sKey || !this.hasItem(sKey)) { return null; }
                    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
               		},

           	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
                    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
                    var sExpires = "";
                    if (vEnd) {
                        switch (vEnd.constructor) {
                            case Number:
                                sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                                break;
                            case String:
                                sExpires = "; expires=" + vEnd;
                                break;
                            case Date:
                                sExpires = "; expires=" + vEnd.toGMTString();
                                break;
                        }
                    }
                    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
                },

        	removeItem: function (sKey, sPath, sDomain) {
                    if (!sKey || !this.hasItem(sKey)) { return; }
                    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? ";domain="+sDomain : "") + (sPath ? "; path=" + sPath : "");
                	},

            hasItem: function (sKey) {
                return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
               	}

        }, 
  		ckval = $.parseJSON (cookieJar.getItem (ckname) || "{}");
 	
  	return ("email" in ckval) ? {jar:cookieJar, val: ckval}: null;
  };


  function getUserDisplayName(user) {
      var fullName = user && user.fullName || "",
  	      firstName = fullName;

      // Format the name that shows in user profile dropdown
      // If '_', assume the name is before the '_',
      // If ',', assume the name is after the first ','
      // else use the name before the first space
      // issue: https://devtopia.esri.com/WebGIS/arcgis-portal-app/issues/705

      if (fullName.indexOf("_") > -1) {
        firstName = fullName.split("_")[0];
      } else if (fullName.indexOf(",") > -1) {
        firstName = fullName.split(",").slice(1).join(" ");
      } else if (fullName.indexOf(" ") > -1) {
        //firstName = fullName.split(" ").slice(0, -1).join(" ");
        firstName = fullName.split(" ")[0];
      }
      return firstName.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    };


  /* login */
  var ckKey = "esri_auth",
      cookie = getCookie(ckKey);
  
  $(".myconsole").css ("display", "none");

  if (cookie) {
  	$("#logged-out-navigation").addClass ("hide");
  	$("#logged-in-navigation").removeClass ("hide");

        var avatarurl = "/img/no-user-thumb.jpg",
            avatar = "<img width='16px' height='16px' alt='' src='" + avatarurl +"' />";

		var token = cookie.val && cookie.val.token,
			params = {f:"json"},
			portalHostname = sitecfg["portalHostname"], 
      		firstName,
	  		text;
    
    	if (token){
      		params.token = token;
    	}
	    
	    $.getJSON("//" + portalHostname + "/sharing/rest/portals/self", params, function (data) {
      		firstName = getUserDisplayName(data && data.user);          
	  		text = firstName || "SIGN IN";
      		//$(".result").html(text);
	        $("#logged-in-navigation > a").html (avatar+"<span>"+ text +"</span>");

    	});



/*  	
        $("#logged-in-navigation > a").html (avatar+"<span>"+cookie.val["email"]+"</span>");
 */

  	var $linkL = $("#logged-in-navigation .dropdown-menu a");
  	
        if (cookie.val["role"] && cookie.val["role"].indexOf ("admin")>=0) {
          $(".myconsole").css ("display", "block");

          $linkL.eq(0).on ("click", function() {
  		//my console
  		window.location = sitecfg["mkpConsole"];
  	  });
        }
        
        $linkL.eq(1).on ("click", function() {
  		//logout
  		cookie.jar.removeItem (ckKey, "/", ".arcgis.com");
  		window.location.reload(true);
    });

  } else {  	
  	$("#logged-in-navigation").addClass ("hide");
  	$("#logged-out-navigation > a").attr ("href", sitecfg["mkpSignin"]+"?returnUrl="+encodeURIComponent(window.location.href));
  }


  /* app search box */
  $("#mkpSearchForm").submit(function() {
    var term = $("input[name='mkpSearch']").val() || "";
    window.location.href = sitecfg["mkpSearch"] + "?q="+encodeURIComponent(term)
    return false;
  })

  /* help search box */
  $("#helpSearchForm").submit(function() {

    var term = $("#helpSearchForm > input[name='q']").val() || "",
        col = $("#helpSearchForm > input[name='collection']").val() || "",
        prod = $("#helpSearchForm > input[name='product']").val() || "",
        lang = $("#helpSearchForm > input[name='language']").val() || "en",
        query = "/search/?";

    query = query + "q=" + encodeURIComponent(term);
    query = query + "&collection=" + encodeURIComponent(col);
    query = query + "&product=" + encodeURIComponent(prod);
    query = query + "&language=" + encodeURIComponent(lang);

    window.location.href = query;

    return false;

  });
});
