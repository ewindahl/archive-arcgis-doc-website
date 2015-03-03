var doc = {};

function dbg (s) {
    //window.console && console.info (s);
}
doc.cookieJar = (function(){
    return {
        getItem: function (sKey) {
            if (!sKey || !this.hasItem(sKey)) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
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
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },

        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");

             return true;
        },

        hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
    };

})(); 


doc.l10n = (function () {

    var langList = {
          "en": "en",
          "en-us": "en",
          "ar": "ar", "ar-dz": "ar", "ar-bh": "ar", "ar-eg": "ar",  "ar-iq": "ar",  "ar-jo": "ar", "ar-kw": "ar", "ar-lb": "ar", "ar-ly": "ar", "ar-ma": "ar", "ar-om": "ar", "ar-qa": "ar", "ar-sa": "ar", "ar-sy": "ar", "ar-tn": "ar", "ar-ae": "ar",
          "cs": "cs",
		  "da": "da",
          "de" : "de", "de-at" : "de", "de-de" : "de", "de-li" : "de", "de-ch" : "de",
          "es": "es", "es-us": "es", "es-us": "es", "es-ar": "es", "es-bo": "es", "es-cl": "es", "es-co": "es", "es-cr": "es", "es-do": "es", "es-ec": "es", "es-sv": "es", "es-gt": "es", "es-hn": "es", "es-mx": "es", "es-pr": "es", "es-es": "es", "es-uy": "es", "es-ve": "es",		  
		  "et": "et",
          "fi": "fi", 
		  "fr": "fr", "fr-be": "fr", "fr-ca": "fr", "fr-fr": "fr", "fr-lu": "fr", "fr-ch": "fr",
		  "he": "he", 
          "it": "it", "it-it": "it", "it-ch": "it",
          "ja" : "ja","ja-jp" : "ja",
          "ko": "ko",
		  "lt": "lt", 
		  "lv": "lv", 
          "nl" : "nl", "nl-be" : "nl",
          "no": "no","no-no": "no",
          "pl": "pl",
          "pt-br": "pt-br",
          "pt-pt": "pt-pt",
          "ro": "ro", "ro-mo": "ro",
          "ru": "ru", "ru-mo": "ru",
          "sv": "sv", "sv-fi": "sv", "sv-se": "sv",
		  "th": "th",
		  "tr": "tr", 
          "zh-cn": "zh-cn", "zh-hk": "zh-cn", "zh-mo": "zh-cn", "zh-sg": "zh-cn", "zh-tw": "zh-cn"
      },  


      //RC fully supported langs
      lgPickFull = ['en', 'de', 'es', 'fr', 'ja', 'ru', 'zh-cn', 'ar'],
      lgPartial = ["cs", "da", "et", "fi", "he", "it","ko", "lt", "lv", "nl","no","pl","pt-br","pt-pt","ro","sv", "th", "tr"],

    //all langs
    lgPickerLabels = GLangLabels;

    historyCK = "state404", 
    prefLangCK = "preflang";
	esriAuthCK = "esri_auth";

    return {
        getReferrerLang : function () {
            var ref = document.referrer,
                lg = "en";
            if (ref) {
                var hrefL = ref.split ("/");
                if (hrefL.length>3) {
                    lg = hrefL[3];
                    if (!this.isSupportedLang (lg)) {
                        lg = "en";
                    }
                }
            }
            return lg;
        },

        getUrlLang : function () {
            var loc = window.location,
                path = loc.pathname,
                lg = path.split ("/")[1].toLowerCase();
            
            if (this.isSupportedLang (lg)) {
                return lg;
            } else {
                //not exactly true, could be mistyped language 
                return "en";
            }
        },

        isEN : function (lg) {
            return lg === "en";
        },

        isSupportedLang : function (lg) {
            return lg in lgPickerLabels;
        },

        is404Redirect : function () {
            return doc.cookieJar.getItem (historyCK);
        },

        set404Redirect : function () {
            doc.cookieJar.setItem (historyCK, "y", Infinity, "/", ".arcgis.com");
        },

        rm404Redirect : function () {
            doc.cookieJar.removeItem (historyCK, "/", ".arcgis.com");
        },


        getAgolPref : function () {
            var ckObj =  $.parseJSON (doc.cookieJar.getItem (esriAuthCK));
			return (ckObj)?ckObj.culture : null;
        },

        getSelectorPref : function () {
            return doc.cookieJar.getItem (prefLangCK);
        },

        setLangPref : function (lg) {
            doc.cookieJar.setItem (prefLangCK, lg, Infinity, "/", ".arcgis.com");
        },


        getBrowserPref : function() {
            var lg =  (typeof navigator) != "undefined" ?  (navigator.language || navigator.userLanguage || "").toLowerCase() : "en";
           
            return langList [lg] || "en";
        },

        calcPrefLang : function (selectorType, defaultv) {
            var prefAgol = this.getAgolPref (),
                prefSelector = this.getSelectorPref(),
                prefBrowser = this.getBrowserPref ();

            defaultv = (typeof defaultv === "undefined") ? "en" : defaultv;

            dbg ("calcPrefLang: "+prefSelector + "-" + prefAgol + "-" + prefBrowser + "-" + defaultv);

            return prefSelector || prefAgol || prefBrowser || defaultv || "en";
        },

        setPrefLang : function (lg) {
            doc.cookieJar.setItem(prefLangCK, lg, Infinity, "/", ".arcgis.com", false);
        },


        showSelector : function(lg, selectorType) {
            
            if (selectorType === "agol") {
                return;
            }

            var lgList = (selectorType === "all") ? lgPickFull.concat(lgPartial) : lgPickFull;

            $('<a data-lang="' + lg + '" id="lglink">' + lgPickerLabels[lg] + 
            '<span id="lgarrow" class="arrow-down"></span></a>').appendTo('#lang-block');

            var lgPicker = $('<div/>', { id: 'lgpicker' });
            lgPicker.appendTo('#lang-block');
            $.each(lgList, function (index, langCode) {
                var langTxt = $('<a/>', { 'class': 'lgchoice', 'data-lang': langCode, href: '#', text: lgPickerLabels[langCode] });
                if (lg == langCode) {
                    langTxt.css('font-weight', 'bolder');
                }
                langTxt.appendTo(lgPicker);
            });

            $("#lglink").on ("click", function (evt) {
                evt.preventDefault();
                $("#lgpicker").toggleClass("show");
                $('#lgarrow').toggleClass('arrow-down arrow-up');
            });


            $(".lgchoice").on ("click", function (evt) {
                evt.preventDefault();
                var lgSetting = $(this).attr("data-lang");
                dbg ("lgchoice: " + lgSetting);
                $("#lgpicker").toggleClass("show");
            
                doc.l10n.setPrefLang(lgSetting);

                var url = doc.l10n.toNewUrl (lgSetting);
                dbg ("lgchoice: goto: " + url);
                window.location.replace (url);

            });
        },


        //TODO: neeed? toNewUrl
        toLocaleUrl : function (lg) {
            var loc = window.location,
                path = loc.pathname,
                lang = path.split ("/")[1].toLowerCase(),
                url = "";
                

            if (this.isEN (lang)) {
                url = loc.href.replace ("/en/", "/"+lg+"/");
            } else {
                url = loc.host + "/" + lg + loc.pathname + loc.hash;
            }

            return url;

        },

        //TODO: neeed? toNewUrl
        toENUrl : function () {
            var loc = window.location,
                path = loc.pathname,
                lg = path.split ("/")[1].toLowerCase(),
                url = "";
            
            if (this.isSupportedLang (lg)) {
                url = loc.href.replace ("/"+lg+"/", "/en/");
            } else {
                url = loc.host + "/en" + loc.pathname + loc.hash;
            }

            return url;
        },

        toNewUrl : function (newlg) {
            var loc = window.location,
                path = loc.pathname,
                oldlg = path.split ("/")[1].toLowerCase(),
                url = "";


            if (this.isSupportedLang (oldlg)) {
                url = loc.href.replace ("/"+oldlg+"/", "/"+newlg+"/");

            } else {
                if (this.isEN (newlg)) {
                    url = loc.href;
                } else {
                    url = loc.host + "/" + newlg + loc.pathname + loc.hash;
                }
            }

            dbg ("toNewUrl: " + url);

            return url;
        },

        changeLabel : function (lg) {
            var dict = (window.localeJsonObj || {})[lg];

            if (dict) {
                $("*[data-langlabel]").each (function(i) {
                    var o = $(this),
                        txt = dict[o.attr("data-langlabel")];
                    
                    if (this.tagName === "INPUT" || this.tagName === "input") {
                        o.val (txt);
                    } else if (this.tagName === "TEXTAREA" || this.tagName === "textarea") {
                    	o.attr ("placeholder", txt);		
                    } else if (txt) {
                        o.html (txt);
                    }
                });                
            }
        },

        hasENPage : function (url) {
            //implement defer interface
            return true
        },
		
	pageNotFoundText : function (curlang, referrer) {
		if(curlang != "en"){
			var dict = (window.localeJsonObj || {})[curlang];
			var pageNotFoundNote = dict['404-may-exist-in-english'],
				englishURL = window.location.href + "?lg=en";
				
			// Using getElementbyID as innerHTML is not working as expected with Jquery $("#404_note").innerHTML, specifically on localized pages
			document.getElementById('404_note').innerHTML = pageNotFoundNote;
			document.getElementById('englishLinkNote').innerHTML = dict['404-click-here-for-english'];
			$("#englishLink").attr("href",englishURL.replace ("/"+curlang+"/","/en/"));
		}
	}


    };    
})();

