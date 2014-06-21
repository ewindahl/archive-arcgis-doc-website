var doc = {};
var AGOLURL = (navigator.userAgent.match(/msie/i)) ?'https://www.arcgis.com/' : '//www.arcgis.com/';

doc.itemDetails = (function(){
		
	return {

		getAJAXResponse : function(itemId,url,callType,callFor){
			var result;
			var restURL = url || AGOLURL + "sharing/rest/content/items/" + itemId + "?f=json";
			var callType = callType || false;
			var callBackFn = callBackFn || false
			
			$.ajax({
					
				url: (navigator.userAgent.match(/msie/i)) ? "/apps/proxy/proxy.php?" + restURL : restURL ,
				type: 'GET',
				dataType: 'json',
				async: callType,
				success: function (data) {
					if (data) {
						result = data;
					}

					if(callFor == "feed"){
						obj.renderFeed(data);
					}
				},
				error: function (request, status, error) {
						result = {"code": 203,"message": null,"status": "failure"};
				}
			});

			return result;
		},
		
		getItemInfo: function(itemId){
		

			var data = this.getAJAXResponse(itemId);
	
			return data;
		},
		
			  
		
		
				
		getIframeSource : function(){
						
			if(itemType == "app"){
				iframeSrc = itemDetails.url;
			} else if(itemType == "layers"){
				//iframeSrc = itemDetails.url+ "?f=jsapi";
				iframeSrc = "";
			} else if (itemType == "tools" || itemType == "webscene"){
				iframeSrc = "";
			} else {
				// Map
				var extent=null;
				if(itemDetails.extent)
					extent = itemDetails.extent.join();

				iframeSrc = "http://www.arcgis.com/home/webmap/embedViewer.html?webmap=" + itemDetails.id + "&extent=" + extent;

				var customURL = this.orgUserCustomURL();
				if(customURL){
					iframeSrc = customURL + "/home/webmap/viewer.html?webmap=" + itemDetails.id + "&extent=" + extent;
				}

				
			}
			
			return iframeSrc;
		},

		orgUserCustomURL : function(){
						
			var ckObj = this.getCookie('esri_auth');
			
			if(ckObj && ckObj.urlKey){
				return "http://"+ckObj.urlKey + "." + ckObj.customBaseUrl;
			}
			
			return false;
		},


		renderGeneralElementsValues : function(){
			
			$("#itemTitle").text(itemDetails.title);

			$("#socialLinks a").each(function (){
				var updatedHref = $(this).attr('href').replace('itemId-placeholder',itemDetails.id);
				updatedHref = updatedHref.replace('item-title-placeholder',itemDetails.title);
				
				$(this).attr('href',updatedHref);
			})

			var i = 0;
			$(".ratings h5").each(function (){
				var avgRating = Math.ceil(itemDetails.avgRating);
				if(avgRating <= 0 || i == avgRating)
					return false;
				$(this).removeClass("icon-gray");
				$(this).addClass("icon-blue");
				i++;
			});

			$("#ratingsAndView").text("( "+itemDetails.numRatings+" ratings; "+itemDetails.numViews+" views)");

			$("#mapBy").html(itemTypeLabel + " by <a target='_blank' href='" + AGOLURL+ "/home/user.html?user=" + itemDetails.owner + "'>" + itemDetails.owner + "</a>. Created " + this.formatDate(itemDetails.created) + ". Modified " + this.formatDate(itemDetails.modified) +".");

			$("#snippet").html(itemDetails.snippet);
			$("#description").html(itemDetails.description);


			if(itemType == "app"){
				
				$(".layers").hide();
				$(".extent").hide();

				var text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>View Full Screen</a>";

				$("#downloadBtns").html(text);

			} else if(itemType == "tools"){
				$(".layers").hide();
				$(".extent").hide();
				//text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch Tool</a>";
				text = "<a href='" + AGOLURL + "sharing/content/items/"+itemDetails.id + "/item.pkinfo' target='_blank' class='btn light'>Open in ArcGIS for Desktop</a>";
				$("#downloadBtns").html(text);

			} else if(itemType == "webscene"){
				$(".layers").hide();
				$(".extent").hide();
				//text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch Tool</a>";
				var text = "<a href='" + AGOLURL + "apps/CEWebViewer/viewer.html?3dWebScene="+itemDetails.id + "' target='_blank' class='btn primary'>Open in Map Viewer</a>";
				$("#downloadBtns").html(text);
			} else {

				if(itemDetails.extent.length > 0){
					var text = "Left: " + itemDetails.extent[0][0] + ", Right: "+itemDetails.extent[1][0] + ", Top: " + itemDetails.extent[1][1] + ", Bottom: "+itemDetails.extent[0][1];
					$("#map-extent p").html(text);

					text = "<a href='"+ AGOLURL +"home/webmap/viewer.html?webmap=" + itemDetails.id + "' target='_blank' class='btn primary'>Open in Map Viewer</a>";
					
					// Exclude open in ArcGIS for Desktop from demographics item
					if(getUrlVars()['subType'] != "demographics"){
						text = text + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + AGOLURL + "sharing/content/items/"+itemDetails.id + "/item.pkinfo' target='_blank' class='btn light'>Open in ArcGIS for Desktop</a>";
					}

					if(!this.orgUserCustomURL() && itemType != "layers") {
						$(".map-title").text(itemDetails.title);
						$(".map-title").show();

						text = text + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+ obj.getIframeSource() +"' target='_blank' class='btn light'>View Full Screen</a>";
					}

					$("#downloadBtns").html(text);

					this.renderLayers();
				}
			}


			// Credits information
			$("#map-credits p").html(itemDetails.accessInformation);

			//tags
			var tags = [];
			tags.push("<ul>");
			$.each( itemDetails.tags, function( key, value ) {
				tags.push("<li><a target='_blank' href='" + AGOLURL + "home/search.html?t=content&q=tags:" + value + "'>" + value + "</a></li>");
			});
			tags.push("</ul>");
			$("#map-tags").html(tags.join(""));

			//use-constraints
			$("#use-constraints").html(itemDetails.licenseInfo);
			
		},
		
		renderLayers : function(){
			
			var miscData = obj.getAJAXResponse(itemId,AGOLURL+"sharing/rest/content/items/"+itemId+"/data?f=json");
			
			if(!miscData.code){
				var isLayersExist = false;
				
				var layers = [];
				layers.push("<ul>");
				if(miscData.operationalLayers){
					isLayersExist = true;
					$.each( miscData.operationalLayers, function( key, value ) {
						if(value.url){
							layers.push("<li>"+value.title+"<br/><span style='margin-left: 1.5em;'><a target='_blank' href='" + value.url + "'>" + value.url + "</a></span></li>");
						}
					});
				}

				if(miscData.baseMap){
					isLayersExist = true;
					$.each( miscData.baseMap.baseMapLayers, function( key, value ) {
						layers.push("<li>"+value.id+"<br/><span style='margin-left: 1.5em;'><a target='_blank' href='" + value.url + "'>" + value.url + "</a></span></li>");
					});
				}
				layers.push("</ul>");

				if(isLayersExist){
					$("#map-contents-layers").html(layers.join(""));
				} else {
					$(".layers").hide();
				}
			}
		},


		renderFeed : function(data){
			
            var i=0;
            var feed = [];
            
			feed.push("<article>");

			
			if(data.comments && data.comments.length > 0){
				data.comments.sort(function(a,b) {

					return b.created - a.created;

				})
						
				$.each( data.comments, function( key, value ) {
					if(i < 5) {
						feed.push("<small><time>" + obj.formatDate(value.created) + " by <a target='_blank' href='"+AGOLURL+ "home/user.html?user=" + value.owner + "'>" + value.owner + "</a>" + "</time></small>" +
	            "<p>" + unescape(value.comment) + "</p>");
					}
					i++;
				});
			} else {
				feed.push("<p>No comments yet.<br/>Go ahead and get the conversation started.</p>");
			}
			feed.push("</article>");
			

			$("#comments").html(feed.join("\n"));

			var addCommentBtn = AGOLURL+"home/signin.html?returnUrl=" + AGOLURL + "home/item.html?id="+itemId;
			$("#addCommentBtn").attr('href',addCommentBtn);

		},

		formatDate : function(dateToBeFormatted){
			
			var date = new Date(dateToBeFormatted);
			var newdate = new Date(date);

			var month = new Array();
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "August";
			month[8] = "September";
			month[9] = "October";
			month[10] = "November";
			month[11] = "December";
			
			return month[date.getMonth()]+ " " + date.getDate() + ", " + date.getFullYear();
		},

		getCookie : function(cookieName){
		
			var cookieObj;
			
			if(!this.hasItem(cookieName)){ return null; }
			
			cookieName = unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(cookieName).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
			if(cookieName != ""){
				cookieObj = $.parseJSON(cookieName);
			}
			
			
			return cookieObj;
		},
		
		hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
	}
	
})();




