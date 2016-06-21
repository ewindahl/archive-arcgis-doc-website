var doc = {};
var agolHost = (sitecfg)?sitecfg.portalHostname : "//www.arcgis.com/"
var AGOLURL = (navigator.userAgent.match(/msie/i)) ?'https:' + agolHost : agolHost;

doc.itemDetails = (function(){
		
	return {

		getAJAXResponse : function(itemId,url,callType,callFor){
			var result;
			var restURL = url || AGOLURL + "/sharing/rest/content/items/" + itemId + "?f=json";
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
				
			if(itemType == "maps"){
				// Map
				var extent=null;
				if(itemDetails.extent)
					extent = itemDetails.extent.join();

				iframeSrc = AGOLURL + "/apps/Embed/index.html?webmap=" + itemDetails.id + "&extent=" + extent;

				var customURL = this.orgUserCustomURL();
				/*if(customURL){
					iframeSrc = customURL + "/apps/Embed/index.html?webmap=" + itemDetails.id + "&extent=" + extent + "&preventId=true";
				}*/

			} else {
				iframeSrc = "";
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

		getToken : function () {
            var ckObj =  ($.cookie('esri_auth')) ? JSON.parse($.cookie('esri_auth')) : false
            return (ckObj)?ckObj.token : null;
        },


		renderGeneralElementsValues : function(){
			
			$("#itemTitle").text(itemDetails.title);

			/*meta tag section */
			$(document).attr('title', itemDetails.title + "--Living Atlas of the World | ArcGIS");
			$('meta[name=last-modified]').attr('content', this.formatDate(itemDetails.modified,"searchFriendly"));
			$('meta[name=sub_category]').attr('content', "gallery-"+ itemType);
			$('meta[name=sub_category_label]').attr('content', itemType);
			$('meta[name=description]').attr('content', itemDetails.snippet);
			
			/* End of meta tag section */

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

            if(contentType.hasOwnProperty('label')){
                   $("<span class='premium-content'><img class='esri-premium-icon' src='" + contentType['img'] + "' title='"+contentType['title']+"'>"+contentType['label']+"</span>").insertBefore("#mapBy");
            }

			$("#mapBy").html(itemTypeLabel + " by <a target='_blank' href='" + AGOLURL+ "/home/user.html?user=" + itemDetails.owner + "'>" + itemDetails.owner + "</a>. Created " + this.formatDate(itemDetails.created) + ". Modified " + this.formatDate(itemDetails.modified) +".");

			$("#snippet").html(itemDetails.snippet);
			$("#description").html(itemDetails.description);

			if(itemType == "files"){
				
				$(".layers").hide();
				$(".extent").hide();

				
				var fileUrl = AGOLURL+"/sharing/content/items/"+itemId+"/"+agolDataFolder+"/"
				var text = "<a href='"+ (itemDetails.url || fileUrl) +"' target='_blank' class='btn primary'>Open File</a>";

				$("#downloadBtns").html(text);

				var additionalText = "<p>";
				if(itemDetails.type.match(/Image/)) {
					//$("#description").append("File URL: https:" + fileUrl);	
					additionalText = additionalText + "File URL: https:" + fileUrl + "<br/>"
				}
				additionalText = additionalText + "File Size: " + fileSizeFormat(itemDetails.size);
				additionalText = additionalText + "</p>";
				$("#description").append(additionalText);

			} else if(itemType == "app"){
				
				$(".layers").hide();
				$(".extent").hide();

				var text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch App</a>";

				$("#downloadBtns").html(text);

			} else if(itemType == "tools"){
				$(".layers").hide();
				$(".extent").hide();

				var toolsTargetURL = AGOLURL + "/sharing/content/items/" + itemDetails.id + "/item.pitem";

				//text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch Tool</a>";
				if(itemDetails.type == "Rule Package"){
					toolsTargetURL = AGOLURL + "/sharing/content/items/" + itemDetails.id + "/data";
					text = "<a href='" + toolsTargetURL + "' class='btn primary'>Download</a>";
				} else {
					text = "<a href='" + toolsTargetURL + "' target='_blank' class='btn primary'>Open in ArcGIS for Desktop</a>";	
				}
				
				$("#downloadBtns").html(text);

				// thumbanail link update
				$("#agol-thumbnail").html("<a href='" + toolsTargetURL + "' target='_blank'><img src='"+AGOLURL+"/sharing/content/items/"+itemId+"/info/"+(itemDetails.largeThumbnail || itemDetails.thumbnail)+"' class='item-img' border=0></a><p>&nbsp;</p>");

			} else if(itemType == "webscene"){
				$(".layers").hide();
				$(".extent").hide();

				var websceneTargetURL = AGOLURL + "/home/webscene/viewer.html?webscene="+itemDetails.id;

				var text = "<a href='" + websceneTargetURL + "' target='_blank' class='btn primary'>Open in Scene Viewer</a>";

				if(itemDetails.type == "CityEngine Web Scene") {
					websceneTargetURL = AGOLURL +"/apps/CEWebViewer/viewer.html?3dWebScene=" + itemDetails.id;
					text = "<a href='"+ websceneTargetURL +"' target='_blank' class='btn primary'>View Application</a>";
					text = text + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+ AGOLURL +"/sharing/rest/content/items/" + itemDetails.id +"/data?f=json' class='btn light'>Download</a>";
				}
				

				$("#downloadBtns").html(text);

				$("#agol-thumbnail").html("<a href='" + websceneTargetURL + "' target='_blank'><img src='"+AGOLURL+"/sharing/content/items/"+itemId+"/info/"+(itemDetails.largeThumbnail || itemDetails.thumbnail)+"' class='item-img' border=0></a><p>&nbsp;</p>");
			} else {
				if(itemDetails.extent.length > 0){
					var text = "Left: " + itemDetails.extent[0][0] + ", Right: "+itemDetails.extent[1][0] + ", Top: " + itemDetails.extent[1][1] + ", Bottom: "+itemDetails.extent[0][1];
					$("#map-extent p").html(text);

					var viewerType = "webmap",
					pkItem = "item.pkinfo";
					if (itemType == "layers") {
						viewerType = "layers";
						pkItem = "item.pitem";

						if(itemDetails.type === "Vector Tile Service"){
							var tyleLayerViewBtn = "<a href='" + AGOLURL + "/sharing/content/items/"+itemDetails.id + "/resources/styles/root.json?f=pjson' target='_blank' class='btn light'>View Style</a>";
						}
					}
					text = "<a href='"+ AGOLURL +"/home/webmap/viewer.html?" + viewerType +"=" + itemDetails.id + "' target='_blank' class='btn primary'>Open in Map Viewer</a>";
					
					// Exclude open in ArcGIS for Desktop from demographics item
					//if(getUrlVars()['subType'] != "demographics"){
						var tmpText = (tyleLayerViewBtn)?tyleLayerViewBtn:"<a href='" + AGOLURL + "/sharing/content/items/"+itemDetails.id + "/" + pkItem + "' target='_blank' class='btn light'>Open in ArcGIS for Desktop</a>";

						text = text + "&nbsp;&nbsp;&nbsp;&nbsp;"+tmpText;
					//}
					$("#agol-thumbnail a").attr("href", AGOLURL +"/home/webmap/viewer.html?" + viewerType +"=" + itemDetails.id)

					if(itemType == "maps") {
						$(".map-title").html('<a href="#contentArea">'+itemDetails.title+'</a>');
						$(".map-title").show();

						text = text + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+ obj.getIframeSource() +"' target='_blank' class='btn light'>View Full Screen</a>";
					}


					$("#downloadBtns").html(text);

					this.renderLayers();
				}
			}

			if(itemDetails.typeKeywords.indexOf("Metadata") >=0 ){
				var metaData = "&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+ AGOLURL +"/sharing/rest/content/items/" + itemDetails.id +"/info/metadata/metadata.xml?format=default&output=html' target='_blank' class='btn light'>Metadata</a>";
				$("#downloadBtns").append(metaData);
			}
			


			// Credits information
			$("#map-credits p").html(itemDetails.accessInformation);

			//tags
			var tags = [];
			tags.push("<ul>");
			$.each( itemDetails.tags, function( key, value ) {
				tags.push("<li><a target='_blank' href='" + AGOLURL + "/home/search.html?t=content&q=tags:" + value + "'>" + value + "</a></li>");
			});
			tags.push("</ul>");
			$("#map-tags").html(tags.join(""));

			//use-constraints
			$("#use-constraints").html(itemDetails.licenseInfo);
			
		},
		
		renderLayers : function(){
			
			var miscData = obj.getAJAXResponse(itemId,AGOLURL+"/sharing/rest/content/items/"+itemId+"/data?f=json");
			
			var isLayersExist = false;
			var layers = [];
			layers.push("<ul>");
			if(miscData && !miscData.code){
				
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
			}

			if((!isLayersExist) && itemType == "layers"){
					isLayersExist = true;
					layers.push("<li>"+itemDetails.title+"<br/><span style='margin-left: 1.5em;'><a target='_blank' href='" + itemDetails.url + "'>" + itemDetails.url + "</a></span></li>");
			}

			layers.push("</ul>");

			if(isLayersExist){
				$("#map-contents-layers").html(layers.join(""));
			} else {
				$(".layers").hide();
			}
		},


		renderFeed : function(data){
			
            var i=0;
            var feed = [];
            
			feed.push("<article>");

			if (itemDetails.commentsEnabled) {
				if(data.comments && data.comments.length > 0){
					data.comments.sort(function(a,b) {

						return b.created - a.created;

					})
							
					$.each( data.comments, function( key, value ) {
						if(i < 5) {
							feed.push("<small><time>" + obj.formatDate(value.created) + " by <a target='_blank' href='"+AGOLURL+ "/home/user.html?user=" + value.owner + "'>" + value.owner + "</a>" + "</time></small>" +
		            "<p>" + unescape(value.comment) + "</p>");
						}
						i++;
					});
				} else {
					feed.push("<p>No comments yet.<br/>Go ahead and get the conversation started.</p>");
				}

				var addCommentBtn = AGOLURL+"/home/signin.html?returnUrl=https:" + AGOLURL + "/home/item.html?id="+itemId;
				$("#addCommentBtn").attr('href',addCommentBtn);

			}else{

				feed.push("<p>No comments.<br/>Comments have been disabled for this item.</p>");
				$("#addCommentBtn").hide();
			}
			feed.push("</article>");
			

			$("#comments").html(feed.join("\n"));

			

		},

		formatDate : function(dateToBeFormatted,formatType){
			
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
			
			if(formatType && formatType == "searchFriendly"){
				return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
			} else {
				return month[date.getMonth()]+ " " + date.getDate() + ", " + date.getFullYear();
			}
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
var itemType = "layers";
var itemTypeLabel = "Map Layer"
var obj = doc.itemDetails;
var itemDetails = obj.getItemInfo(itemId);
var cookieName = "esri_auth";
var contentType = {};
var agolDataFolder = "info";
var token = obj.getToken();
var itemFor = "public";
var isFeatureService = false;

/*if(getUrlVars()['ls'] && getUrlVars()['ls'] == "t"){
	window.opener.location.reload(false);
	window.close();
}*/

if(itemDetails && itemDetails.id){
	var itemType 
	var tierObj = getTier(window.location.hostname);

	if(itemDetails.typeKeywords.indexOf("Requires Subscription") >=0 || itemDetails.typeKeywords.indexOf("Requires Credits") >=0){
		itemFor = "premium";
		if(!$.cookie('esri_auth')){
			var agolSigninURL = (sitecfg)?sitecfg.agolSignin:AGOLURL+"/home/signin.html";
			agolSigninURL += "?returnUrl=" + encodeURIComponent(window.location.href + "&ls=t");
			window.location.href = agolSigninURL
			
			//Sing in requires
			//window.open(agolSigninURL, "", "width=800, height=800");
			//myPopupWindow.isPopup = true;
		}

		if (itemDetails.typeKeywords.indexOf("Requires Subscription") >=0) {
	        contentType['label']  = "Subscriber Content";
	        contentType['title']  = "Included with your ArcGIS Online subscription.";
	        contentType['img']  = tierObj.agolCdnBasePath + "esri/css/images/item_type_icons/premiumitem16.png";
	    } else if (itemDetails.typeKeywords.indexOf("Requires Credits") >=0) {
	        contentType['label']  = "Premium Content";
	        contentType['title']  = "Included with your ArcGIS Online subscription and consumes credits.";
	        contentType['img']  = tierObj.agolCdnBasePath + "esri/css/images/item_type_icons/premiumcredits16.png";
	    }
	}

	if(itemDetails.typeKeywords.indexOf("Feature Service") >=0 || itemDetails.type == ("Feature Service")){
		isFeatureService = true;
	}

	if($.inArray(itemDetails.type, galleryTypeList["document"]) >= 0){
		itemType = "files";
		itemTypeLabel = "Files";
		if(itemDetails.type == "Image"){
			agolDataFolder = "data"
		}
	} else if($.inArray(itemDetails.type, galleryTypeList["maps"]) >= 0){
		itemType = "maps";
		itemTypeLabel = "Map";
	}else if($.inArray(itemDetails.type, galleryTypeList["layers"]) >= 0){
		itemType = "layers";
		itemTypeLabel = "Map Layer";
	} else if($.inArray(itemDetails.type, galleryTypeList["tool"]) >= 0) {
		itemType = "tools";
		itemTypeLabel = "Tool";
	}else if($.inArray(itemDetails.type, galleryTypeList["apps"]) >= 0){
		itemType = "app";
		itemTypeLabel = "App";
	}else if($.inArray(itemDetails.type, galleryTypeList["scenes"]) >= 0){
		itemType = "webscene";
		itemTypeLabel = "Webscene";
	}


}else{
	$("#mapIframe").hide();
	$(".item-details").html("<p>&nbsp;</p><div class='alert'>Item details are not available right now. Please try again later!</div>");
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

function fileSizeFormat(fileSize) {
    var i = -1;
	var returnVal
    var units = ['kb', 'mb', 'gb'];
	 
	 if(fileSize > 0){
	
		do {
	        fileSize = fileSize / 1024;
	        i++;
	    } while (fileSize > 1024);
		returnVal = Math.max(fileSize, 0.1).toFixed(1) + " " + units[i];
	 }
    return returnVal
}

$(document).ready(function() {
	
	if(!itemDetails.error){
		if(obj.getIframeSource()){
			$("#mapIframe").attr("src", obj.getIframeSource());
		}else{
			$("#mapIframe").hide();
			$("#agol-thumbnail").css("display","block")
			var fileUrl = AGOLURL+"/sharing/content/items/"+itemId+"/"+agolDataFolder+"/"
			$("#agol-thumbnail").html("<a href='"+(itemDetails.url || fileUrl)+"' target='_blank'><img src='"+AGOLURL+"/sharing/content/items/"+itemId+"/"+agolDataFolder+"/"+(itemDetails.largeThumbnail || itemDetails.thumbnail || itemDetails.name)+"' class='item-img' border=0></a><p>&nbsp;</p>");
		}
		obj.renderGeneralElementsValues();

		//feed
		obj.getAJAXResponse(itemId,AGOLURL+"/sharing/rest/content/items/"+itemId+"/comments?f=json",true,"feed");
	}else{
		$("#mapIframe").hide();
		$(".item-details").html("<p>&nbsp;</p><div class='alert'>Item details are not available right now. Please try again later!</div>");
	}

	$("#gl-search-btn").bind("click", function (evt) {
		window.location  = "/en/living-atlas/#q="+$("#q").val();
	});
		
	$("#gallerySearchForm").bind("submit", function (evt) {
	 $(this).attr("action", "/en/living-atlas/#q="+$("#q").val());
	 $(this).submit();
	});

	if ((itemType == "maps" && itemFor == "premium") && !obj.orgUserCustomURL()) {
		//$("#show_auth_modal")[0].click();
			setTimeout(function () {
				$("#show_auth_modal").removeClass('hide');
					$("#show_auth_modal")[0].click();
			}, 	3000);
	}
	

});