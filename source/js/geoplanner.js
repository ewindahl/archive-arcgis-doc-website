
$(document).ready(function() {
	$(".us").hide();
            $(".international").hide();
      $.ajax({
            type:"GET",
            url:"http://docdev.arcgis.com/apps/proxy/proxy.php?http://dev.esri.com/special/agol/agol_trial_pricing.xml",
            dataType:"text",
				format: "jsonp",
            success:function(xmlString){
                  internationalOptions = xmlToJson(xmlString, true);
                  $.ajax({
                        type: "GET",
                        url: "http://docdev.arcgis.com/apps/proxy/proxy.php?http://dev.esri.com/shared/services/index.cfm?event=location.getCountryByIp",
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
                                    var columnNameRow = internationalOptions.Workbook.Worksheet[0].Table.Row[1],
                                    indexOfCC = columnNameRow.Cell.indexOfAlt("Two-letter Country Code",function(item){return item.Data;}),
                                    indexOfTrial = columnNameRow.Cell.indexOfAlt("Free Trial Subscription Form Access",function(item){return item.Data;}),
                                    row = internationalOptions.Workbook.Worksheet[0].Table.Row.filter(function(row){return row.Cell[indexOfCC].Data==msg.data.country;})[0];
                                    if (row) {
                                          var showTrial = false;//row.Cell[indexOfTrial].Data=="Opted In";
                                          // No errors
                                          if (msg.data.country == "US" || showTrial){
                                                // Allowed
                                                $(".us").show();
                                                $('.smallReg').map(function(index){
                                                      this.innerHTML= currency + this.innerHTML.replace(/\$(\d{1,3},\d{3}|\d)*/gi, prices[index].replace(/\B(?=(\d{3})+(?!\d))/g, ","));})
                                          } else{
                                                // Not Allowed
                                                $(".international").show();
                                          } 
                                    } else if (msg.data.country == "US" ) {
                                          $(".us").show();
                                    } else {
                                          $(".international").show();
                                    }
                              }else{
                                    // Error
                                    $(".us").hide();
                              }
                        }
                  });
            }
      });

	


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