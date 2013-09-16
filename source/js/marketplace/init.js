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
  }

  /* login */
  ckKey = "esri_auth";
  cookie = getCookie(ckKey);
  
  if (cookie) {
  	$("#logged-out-navigation").addClass ("hide");
  	$("#logged-in-navigation").removeClass ("hide");

        var avatarurl = "http://www.gravatar.com/avatar/d7970fec8803bdbeeb5d82674a1a2c8b.jpg?s=16&d=http://d3w50ib5d2uy0g.cloudfront.net/cdn/2464/js/esri/arcgisonline/css/images/no-user-thumb.jpg",
            avatar = "<img width='16px' height='16px' alt='' src='" + avatarurl +"' />";
  	
            $("#logged-in-navigation > a").html (avatar+"<span>"+cookie.val["email"]+"</span>");
  	
  	var $linkL = $("#logged-in-navigation .dropdown-menu a");
  	$linkL.eq(0).on ("click", function() {
  		//my console
  		window.location = sitecfg["mkpConsole"];
  	});
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
    var term = $("#helpSearchForm > input[name='q']").val() || "";
    window.location.href = "/search/?q="+encodeURIComponent(term);
    return false;
  });
});
