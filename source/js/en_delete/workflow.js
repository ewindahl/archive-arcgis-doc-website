
$(window).ready (function () {

	var util = {
			genWebApi: function (hostname, webcall) {
				var url=        "http://jules.esri.com:8080/webtask_arcgisweb/";
				//var url_debug = "http://jules.esri.com:8080/webtask_debug/";
				return url + webcall;				
			}, 

			getNS : function (hostname) {
				var v =hostname.split (".");
				return v[0].toLowerCase();
			},

			isDev : function (ns) {
				return ns.substring (ns.length-3) === "dev";	
			},
			
			isStg : function (ns) {
				return ns.substring (ns.length-3)  === "stg";	
			}
		},

		ui = {
			displayWorkflowStatus: function (buf, ns, data) {
				var exeStatus = data.exestatus;
				var exetime="";
				
				if (exeStatus == "1") {
					exetime = data.exetime;
				} else if (exeStatus == "2") {
					exetime = "N/A";
				} else if (exeStatus == "3") {
					exetime = "<span id='err'>Failed: " + data.exetime + "</span>";
				} else {
					exetime = "Unknown";
				}

/*
				var devUrl = "abc";//token2url ("rcdev", "abc");//HashManager.getHash().token);
				var stgUrl = "abc";//token2url ("rcstg", "abc");//HashManager.getHash().token);
				var prdUrl = "abc";//token2url ("rcprd", "abc");//HashManager.getHash().token);
*/
				var devA = "DEV"; //"<a target='_blank' href='" + devUrl +"'>DEV</a>";
				var stgA = "STG"; //"<a target='_blank' href='" + stgUrl +"'>STG</a>";
				var prdA = "Kernel (Ask Eleanor for help)"; //"<a target='_blank' href='" + prdUrl +"'>PRD</a>";


				if (util.isDev(ns)) {
					buf.push ("You are currently viewing topics on <b>DEV</b>. ");
					buf.push ("<br/>The last updates for this module were: <br>");
					
					ui.genTimeTbl (buf, data, 
								"<span id='cur'>DEV -> " + stgA + "</span>", 
								"<span>" + stgA + " -> " + prdA + "</span>",
								exetime , data.stg2prdtime);
											
				} else if (util.isStg(ns)) {
					buf.push ("You are currently viewing topics on <b>STG</b>. ");
					buf.push ("<br/>The last updates for this module were: <br>");
					ui.genTimeTbl (buf, data, 
								"<span>" + devA + " -> STG</span>", 
								"<span id='cur'>STG -> " + prdA + "</span>",
								data.dev2stgtime, exetime);	
												
				} else {
					buf.push ("<span id='err'>Programmer Error</span><br>");
				}
			},


			genTimeTbl: function (buf, data, h0, h1, v0, v1) {
				buf.push ("<ul id='timetbl'><li>" + h0 + ":  "+ v0 + "</li>");
				buf.push ("                 <li>" + h1 + ":  "+ v1 +"</li></ul>");

			},

			gensubmitRequest: function (buf, ns, href) {
				if (util.isDev(ns)) {
					buf.push ("&nbsp;&nbsp;<a href='" + href + "'>Submit a DEV -> STG publication update request</a><br/>");						
				} else if (util.isStg (ns)) {
					buf.push ("&nbsp;&nbsp;<a href='" + href + "'>Submit a STG -> Kernel (Eleanor) publication update request</a><br/>");
				} else {
					buf.push ("<span id='err'>Programmer Error</span><br>");
				}

			},
			
			genUI : function (htm) {
				return "<div id='uploadhd'>Webhelp Status</div><div id='uploadbody'>" + htm + "</div>"
			}

	};


	$("#esri-logo").before ('<a id="wfbtn" href="#" class="icon-gears .light">STATUS</a>');
	$("#header").before ("<div id='wfpanel' data-view='false'>"+
						"<div class='row'><div id='task'></div></div>"+
						"</div>");


	$("#wfbtn").on ("click", function (evt) {
		var $vpanel =$("#wfpanel");

		$vpanel.on ("open.wfpanel", function () {
			var hostname = window.location.hostname,
				wsInit = util.genWebApi (hostname, "ws.py?action=init&reqkey=/"),
				wsUploadModule = util.genWebApi (hostname, "ws.py?action=uploadmodule&reqkey=/"),
				wsNS = util.getNS (hostname);

			//var url = "http://jules.esri.com:8080/webtask_debug/ws.py?action=uploadmodule&reqkey=/rcdev/en/help/main/10.1/0154000002np000000&callback=?";
			//var url = "http://jules.esri.com:8080/webtask_debug/ws.py?action=init&reqkey=/rcdev/en/help/main/10.1/016w0000002r000000&callback=?";
			var url = wsInit + wsNS + window.location.pathname + "&callback=?";

			
			$.getJSON (url, function (data) {
				console.log (url);
				console.log (data);

				var buf = [];

				if (typeof data.error == "undefined") {
					var doneId = data.doneid;
					var todoId = data.todoid;

					ui.displayWorkflowStatus (buf, wsNS, data);
					
					buf.push ("Last Request: " + data.reqtime);
					
					if (todoId == '0' ) {
						var href = wsUploadModule + wsNS + window.location.pathname;
						ui.gensubmitRequest (buf, wsNS, href);
					} 
					
					if (typeof data.debug != "undefined") {
						buf.push (data.debug + "<br/>");
					}
				} else {
					buf.push ("Please click on another topic and try again<br/>");

					if (typeof data.debug != "undefined") {
						buf.push (data.debug + "<br/>");
					}						
				}

				$("#task").html(ui.genUI (buf.join("")));

			});

		})

		if (!$vpanel.data("view")) {
			$vpanel.slideDown('slow');
			$vpanel.data("view", true);
			$vpanel.trigger ("open.wfpanel");

		}  else {
			$vpanel.slideUp('fast');
			$vpanel.data("view", false);
		}
	})

});

