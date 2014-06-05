var doc = {};
var AGOLURL = 'https://www.arcgis.com/';

doc.itemDetails = (function(){
		
	return {

		
		getAJAXResponse : function(itemId,url,callType,callFor){
			var result;
			var restURL = url || AGOLURL + "/sharing/rest/content/items/" + itemId + "?f=json";
			var callType = callType || false;
			var callBackFn = callBackFn || false
			
			$.ajax({
					
				url: restURL,
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
				//iframeSrc = "http://www.arcgis.com/home/webmap/viewer.html?layers=" + itemDetails.id + "&useExisting=1";
				iframeSrc = itemDetails.url+ "?f=jsapi";
			} else if (itemType == "tools"){
				iframeSrc = "";
			} else {
				// Map
				iframeSrc = "http://www.arcgis.com/home/webmap/embedViewer.html?webmap=" + itemDetails.id + "&extent="+itemDetails.extent.join();
			}
			
			return iframeSrc;
		},


		renderGeneralElementsValues : function(){
			
			$("#itemTitle").text(itemDetails.title);
			$("#socialLinks a").each(function (){
				var updatedHref = $(this).attr('href').replace('itemId-placeholder',itemDetails.id);
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

			$("#mapBy").html("Map By <a href='" + AGOLURL+ "/home/user.html?user=" + itemDetails.owner + "'>" + itemDetails.owner + "</a>. Created " + this.formatDate(itemDetails.created) + ". Modified " + this.formatDate(itemDetails.modified) +".");

			$("#snippet").html(itemDetails.snippet);
			$("#description").html(itemDetails.description);


			if(itemType == "app"){
				
				$(".layers").hide();
				$(".extent").hide();

				var text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch App</a>";

				$("#downloadBtns").html(text);

			} else if(itemType == "tools"){
				$(".layers").hide();
				$(".extent").hide();
				//text = "<a href='"+ itemDetails.url +"' target='_blank' class='btn primary'>Launch Tool</a>";
				text = "<a href='" + AGOLURL + "sharing/content/items/"+itemDetails.id + "/item.pkinfo' target='_blank' class='btn light'>Download File</a>";
				$("#downloadBtns").html(text);
			} else {
				if(itemDetails.extent.length > 0){
					var text = "Left: " + itemDetails.extent[0][0] + ", Right: "+itemDetails.extent[1][0] + ", Top: " + itemDetails.extent[1][1] + ", Bottom: "+itemDetails.extent[0][1];
					$("#map-extent p").html(text);

					text = "<a href='"+ AGOLURL +"home/webmap/viewer.html?webmap=" + itemDetails.id + "' target='_blank' class='btn primary'>Add to My Map</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + AGOLURL + "sharing/content/items/"+itemDetails.id + "/item.pkinfo' target='_blank' class='btn light'>Download File</a>";
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
				tags.push("<li><a href='" + AGOLURL + "home/search.html?t=content&q=tags:" + value + "'>" + value + "</a></li>");
			});
			tags.push("</ul>");
			$("#map-tags").html(tags.join(""));

			//use-constraints
			$("#use-constraints").html(itemDetails.licenseInfo);
			
		},
		
		renderLayers : function(){
			
			var miscData = obj.getAJAXResponse(itemId,AGOLURL+"sharing/rest/content/items/"+itemId+"/data?f=json");
			
			if(!miscData.code){
				
				var layers = [];
				layers.push("<ul>");
				if(miscData.operationalLayers){
					$.each( miscData.operationalLayers, function( key, value ) {
						if(value.url){
							layers.push("<li>"+value.title+"<br/><span style='margin-left: 1.5em;'><a href='" + value.url + "'>" + value.url + "</a></span></li>");
						}
					});
				}

				if(miscData.baseMap){
					$.each( miscData.baseMap.baseMapLayers, function( key, value ) {
						layers.push("<li>"+value.id+"<br/><span style='margin-left: 1.5em;'><a href='" + value.url + "'>" + value.url + "</a></span></li>");
					});
				}
				layers.push("</ul>");

				$("#map-contents-layers").html(layers.join(""));
			}
		},


		renderFeed : function(data){
			
            var i=0;
            var feed = [];
            
			feed.push("<article>");

			
			if(data.comments){
				data.comments.sort(function(a,b) {

					return b.created - a.created;

				})
			}
			
			$.each( data.comments, function( key, value ) {
				if(i < 5) {
					feed.push("<small><time>" + obj.formatDate(value.created) + " by <a href='"+AGOLURL+ "home/user.html?user=" + value.owner + "'>" + value.owner + "</a>" + "</time></small>" +
            "<p>" + decodeURIComponent(value.comment) + "</p>");
				}
				i++;
			});
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
			
			return month[date.getMonth()]+ " " + date.getDay() + ", " + date.getFullYear();
		},
	}



})();




var itemId = getUrlVars()['itemId'];
var itemType = "map";
var obj = doc.itemDetails;
var itemDetails = obj.getItemInfo(itemId);

if(itemDetails && itemDetails.id){
	var itemType 
	//itemType  = (itemDetails.type.match(/application/gi)) ? "app" : "map";

	if(itemDetails.type.match(/Feature Service|Map Service|Image Service|KML|WMS|Feature Collection|Feature Collection Template | Geodata Service | Globe Service/gi)){
		itemType = "layers";
	} else if(itemDetails.type.match(/Geometry Service|Geocoding Service|Network Analysis Service|Geoprocessing Service|Workflow Manager Service/gi)) {
		itemType = "tools";
	}else if(itemDetails.type.match(/Web Mapping Application|Mobile Application|Code Attachment|Operations Dashboard Add In|Operation View/gi)){
		itemType = "app";
	}

	console.log(itemType);
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
			$("#alternateToIframe").css("display","block")
			$("#alternateToIframe").html("<p></p>")
			//$("#alternateToIframe").html("<a href='"+itemDetails.url+"' target='_blank'><img src='"+AGOLURL+"sharing/content/items/"+itemId+"/info/"+(itemDetails.largeThumbnail || itemDetails.thumbnail)+"' class='item-img' border=0></a>");
		}
		obj.renderGeneralElementsValues();

		//feed
		obj.getAJAXResponse(itemId,AGOLURL+"sharing/rest/content/items/"+itemId+"/comments?f=json",true,"feed");
	}

});