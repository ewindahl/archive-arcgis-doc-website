$(document).ready(function() {

$('#docWrapper .colorbox-iframe').colorbox({ iframe: true, scrolling: false, innerWidth: "960", innerHeight: "540", current: "({current} of {total})" });

	if((navigator.userAgent.match(/(iPhone|iPod|iPad|Android|blackberry)/gi))) {
		// Remove css class "cboxElement", else it will open video on light box.
		$("a.cboxElement").removeClass('cboxElement');

		 $(".colorbox-evlarge").click(function() {
				 var tempUrl = $(this).attr('href');
				 var explodedUrl = tempUrl.split('/');
				 var videoId = explodedUrl[4];

				 // Replace the href value to avoid refreshing page (also to avoid going to the next pagE)
				 $(this).attr('href','javascript:void(0)');

            //hide the clicked link/image
            $(this).css("display", "none");

				// Display the HTML5 Video
				$("#"+videoId).css("display","block");
				videoControl (videoId, tempUrl, this);
			});

			/* function to handle required video events */
			function videoControl (videoId, tempUrl, obj) {
				document.getElementById(videoId).play();
				$("#"+videoId).bind("ended", function() {
					$("#"+videoId).css("display","none");

                //show the hidden clicked link/image
                $(obj).css("display", "block");

               // Add back the original url in case if user will click on Video link again.
					$(obj).attr('href', tempUrl);
				});
				//
			}
	}

});