function onGoogleLoad() {
  gapi.client.setApiKey('AIzaSyASA5BrNTvmbEi8kOrUMxjiZT_lloyaLbI');
  gapi.client.load('youtube', 'v3', function() {
    var request = gapi.client.youtube.playlistItems.list({
      part: 'snippet',
      playlistId: $('#video-holder').attr('playlistid'),
      maxResults: 4
    });
    request.execute(function(response) {
      for (var i = 0; i < response.items.length; i++) {
        $('#video-holder').append('<div class="flexible-block-group-item flexible-block-group-item-blue flexible-block-group-no-header">'+
                                    '<div class="flexible-block-group-content">'+
                                      '<a href="https://www.youtube.com/embed/'+response.items[i].snippet.resourceId.videoId+'?showinfo=0&amp;autoplay=1" class="colorbox-evlarge cboxElement" title="'+response.items[i].snippet.title+'">'+
                                        '<img alt="'+response.items[i].snippet.title+'" src="'+response.items[i].snippet.thumbnails.high.url+'">'+
                                      '</a>'+
                                      '<h5 class="leader-1">'+response.items[i].snippet.title+'</h5>'+
                                    '</div>'+
                                    '<div class="flexible-block-group-footer">'+
                                      '<a class="colorbox-evlarge text-white" href="https://www.youtube.com/watch?v='+response.items[i].snippet.resourceId.videoId+'">Watch the Video <span class="icon-ui-right icon-ui-small"></span></a>'+
                                    '</div>'+
                                  '</div>');
      }
      $.getScript("/assets/js/video-init.js");
    });
  });
}
$.getScript("https://apis.google.com/js/client.js?onload=onGoogleLoad");
