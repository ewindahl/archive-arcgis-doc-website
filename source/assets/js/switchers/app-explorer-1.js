$(document).ready(function() {

  /*
  	data-appname="explorer"
  		data-plat="android"
  		data-plat="ipad"
  		data-plat="windowsphone"

  */
  var localedir = "en";
  if (window.docConfig !== undefined) {
    localedir = docConfig['localedir'];
  }
  var dict = (window.localeJsonObj || {})[localedir];

  var val = '<p id="plats" class="doc-platform-switcher">' +
    '<span class="viewing" data-langlabel="viewing">' + dict['viewing'] + ': </span>' +
    //'<a data-appname="explorer" data-plat="android-phone" data-prefix="/' + localedir + '/explorer/android-phone" href="/en/explorer/" data-langlabel="android-phone" class="">' + dict['android-phone'] + '</a>' +
    //'<a data-appname="explorer" data-plat="android-tablet" data-prefix="/' + localedir + '/explorer/android-tablet" href="/en/explorer/" data-langlabel="android-tablet" class="">' + dict['android-tablet'] + '</a>' +
    '<a data-appname="explorer" data-plat="ipad" data-prefix="/' + localedir + '/explorer/ipad" href="/en/explorer/" data-langlabel="ipad" class="">iPad</a>' +
    '<a data-appname="explorer" data-plat="iphone" data-prefix="/' + localedir + '/explorer/iphone" href="/en/explorer/" data-langlabel="iphone" class="">iPhone</a>' +
    '<a data-appname="explorer" data-plat="android" data-prefix="/' + localedir + '/explorer/android" href="/en/explorer/" data-langlabel="android" class="is-disabled">Android coming soon</a>' +
    '</p>',

    prodKey = "explorer",
    prodDVal = "ipad",
    prodIpadVal = "ipad",
    prodIOSVal = "iphone",
    //prodMacVal = "mac",
    prodAndroidPhoneVal = "android-phone",
    prodAndroidTabletVal = "android-tablet",
    prodWPVal = "windows-phone",
    homePath = "/en/explorer",
    forumPath = "/en/explorer/forum"


  pathname = window.location.pathname,
    parts = pathname.split("/"),
    fname = parts.pop(),
    fldpath = parts.join("/"),
    plat = $.cookie(prodKey) || prodDVal,
    isHome = fldpath === homePath,
    isForum = fldpath === forumPath;

  if (!($.cookie(prodKey)) && (navigator.userAgent.match(/(iPhone|iPod|iPad)/gi))) {
    if (navigator.userAgent.match(/(iPhone|iPod)/gi)) {
      plat = prodIOSVal;
    //} else if (navigator.userAgent.match(/(Macintosh)/gi)) {
    //  plat = prodMacVal;
    } else if (navigator.userAgent.match(/(iPad)/gi)) {
      plat = prodIpadVal;
    }

    if (!isHome) {
      UASpecificRedirect(plat, pathname);
    }
  } /*else if (!($.cookie(prodKey)) && (navigator.userAgent.match(/(Android)/gi))) {
    if (navigator.userAgent.match(/(Mobile)/gi)) {
      plat = prodAndroidPhoneVal;
    } else {
      plat = prodAndroidTabletVal;
    }
    if (!isHome) {
      UASpecificRedirect(plat, pathname);
    }
  }*/

  function UASpecificRedirect(plat, pathname) {

    var parts = pathname.split("/");
    fname = parts.pop(),
      fld = parts.pop(),
      newHref = pathname.replace("/" + prodDVal + "/", "/" + plat + "/");

    if (pathname.indexOf(homePath) === 0) {
      window.location.replace(newHref);
      $.cookie(prodKey, plat, {
        expires: new Date(2020, 1, 1),
        path: "/"
      });
    }

  }


  function modHomeUrls(plt) {
    $("a[href]").each(function(i) {
      var $ele = $(this),
        href = $ele.attr("href"),
        parts = href.split("/");
      fname = parts.pop(),
        fld = parts.pop(),
        newHref = href.replace("/" + prodDVal + "/", "/" + plt + "/"),
        newHref = newHref.replace("/" + prodIpadVal + "/", "/" + plt + "/"); // Temporary, Once links on erb are fixed, we can remove this
      keeplink = $ele.data("modlink") === false;

      if (!keeplink && href.indexOf(homePath) === 0) {
        //console.log (href + "=>" + newHref);
        $ele.attr("href", newHref);
      }
    })

    // Update product meta value in search form
    $('#helpSearchForm input[name=product]').attr("value", "explorer-" + plat);


  }

  function modForumUrls(plt) {
    $(".sub-nav nav a[href], .reference-index a[href], .column-17 a[href], .content-section a[href]").each(function(i) {
      var $ele = $(this),
        href = $ele.attr("href");

      //http://stackoverflow.com/questions/280634/endswith-in-javascript
      if (href.indexOf("/help/", href.length - "/help/".length) !== -1) {
        parts = href.split("/");
        fname = parts.pop(),
          fld = parts.pop(),
          newHref = href.replace("/" + prodDVal + "/", "/" + plt + "/");
        $ele.attr("href", newHref);
      }
    });
  }

  function modHelpNavUrls(plt) {
    $(".sub-nav nav a[href], .reference-index a[href], .column-17 a[href], .content-section a[href]").each(function(i) {
      var $ele = $(this),
        href = $ele.attr("href");

      parts = href.split("/");
      fname = parts.pop(),
        fld = parts.pop(),
        newHref = href.replace("/" + prodDVal + "/", "/" + plt + "/");
      $ele.attr("href", newHref);
    });
  }

  function modContentLinks(plt) {
    $(".sub-nav nav a[href], .reference-index a[href], .column-17 a[href], .content-section a[href]").each(function(i) {
      var $ele = $(this),
        href = $ele.attr("href");

      parts = href.split("/");
      fname = parts.pop(),
        fld = parts.pop(),
        newHref = href.replace("/" + prodDVal + "/", "/" + plt + "/");
      newHref = newHref.replace(prodIpadVal + "/", plt + "/"); // Temporary, Once links on erb are fixed, we can remove this
      $ele.attr("href", newHref);

    });
  }

  if (!isHome) {
    if (isForum) {
      modForumUrls(plat);
    } else {

      if (!window.location.pathname.match(/(\/whats-new\.htm|requirements\.htm|sneak-peek\.htm|faqs\.htm)/)) {
        $('main.column-17 h1, div.content-section h1').after(val);
      } else {
        modHelpNavUrls(plat);
        modContentLinks(plat);
        // Update product meta value in search form
        $('#helpSearchForm input[name=product]').attr("value", "explorer-" + plat);
      }
    }
  } else {
    modHomeUrls(plat);
    modContentLinks(plat);
  }

  $("#plats a[data-appname]").each(function(i) {
    var $ele = $(this),
      prefix = $ele.data("prefix"),
      dplat = $ele.data("plat"),
      url;
    if ((fldpath.indexOf(prefix) === 0)) {
      $ele.toggleClass("is-active");
      url = prefix + fldpath.replace(prefix, "") + "/" + fname;
    } else {
      $ele.toggleClass("available");
      url = prefix + "/" + fldpath.split("/").pop() + "/" + fname;
    }
    if($ele.hasClass('is-disabled')){
      url = '#';
      $ele.click(function () {return false;});
    }

    /*if (!fnameFilter.hasOwnProperty (fname)) {
    	url = prefix + "/" + "help";
    }*/

    $ele.attr("href", url);
    //console.log(url);
  });


  $('a[data-prefix]').on("click", function(evt) {
    var $ele = $(this),
      url = $ele.attr("href");

    $.cookie($ele.data("appname"), $ele.data("plat"), {
      expires: new Date(2020, 1, 1),
      path: "/"
    });

    if (isHome) {
      modHomeUrls($ele.data("plat"));
    }
  })



});
