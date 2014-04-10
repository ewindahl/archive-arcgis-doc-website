// custom js implementing the smartbanner solution described in
// http://www.dunnsolutions.com/content/application-development-blog/-/blogs/smart-app-banners-for-ios-and-android

var smartbanner = {

    init: function () {
        // if browser is modern ios browser, don't add banner (A solution for that browser type is already applied).
        if (this.browser_needs_banner()) {

            lang = this.get_lang()

            default_banner_cfg = this.get_l10n_strs(lang)

            $.smartbanner(default_banner_cfg)

        }
    },

    browser_needs_banner: function () {
        return !(/(iPad|iPhone|iPod).*OS [6-7].*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent))
    },

    get_l10n_strs: function (lg) {
        if (typeof localeJsonObj !== "undefined") {
            if (typeof localeJsonObj[lg] === "undefined") return false
        }
        
        banner_strs = {
            "price"             :localeJsonObj[lg]["smart-banner-default-price"],
            "inAppStore"        :localeJsonObj[lg]["inAppStore"],
            "inGooglePlay"      :localeJsonObj[lg]["inGooglePlay"],
            "inWindowsStore"    :localeJsonObj[lg]["inWindowsStore"],
            "button"            :localeJsonObj[lg]["smart-banner-button"]
        }
        for (key in banner_strs) {
            if (banner_strs[key] == "" || banner_strs[key] == null) delete banner_strs[key]
        }
        return banner_strs
    },

    get_lang: function () {
        return this.get_cookie("preflang") || "en"
    },

    get_cookie: function (cname) {
        // adapted from http://www.w3schools.com/js/js_cookies.asp
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            if (jQuery.inArray(name, c)==0) return c.substring(name.length,c.length);
        }
        return false;  
    }
}

$(document).ready(function () {
    smartbanner.init()
});
