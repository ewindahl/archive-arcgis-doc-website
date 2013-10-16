var doc = {};

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
    var rclgL = {
            "en": "en", "en-US": "en",
            "de": "de",
            "es": "es",
            "fr": "fr",
            "ja": "ja",
            "ru": "ru",
            "zh-CN": "zh-cn", 
            "zh-cn": "zh-cn"
    },

    langList = {
        "en-us": "en",
        "de" : "de",
        "ja" : "ja"
    },  


    //RC fully supported langs
    lgPickFull = ['en', 'de', 'es', 'fr', 'ja', 'ru', 'zh-cn', 'ar'],
    lgPartial = ["da","it","ko","nl","no","pl","pt-br","pt-pt","ro","ru","sv"],

    //all langs
    lgPickerLabels = {
        "en": "English",
        "ar": "عربي",
        "da": "Dansk",
        "de": "Deutsch",
        "es": "Español",
        "fr": "Français",
        "it": "Italiano",
        "ja": "日本語",
        "ko": "한국어",
        "nl": "Nederlands",
        "no": "Norsk",
        "pl": "Polski",
        "pt-br": "Português (Brasil)",
        "pt-pt": "Português (Portugal)",
        "ro": "Română",
        "ru": "Русский",
        "sv": "Svenska",
        "zh-cn": "中文(简体)"
    },

    historyCK = "state404", 
    prefLangCK = "preflang";

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
            return null;
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

            dbg ("calcPrefLang: "+prefAgol + "-" + prefSelector + "-" + prefBrowser + "-" + defaultv);

            return prefAgol || prefSelector || prefBrowser || defaultv || "en";
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
        }


    };    
})();

doc.supportForm = (function() {

	return {
	/* Function for the form validation */
		validateFeedbackForm : function(){
				
			if(document.getElementById('userFeedback').value == ""){
				alert("Please enter the valid feedback!");
				document.getElementById('userFeedback').focus();
				return false;
			}
			if(document.getElementById('userEmail').value == ""){
				alert("Please enter your Email address!");
				document.getElementById('userEmail').focus();
				return false;
			}
			
			if(!ValidCaptcha()){
				alert("Please enter the valid captcha value!");
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
		},

		ValidCaptcha : function () { 
			function removeSpaces (string) { 
				return string.split(' ').join('');
			};

			var str1 = removeSpaces(document.getElementById('txtCaptcha').innerHTML);
			var str2 = removeSpaces(document.getElementById('txtCaptchaInput').value);
			return (str1 === str2);
		},

	/*************** End of Captcha code *************/



		addReferrerLink : function () {
			var referPageLink = "",
				tempArr = document.URL.split('?');

			document.getElementById('referPageLink').value = "Return to the " + "<a href=''>referring page</a>";			
			if(tempArr.length >= 2){
				var queryString = tempArr[1];
				var tempArr2 = queryString.split('=');
				if(tempArr2[0] == "referrer_url" && tempArr2[1] != ""){
					document.getElementById('referPageLink').innerHTML = "Return to the " + "<a href='" + tempArr2[1] +"'>referring page</a>";
				}
			}
		}
	};
})();


