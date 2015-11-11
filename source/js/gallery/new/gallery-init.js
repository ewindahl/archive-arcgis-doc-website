$(document).ready(function () {
    var hostname = window.location.hostname,
        tier = getTier(hostname);

    

   
    if ($("#q").length > 0) {
        $("#q").focus(function () {
            if ($(this).val() == $(this)[0].defaultValue) {
                $(this).val('');
            }
        })
    }


    if ($("#primarySearch").length > 0) {
        $("#primarySearch").attr("action", "http://" + tier.hostname + "/search/");
    }

    //showLogin(tier); done in setlang.js

    //modFeedback(tier); done in setlang.js

    if (typeof initWS != "undefined") {
        initWS();
    }

});


function getTier(hostname) {
    var tierObj = {
        tier: "dev",
        search: "//searchdev.esri.com/v3/index.cfm",
        gallery: "//search.esri.com/v3/index.cfm",
        ipLookupAPI: "/apps/shared/services/index.cfm?event=location.getCountryByIp",
        agolAuthCookie: "esri_auth",
        agolRestApi: "http://www.arcgis.com/sharing/rest/"
    };

   if (hostname == "docstg.arcgis.com") {
        tierObj.tier = "stg",
        tierObj.search = "//searchstg.esri.com/v3/index.cfm",
        tierObj.gallery = "//searchstg.esri.com/v3/index.cfm"
        return tierObj
    } else if (hostname == "doc.arcgis.com") {
        tierObj.tier = "prd",
        tierObj.search = "//search.esri.com/v3/index.cfm",
        tierObj.gallery = "//search.esri.com/v3/index.cfm"
    } else {
        tierObj.ipLookupAPI = "http://docdev.arcgis.com" + "/apps/shared/services/index.cfm?event=location.getCountryByIp";
    }

    return tierObj 
}

var conuntryCodeMapping = {
"WO": "World",
"US": "United States",
"AR": "Argentina",
"AU": "Australia",
"AT": "Austria",
"BE": "Belgium",
"BO": "Bolivia",
"BR": "Brazil",
"BG": "Bulgaria",
"CA": "Canada",
"CL": "Chile",
"CN": "China",
"CO": "Colombia",
"CR": "Costa Rica",
"CI": "Côte d'Ivoire",
"CZ": "Czech Republic",
"DK": "Denmark",
"EG": "Egypt",
"SV": "El Salvador",
"EE": "Estonia",
"FI": "Finland",
"FR": "France",
"DE": "Germany",
"GR": "Greece",
"GL": "Greenland",
"GT": "Guatemala",
"HK": "Hong Kong",
"IS": "Iceland",
"IN": "India",
"ID": "Indonesia",
"IQ": "Iraq",
"IE": "Ireland",
"IL": "Israel",
"IT": "Italy",
"JP": "Japan",
"KE": "Kenya",
"KW": "Kuwait",
"LV": "Latvia",
"LI": "Liechtenstein",
"LT": "Lithuania",
"LU": "Luxembourg",
"MO": "Macau",
"MG": "Madagascar",
"MY": "Malaysia",
"ML": "Mali",
"MX": "Mexico",
"MA": "Morocco",
"NL": "Netherlands",
"NZ": "New Zealand",
"NI": "Nicaragua",
"NO": "Norway",
"PA": "Panama",
"PE": "Peru",
"PL": "Poland",
"PT": "Portugal",
"PR": "Puerto Rico",
"RO": "Romania",
"RU": "Russia",
"RW": "Rwanda",
"SG": "Singapore",
"SK": "Slovak Republic",
"ZA": "South Africa",
"KR": "South Korea",
"ES": "Spain",
"SR": "Suriname",
"SE": "Sweden",
"CH": "Switzerland",
"TW": "Taiwan",
"TH": "Thailand",
"TN": "Tunisia",
"VI": "U.S. Virgin Islands",
"AE": "United Arab Emirates",
"GB": "United Kingdom",
"VE": "Venezuela",
"VN": "Vietnam"
}