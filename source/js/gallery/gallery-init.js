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
        agolAuthCookie: "esri_auth",
        agolHost: "https://devext.arcgis.com",
		  agolCdnBasePath: "//jsdev.arcgis.com/3.16/"
        //agolCdnBasePath: "//cdn.arcgis.com/cdn/8108/js/jsapi/"
    };

   if (hostname == "docstg.arcgis.com") {
        tierObj.tier = "stg",
        tierObj.agolHost = "https://qaext.arcgis.com",
		  tierObj.agolCdnBasePath = "//jsqa.arcgis.com/3.16/"
    } else if (hostname == "doc.arcgis.com") {
        tierObj.tier = "prd",
        tierObj.agolHost = "https://www.arcgis.com",
		  tierObj.agolCdnBasePath = "//js.arcgis.com/3.16/"
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
"BN": "Brunei Darussalam",
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

var galleryTypeList = {
    "document" : ["Image", "Layout", "Desktop Style", "Project Template", "PDF", "Document Link"],
    "tool" : ["Raster function template", "Geodata Service", "Workflow Manager Package", "Rule Package", "Operations Dashboard Add In", "Workflow Manager Service", "Geoprocessing Service"],
    "apps" : ["Code Sample", "Web Mapping Application", "Mobile Application", "Application", "Desktop Application Template", "Desktop Application", "Operation View", "Operations Dashboard Extension"],
    "scenes" : ["Web Scene", "CityEngine Web Scene"],
    "layers": ["Scene Service", "Feature Collection", "Layer", "Explorer Layer", "Tile Package", "Vector Tile Package", "Scene Package", "Layer Package", "Feature Service", "Stream Service", "Map Service", "Vector Tile Service", "Image Service", "WMS", "KML", "OGC", "Globe Service", "CSV", "Shapefile", "GeoJson", "Service Definition", "File Geodatabase", "CAD Drawing"],
    "maps": ["Project Package", "Windows Mobile Package", "Map Package", "Basemap Package", "Mobile Basemap Package", "Mobile Map Package", "Pro Map", "Web Map", "Map Document", "Globe Document", "Scene Document", "Published Map", "Explorer Map", "ArcPad Package", "Map Template"]
}

var galleryTypeExcludeList = {
    "document" : ["Image Service", "Layer"],
    "maps": ["Web Mapping Application", "Code Attachment", "Symbol Set", "Color Set", "Windows Viewer Add In", "Windows Viewer Configuration", "Layer Package"]
}