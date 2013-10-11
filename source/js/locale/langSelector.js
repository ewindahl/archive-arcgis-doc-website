jQuery(document).ready(function ($) {
  return;
/*
    if (window.location.pathname.indexOf ("/maps-for-office/") <0) {
      return;
    }
*/
    (function () {
        var lgCookieKey = "rclg0",

        //RC fully supported langs: key=iso lang code/rc folder name, val=rc folder
            rclgL = {
                "en": "en", "en-US": "en",
                "de": "de",
                "es": "es",
                "fr": "fr",
                "ja": "ja",
                "ru": "ru",
                "zh-CN": "zh-cn", "zh-cn": "zh-cn"
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

            localizedEsriDomains = ['spanda.arcgis.com:4567','docdev.arcgis.com', 'docstg.arcgis.com', 'doc.arcgis.com', 'prodev.arcgis.com', 'prostg.arcgis.com', 'pro.arcgis.com'],
            //fullySupportedItems = 'maps-for-office',

        //all langs
            lgLabels = {

            },


        //https://developer.mozilla.org/en-US/docs/DOM/document.cookie
            cookies = {
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

                removeItem: function (sKey, sPath) {
                    if (!sKey || !this.hasItem(sKey)) { return; }
                    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
                },

                hasItem: function (sKey) {
                    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
                }

            };

        var RCHost = (function (srcHost) {
            if (srcHost.indexOf("res") === 0) {
                return srcHost;
            } else if (srcHost.indexOf("stg") >= 0) {
                return "docstg.arcgis.com";
            } else if (srcHost.indexOf("dev") >= 0) {
                return "docdev.arcgis.com";
            }
            else if (srcHost.indexOf("localhost") >= 0) {
                return "localhost:4567";
            }
            else {
                return "doc.arcgis.com";
            }
        })(window.location.host);



        function isFullLg(lg) {
            return lg in rclgL
        }

        function initLangSelector(lg) {
            $('#lang-block').empty();
            $('<a data-lang="' + lg + '" id="lglink">' + lgPickerLabels[lg] + '<span id="lgarrow" class="arrow-down"></span></a>').appendTo('#lang-block');
            var lgPicker = $('<div/>', { id: 'lgpicker' });
            lgPicker.appendTo('#lang-block');
            $.each(lgPickFull, function (index, langCode) {
                var langTxt = $('<a/>', { 'class': 'lgchoice', 'data-lang': langCode, href: '#', text: lgPickerLabels[langCode] });
                if (lg == langCode) {
                    langTxt.css('font-weight', 'bolder');
                }
                langTxt.appendTo(lgPicker);
            });
        }

        function switchUI(lg, modflg, isForum) {
             lgFld = isFullLg(lg) ? lg : "";


            if (modflg && lg != "en") {


               // Handle Header Links
                   updateLinksAndLabels ($("#site-logo"), lg);

               // Handle Header dropdown text
                $("#dropDown p").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });
                $("#dropDown h4").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });


               // Handle Header Links
                $(isForum ? "#primaryNav li > a" : ".header-inner nav ul li a").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });

               // Handle Footer Links
                $(isForum ? "#primaryNav li > a" : "#footer .container .row nav ul li a").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });

               // Handle Footer column labels
                $(isForum ? "#primaryNav li > a" : "#footer .container .row h4").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });

                 // Handle Footer legal texts
                $("#footer-legal a").each(function (idx) {
                    updateLinksAndLabels ($(this), lg);
                });

               $("#plats a").each(function (idx) {
                    $(this).text(getLocalizedStrings($(this), lg));
               });

            }


            if (lg != "en") {
               // Feedback/404/thank-you
               if($(".feedback")){
                     updateLinksAndLabels ($(".feedback section p"), lg);
                     updateLinksAndLabels ($(".feedback h2"), lg);
                     //updateLinksAndLabels ($("#feedback-form h3"), lg);
                     $("#feedback-form .btn").attr("value",getLocalizedStrings($("#feedback-form .btn")));
                     $("#userFeedback").attr("placeholder",getLocalizedStrings($("#userFeedback")));

                      $(".feedback h1").each(function (idx) {
                                         updateLinksAndLabels ($(this), lg);
                        });
                       $(".feedback h3").each(function (idx) {
                                         updateLinksAndLabels ($(this), lg);
                        });

                     $("#feedback-form label").each(function (idx) {
                                         updateLinksAndLabels ($(this), lg);
                     });

                     // 404 popular links
                     $(".popular-links ul li > a").each(function (idx) {
                        updateLinksAndLabels ($(this), lg);
                     });
                  }

                  // search
                  if($(".search")){

                       updateLinksAndLabels ($(".search h1"), lg);
                     //updateLinksAndLabels ($("#feedback-form h3"), lg);
                     $("#query").attr("value",getLocalizedStrings($("#query"),lg));
                     $("#gl-prev").attr("value",getLocalizedStrings($("#gl-prev"),lg));
                     $("#gl-next").attr("value",getLocalizedStrings($("#gl-next"),lg));

                      $("#filters header .filter-label").each(function (idx) {
                                         updateLinksAndLabels ($(this), lg);
                        });
                       $("#filters .ctrlbox label").each(function (idx) {
                                         updateLinksAndLabels ($(this), lg);
                        });


                     // Show selecting locale options.
                     searchLocaleOptions(lg);


                  }


            }

        }


      function searchLocaleOptions(lg){
         var searchURL = window.location.href;

         $("#localeOptions").css("display","block");


         //searchLanguage value 1 for both English and Native. 0 for native only.
         $("#localeOptions a").each(function (idx) {
             $(this).text(getLocalizedStrings($(this), lg));

             if($(this).attr("id") == "nativeLanguage"){
                  searchURL = searchURL + "&searchLanguage=0";
             } else {
                  searchURL = searchURL + "&searchLanguage=1";
             }


            $(this).attr("href",searchURL);
         });



      }

        function modPage(lgCookie, lgFld) {
            initLangSelector(lgCookie);
            switchUI(lgCookie, lgFld !== lgCookie, false);
            //showLogin(lgCookie);
        }

        function modPageSpecial(lgFld) {
            initLangSelector(lgFld);
            switchUI(lgFld, true, false);
            //showLogin(lgFld);
        }

        function modForumPage(lg) {
            initLangSelector(lg);
            switchUI(lg, true, true);
        }

        function isPartialSupportedPage(lgFld, lgCookie) {
               return (!isFullLg(lgFld) && (lgPartial.indexOf(lgFld) >= 0));
        }

         function isFullySupportedItems(loc){
            var path = loc.pathname;
            var rgxp = new RegExp(fullySupportedItems,"g");
            if(path.match(rgxp)){
               return true;
            } else {
               return false;
            }
         }

        function isISTPage(loc) {
            var path = loc.pathname,
                search = loc.search;

            if (path.indexOf("/apps/feedback") >= 0 || path.indexOf("/apps/login") >= 0 ||
                path.indexOf("/search/") >= 0) {

                var qs = (function (a) {
                    if (a == "") return {};
                    var b = {},
                        i = 0,
                       len = a.length,
                       p = "";

                    for (i = 0; i < len; ++i) {
                        p = a[i].split('=');
                        if (p.length != 2) continue;
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                    }
                    return b;
                })(window.location.search.substring(1).split('&'));

                if ("lg" in qs) {
                    var lg = qs["lg"];
                    if (lg in lgLabels) {
                        return lg;
                    } else {
                        return "en";
                    }
                } else {
                    return "en"
                }
            } else {
                return ""
            }
        }



      /* This function will accept a string and return the corresponding localized string */
      function getLocalizedStrings (obj, lgfld) {

         if(obj === undefined)
               return;

         if(window.localeJsonObj === undefined || obj.attr("data-langlabel") == "") {
               return obj.text();
         } else {
            if(localeJsonObj[lgfld] === undefined){
               lgfld = "en";  //IF datalabel lanugage is not defined pull data from English data structure
            }
            return localeJsonObj[lgfld][obj.attr("data-langlabel")];
         }
      }


      /* Function to determine target localized link and manipulate relevant links accordingly
         parameters:
         href  =  the url which is suppose to be handled
         lgfld =  The language field, eg, en|ja|pl
      */
      function getLocalizedURL (href,lgfld) {
         if(!href)
            return;
         var explodedURL = href.split('/');


         // In case of absolute URL
         if(explodedURL[0].match(/(http:|https:)/gi)){
            //Check whether link is external or one of localized Esri site.
            if(localizedEsriDomains.indexOf(explodedURL[2]) >= 0){
              // Start at index 1, remove 1 elements
              // insert "X" at index 1
              if(lgPickFull.indexOf(explodedURL[3]) >= 0){ // if supported language code is in url
                  explodedURL.splice(3, 1, lgfld);
              }else if (lgfld != "" && lgPickFull.indexOf(lgfld) >= 0) { // If lgfld is non English and fully supported langauge
                  explodedURL.splice(3,0,lgfld);
              }
            }

         } else {
              if(lgPickFull.indexOf(explodedURL[1]) >= 0){ // if supported language code is in url
                  explodedURL.splice(1, 1, lgfld);
              }else if ((lgfld != "" && explodedURL[0] == "") && lgPickFull.indexOf(lgfld) >= 0) { // If lgfld is non English and fully supported langauge. It will handle paths like /test/test.htm
                    explodedURL.splice(1,0,lgfld);
              }
         }
         newHref = explodedURL.join("/");

         return newHref
      }

      /* This function accepts related ui objects, language and update links and lables accordingly */
      function updateLinksAndLabels (obj, lgfld) {
         var href = "#";

         href = getLocalizedURL(obj.attr("href"),lgfld);
         if(obj.attr("data-langlabel") !== undefined) {

            if(href === undefined) {
               obj.html(getLocalizedStrings(obj, lgfld));
            }else {
               obj.attr("href", href).html(getLocalizedStrings(obj, lgfld));
            }
         }
      }


        /* =========================================== */
        var lgCookie = cookies.getItem(lgCookieKey),
            loc = window.location,
            hn = loc.hostname,
            path = loc.pathname,
            pathL = path.split("/"),
            lgIST = "",
            //lgFld = pathL.length > 0 && lgPickFull.indexOf(pathL[1]) >= 0? pathL[1].toLowerCase() : "none",
            bLocale = "en",
            enableEnPath = true;

            if(pathL.length > 0 && lgPickFull.indexOf(pathL[1]) >= 0){
               lgFld = pathL[1].toLowerCase();
            }else {
               //lgFld = "none";
               lgFld = pathL[1];
            }

        function isForum(hn) {
            return (hn === "forumsdev.arcgis.com" || hn === "forums.arcgis.com")
        }

         if(lgCookie == ""){
            //lgCookie = "en"
         }

         function finalDestination(href, hrefL, lgSetting, enableEnPath){
            if(!href.match(/(search|feedback|thank-you|404)/gi)){

                     if(enableEnPath){
                        hrefL[3] = lgSetting;
                     }else if(href.indexof("/search") < 0){
                        if(lgPickFull.indexOf(hrefL[3]) >= 0){

                           //hrefL.splice(3,0,lgfld);
                           if(lgSetting == "en"){
                              //remove langcode
                              hrefL.splice(3,1);  //comment this line when /en will go away
                           }else{
                              hrefL[3] = lgSetting;
                           }
                        }else if(lgSetting != "en"){ //this condition is required as /en is going away
                           // Inject language code instead of replacing the element 3
                           hrefL.splice(3,0,lgSetting);
                        }
                     }

                  cookies.setItem(lgCookieKey, lgSetting, Infinity, "/", ".arcgis.com", false);
                  window.location.replace(hrefL.join("/"));
               }else {
                  cookies.setItem(lgCookieKey, lgSetting, Infinity, "/", ".arcgis.com", false);
                  window.location.reload(true);
               }
         }



        if (isForum(hn)) {
            modForumPage(lgCookie);

        } else if (isPartialSupportedPage(lgFld, lgCookie)) {
            cookies.setItem(lgCookieKey, lgFld, Infinity, "/", ".arcgis.com", false);
            modPageSpecial(lgFld);

        } else if (lgPickFull.indexOf(lgFld) >= 0 && ((lgCookie) && (lgCookie != lgFld && lgFld != "en"))){
             cookies.setItem(lgCookieKey, lgFld, Infinity, "/", ".arcgis.com", false);
             modPage(lgFld);
        } else {

         if (lgCookie) {

                // As per current requirement, we are going to modify header/footer links for all fully/partial supported lanugae. Because both header and footer is common for Git hub pages.
                // This is the reason we commenting out the original if statement and adding the one liner.
                modPageSpecial(lgCookie);

                /*if (isFullLg(lgCookie)) {
                    modPage(lgCookie, lgFld);
                } else {
                    modPageSpecial(lgCookie);
                }*/
            } else {
                bLocale = "en";

                $.ajax({
                    url: 'http://' + RCHost + '/apps/locale/',
                    dataType: 'json',
                    cache: false,
                    timeout: 1000,
                    success: function (data) {
                        if (data.accept_lang) {
                            var langs = data.accept_lang.split(";")[0].split(","),
                            len = langs.length,
                            i = 0;

                            for (i = 0; i < len; i++) {
                                if (isFullLg(langs[i])) {
                                    bLocale = rclgL[langs[i]];
                                    break;
                                }
                            }

                        }
                    },

                    complete: function () {
                        cookies.setItem(lgCookieKey, bLocale, Infinity, "/", ".arcgis.com", false);
                        if(lgPickFull.indexOf(bLocale) >= 0 && bLocale != "en"){
                           // Redirect to corresponding cotent, If the detected language is fully supported.
                            var href = window.location.href,
                            hrefL = href.split("/");
                            finalDestination(href, hrefL, bLocale, enableEnPath);

                        } else { // Else if partially supported, just localize header/footer.
                           modPage(bLocale, lgFld);
                        }
                    }
                });
            }
        }


        //$("#lglink").live("click", function (evt) {
        $("#lglink").click(function (evt) {
            evt.preventDefault();
            $("#lgpicker").toggleClass("show");
            $('#lgarrow').toggleClass('arrow-down arrow-up');
        });



        //$(".lgchoice").live("click", function (evt) {
        $(".lgchoice").click(function (evt) {
            evt.preventDefault();

            var lgSetting = $(this).attr("data-lang"),
                href = window.location.href,
                hrefL = href.split("/"),
                lgval = isISTPage(window.location);

            $("#lgpicker").toggleClass("show");


            if (RCHost === window.location.host) {

               finalDestination(href, hrefL, lgSetting, enableEnPath);


            } else {
                cookies.setItem(lgCookieKey, lgSetting, Infinity, "/", ".arcgis.com", false);
                window.location.replace(hrefL.join("/"));
                //window.location.reload(true);
            }
        });



    })();

})