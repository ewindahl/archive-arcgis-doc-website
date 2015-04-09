$(document).ready(function() {

	 
	 if ((navigator.userAgent.match(/(iPhone|iPod|iPad|Android|blackberry)/gi))) {
        // Remove css class "cboxElement", else it will open video on light box.
        $("a.cboxElement").removeClass('cboxElement');

        $(".colorbox-evlarge").click(function () {
            var tempUrl = $(this).attr('href');
            var explodedUrl = tempUrl.split('/');
            var videoId = explodedUrl[4];

            // Replace the href value to avoid refreshing page (also to avoid going to the next pagE)
            $(this).attr('href', 'javascript:void(0)');

            //hide the clicked link/image
            $(this).css("display", "none");

				//Create HTML5 video below the clicked link/image if it does not already exist
				if ($('#' + videoId).length == 0) {
					generateVideo(videoId, this);
				} else {
					$("#" + videoId).css("display", "block");
				}

            videoControl(videoId, tempUrl, this);
        });

        /* function to handle required video events */
        function videoControl(videoId, tempUrl, obj) {
            document.getElementById(videoId).play();
            $("#" + videoId).bind("ended", function () {
                $("#" + videoId).css("display", "none");

                //show the hidden clicked link/image
                $(obj).css("display", "block");

                // Add back the original url in case if user will click on Video link again.
                $(obj).attr('href', tempUrl);
            });
				
				// Prevent multiple video play
				$('audio,video').bind('play', function() {
					activated = this;
					$('audio,video').each(function() {
						if(this != activated) this.pause();
					});
				});
            //
        }
    } else {
        $('#wrapper .colorbox-evlarge').colorbox({
            iframe: true,
            title: function () {
                var tempurl = $(this).attr('href'),
                    videoId = tempurl.split("/")[4],
                    text = $(this).attr('title'),
                    url = "http://video.arcgis.com/watch/" + videoId + "/";
                if (typeof text === 'undefined') {
                    text = ''
                }
                return '<a class="cboxTitleCustom" title="View on the videos site to read localized transcripts and download this video" href="' + url + '" target="_blank">' + text + '</a>';
            },
            scrolling: false,
            innerWidth: "960",
            innerHeight: "540",
            current: "({current} of {total})"
        });
    }
	 
	 function generateVideo(videoId, obj) {
		var source = document.createElement("source");
		source.src = "http://video.arcgis.com/download-video/" + videoId + "/mp4/480";
		source.type = "video/mp4";
		var video = document.createElement("video");
		video.appendChild(source);
		video.setAttribute("height", "240");
		video.setAttribute("id", videoId);
		video.setAttribute("width", "320");
		video.setAttribute("controls", "");
		$(obj).after(video);
	}

});