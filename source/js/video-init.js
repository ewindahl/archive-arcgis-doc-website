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

            // Display the HTML5 Video
            $("#" + videoId).css("display", "block");
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

});