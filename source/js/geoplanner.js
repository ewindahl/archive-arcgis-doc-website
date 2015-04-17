
$(document).ready(function() {

	ipaddressLookup = function () {

		if(sitecfg.localhost){
			$(".us").show();
		} else {
			$.ajax({
				type: "GET",
				url: "/apps/shared/services/index.cfm?event=location.getCountryByIp",
				dataType: "json", 
				// Remove the comments below to test for outside of U.S.
				//data: "address=4.18.32.72",
				/*
				* 4.21.164.192 (US)
				* 4.17.143.0 (Canada)
				* 4.18.32.72 (Mexico)
				* 194.225.70.1 (Iran)
				*/
				success: function(msg){
						if (msg.status == 0){
								if (msg.data.country == "US"){
										// Allowed
										$(".us").show();
								}
						}else{
								// Error
								$(".us").hide();
						}
				}
			});
		}
	}

	


	ToggleList = function (e,IDS) {
		//console.log($("."+IDS+ " span")[0])
		var blockContainer = $("."+IDS+ " span")[0]
		//console.log(blockContainer.children)
		//blockContainer.setAttribute("class","icon-plus")
		
		
	  var CState = document.getElementById(IDS);
	  
	  if (CState.style.display != "block") { 
	  	CState.style.display = "block"; 
	  	
	  	//(e.target.children.length > 0)?e.target.children[0].setAttribute("class","icon-minus"):e.target.setAttribute("class","icon-minus");
	  	blockContainer.setAttribute("class","icon-minus")
	  } else { 
	  	CState.style.display = "none"; 
	  	//(e.target.children.length > 0)?e.target.children[0].setAttribute("class","icon-plus"):e.target.setAttribute("class","icon-plus");
	  	blockContainer.setAttribute("class","icon-plus")
	  }
	}
	
});