var itemId = getUrlVars()['itemId'];
var itemType = "map";
var itemTypeLabel = "Map"
var obj = doc.itemDetails;
var itemDetails = obj.getItemInfo(itemId);
var cookieName = "esri_auth";
//console.log(itemDetails);

if(itemDetails && itemDetails.id){
	var itemType 
	//itemType  = (itemDetails.type.match(/application/gi)) ? "app" : "map";

	if(itemDetails.type.match(/Feature Service|Map Service|Image Service|KML|WMS|Feature Collection|Feature Collection Template | Geodata Service | Globe Service/gi)){
		itemType = "layers";
		itemTypeLabel = "Map Layer";
	} else if(itemDetails.type.match(/Geometry Service|Geocoding Service|Network Analysis Service|Geoprocessing Service|Workflow Manager Service/gi)) {
		itemType = "tools";
		itemTypeLabel = "Tool";
	}else if(itemDetails.type.match(/Web Mapping Application|Mobile Application|Code Attachment|Operations Dashboard Add In|Operation View/gi)){
		itemType = "app";
		itemTypeLabel = "App";
	}else if(itemDetails.type.match(/Web Scene/gi)){
		itemType = "webscene";
		itemTypeLabel = "Webscene";
	}

}else{
	$("#mapIframe").hide();
	$(".container").html("Item details are not available right now. Please try again later!");
}






function getUrlVars ()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function() {
	
	if(!itemDetails.code){
	
		if(obj.getIframeSource()){
			$("#mapIframe").attr("src", obj.getIframeSource());
		}else{
			$("#mapIframe").hide();
			$("#agol-thumbnail").css("display","block")
			$("#agol-thumbnail").html("<a href='"+itemDetails.url+"' target='_blank'><img src='"+AGOLURL+"sharing/content/items/"+itemId+"/info/"+(itemDetails.largeThumbnail || itemDetails.thumbnail)+"' class='item-img' border=0></a><p>&nbsp;</p>");
		}
		obj.renderGeneralElementsValues();

		//feed
		obj.getAJAXResponse(itemId,AGOLURL+"sharing/rest/content/items/"+itemId+"/comments?f=json",true,"feed");
	}

	$("#gl-search-btn").bind("click", function (evt) {
		window.location  = "/en/living-atlas/#q="+$("#q").val();
	});
		
	$("#gallerySearchForm").bind("submit", function (evt) {
	 $(this).attr("action", "/en/living-atlas/#q="+$("#q").val());
	 $(this).submit();
	});

});