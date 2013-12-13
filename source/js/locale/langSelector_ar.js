﻿//this file contains core library that is used by all/most pages
function dbg(e){}String.prototype.format||(String.prototype.format=function(){var e=arguments;return this.replace(/{(\d+)}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})}),jQuery(document).ready(function(e){var t=window.location;if(t.pathname.indexOf("/maps-for-office/")<0&&t.pathname.indexOf("/maps-for-sharepoint/")<0)return;var n={};n.cookieJar=function(){return{getItem:function(e){return!e||!this.hasItem(e)?null:decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"))},setItem:function(e,t,n,r,i,s){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))return;var o="";if(n)switch(n.constructor){case Number:o=n===Infinity?"; expires=Tue, 19 Jan 2038 03:14:07 GMT":"; max-age="+n;break;case String:o="; expires="+n;break;case Date:o="; expires="+n.toGMTString()}return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(t)+o+(i?"; domain="+i:"")+(r?"; path="+r:"")+(s?"; secure":""),!0},removeItem:function(e,t,n){return!e||!this.hasItem(e)?!1:(document.cookie=encodeURIComponent(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(n?"; domain="+n:"")+(t?"; path="+t:""),!0)},hasItem:function(e){return(new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie)}}}(),n.l10n=function(){var t={en:"en","en-us":"en",ar:"ar",da:"da",de:"de",es:"es",fr:"fr",it:"it",ja:"ja",ko:"ko",no:"no",pl:"pl","pt-br":"pt-br","pt-pt":"pt-pt",ro:"ro",ru:"ru",sv:"sv","zh-cn":"zh-cn"},r=["en","de","es","fr","ja","ru","zh-cn","ar"],i=["da","it","ko","no","pl","pt-br","pt-pt","ro","sv"],s={en:"English",ar:"عربي",da:"Dansk",de:"Deutsch",es:"Español",fr:"Français",it:"Italiano",ja:"日本語",ko:"한국어",no:"Norsk",pl:"Polski","pt-br":"‮(lisarB)sêugutroP"
,
"pt-pt":"‮(lagutroP)sêugutroP"
,ro:"Română",ru:"Русский",sv:"Svenska","zh-cn":"‮(体简)文中"
},o="preflang";return{getReferrerLang:function(){var e=document.referrer,t="en";if(e){var n=e.split("/");n.length>3&&(t=n[3],this.isSupportedLang(t)||(t="en"))}return t},getUrlLang:function(){var e=window.location,t=e.pathname,n=t.split("/")[1].toLowerCase();return this.isSupportedLang(n)?n:"en"},isEN:function(e){return e==="en"},isSupportedLang:function(e){return e in s},getAgolPref:function(){return null},getSelectorPref:function(){return n.cookieJar.getItem(o)},setLangPref:function(e){n.cookieJar.setItem(o,e,Infinity,"/",".arcgis.com")},getBrowserPref:function(){var e=typeof navigator!="undefined"?(navigator.language||navigator.userLanguage||"").toLowerCase():"en";return t[e]||"en"},calcPrefLang:function(e,t){var n=this.getAgolPref(),r=this.getSelectorPref(),i=this.getBrowserPref();return t=typeof t=="undefined"?"en":t,dbg("calcPrefLang: "+n+"-"+r+"-"+i+"-"+t),n||r||i||t||"en"},setPrefLang:function(e){n.cookieJar.setItem(o,e,Infinity,"/",".arcgis.com",!1)},showSelector:function(t,o){if(o==="agol")return;var u=o==="all"?r.concat(i):r;e('<a data-lang="'+t+'" id="lglink">'+s[t]+'<span id="lgarrow" class="arrow-down"></span></a>').appendTo("#lang-block");var a=e("<div/>",{id:"lgpicker"});a.appendTo("#lang-block"),e.each(u,function(n,r){var i=e("<a/>",{"class":"lgchoice","data-lang":r,href:"#",text:s[r]});t==r&&i.css("font-weight","bolder"),i.appendTo(a)}),e("body").on("click",function(t){e("#lgpicker").hasClass("show")&&(t.preventDefault(),e("#lgpicker").toggleClass("show"),e("#lgarrow").toggleClass("arrow-down arrow-up"))}),e("#lglink").on("click",function(t){t.preventDefault(),e("#lgpicker").toggleClass("show"),e("#lgarrow").toggleClass("arrow-down arrow-up"),t.stopPropagation()}),e(".lgchoice").on("click",function(t){t.preventDefault();var r=e(this).attr("data-lang");dbg("lgchoice: "+r),e("#lgpicker").toggleClass("show"),n.l10n.setPrefLang(r);var i=n.l10n.toNewUrl(r);dbg("lgchoice: goto: "+i),window.location.replace(i)})},toLocaleUrl:function(e){var t=window.location,n=t.pathname,r=n.split("/")[1].toLowerCase(),i="";return this.isEN(r)?i=t.href.replace("/en/","/"+e+"/"):i=t.host+"/"+e+t.pathname+t.hash,i},toENUrl:function(){var e=window.location,t=e.pathname,n=t.split("/")[1].toLowerCase(),r="";return this.isSupportedLang(n)?r=e.href.replace("/"+n+"/","/en/"):r=e.host+"/en"+e.pathname+e.hash,r},toNewUrl:function(e){var t=window.location,n=t.pathname,r=n.split("/")[1].toLowerCase(),i="";return this.isSupportedLang(r)?i=t.href.replace("/"+r+"/","/"+e+"/"):this.isEN(e)?i=t.href:i=t.host+"/"+e+t.pathname+t.hash,dbg("toNewUrl: "+i),i},changeLabel:function(t){var n=(window.localeJsonObj||{})[t];n&&e("*[data-langlabel]").each(function(t){var r=e(this),i=n[r.attr("data-langlabel")];(this.tagName==="INPUT"||this.tagName==="input")&&r.val(i),i&&r.html(i)})},hasENPage:function(e){return!0}}}();var r=typeof docConfig!="undefined"?docConfig:{langSelector:"all"};dbg("start: "+window.location.href);if(r.doctype===void 0||r.doctype==="doc"){dbg("help topic");var i=n.l10n.getUrlLang(),s=n.l10n.calcPrefLang(r.langSelector);dbg("help: "+i+"-"+s);if(n.l10n.isEN(i)&&n.l10n.isSupportedLang(s)&&!n.l10n.isEN(s))return window.location=n.l10n.toLocaleUrl(s),!1;n.l10n.showSelector(s?s:i,r.langSelector)}});