doc.supportForm = (function() {

	return {
	/* Function for the form validation */
		validateFeedbackForm : function(lg){
			var dict = (window.localeJsonObj || {})[lg];
				
			if(document.getElementById('userFeedback').value == ""){
				alert(dict['enter-valid-feedback']);
				document.getElementById('userFeedback').focus();
				return false;
			}
            /*
			if(document.getElementById('userEmail').value == ""){
				alert(dict['enter-valid-email']);
				document.getElementById('userEmail').focus();
				return false;
			}
			*/
			if(!this.ValidCaptcha()){
				alert(dict['enter-valid-captcha']);
				document.getElementById('txtCaptchaInput').focus();
				return false;
			}
		},

		
		/*********** CAptcha related code ****************************/
		/*** The Captcha code (ValidCaptcha, DrawCaptcha) has been copied from http://stackoverflow.com with a reference to http://osticket.com/forums/showthread.php?t=6489&highlight=captcha,
		*	 We did some customization and using it for our feedback form.
		*/
		DrawCaptcha : function () {
			var a = Math.ceil(Math.random() * 9)+ '';
			var b = Math.ceil(Math.random() * 9)+ '';       
			var c = Math.ceil(Math.random() * 9)+ '';  
			var d = Math.ceil(Math.random() * 9)+ '';  
			var e = Math.ceil(Math.random() * 9)+ '';  
			var f = Math.ceil(Math.random() * 9)+ '';  
			var g = '10';  
			var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
			document.getElementById("txtCaptcha").innerHTML = code;
			document.getElementById("txtHiddenCaptcha").value = code;
		},

		ValidCaptcha : function () { 
			function removeSpaces (string) { 
				return string.split(' ').join('');
			};

			var str1 = removeSpaces(document.getElementById('txtHiddenCaptcha').value);
			var str2 = removeSpaces(document.getElementById('txtCaptchaInput').value);
			return (str1 === str2);
		},

	/*************** End of Captcha code *************/



		addReferrerLink : function (curlang) {
			var referPageLink = "",
				tempArr = document.URL.split('?');


			document.getElementById('referPageLink').value = "Return to the " + "<a href=''>referring page</a>";			
			if(tempArr.length >= 2){
				var queryString = tempArr[1];
				var tempArr2 = queryString.split('=');
				if((localeJsonObj[curlang]['return-to-referring-page']) && (tempArr2[0] == "referrer_url" && tempArr2[1] != "")){
					document.getElementById('referPageLink').innerHTML = localeJsonObj[curlang]['return-to-referring-page'];
					$("#feedback-referring-link").attr("href",tempArr2[1]);
				}
			}
		}
	};
})();


