function YTDurationToSeconds(duration) {
  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  var times = {};
  times['hour'] = (parseInt(match[1]) || 0);
  times['minute'] = (parseInt(match[2]) || 0);
  times['second'] = (parseInt(match[3]) || 0);
  var duration_str = '';
  for(inc in times){
    if(times[inc] > 0){
      if(times[inc] == 1){
        duration_str += times[inc].toString()+' '+inc.toUpperCase()+' ';
      }else{
        duration_str += times[inc].toString()+' '+inc.toUpperCase()+'S ';
      }
    }
  }
  return duration_str;
}

function addVideo(video, duration){
  $('#video-holder').append(
    '<div class="card block">'+
      '<figure class="card-image-wrap">'+
        '<a href="https://www.youtube.com/embed/'+video.videoId+'?showinfo=0&amp;autoplay=1" class="colorbox-evlarge cboxElement" title="'+video.title+'" onclick="return false;">'+
          '<img class="card-image" alt="'+video.title+'" src="https://i.ytimg.com/vi/'+video.videoId+'/'+video.image+'.jpg">'+
        '</a>'+
        '<div class="card-image-caption text-darker-gray font-size--3 padding-leader-0 padding-trailer-0 avenir-bold padding-left-half padding-right-half">'+
         duration+
        '</div>'+
      '</figure>'+
      '<div class="card-content padding-leader-half padding-trailer-half padding-left-half padding-right-half">'+
        '<p class="font-size-1 card-last text-blue">'+video.title+'</p>'+
      '</div>'+
    '</div>');
}

function onGoogleLoad() {
  gapi.client.setApiKey('AIzaSyCH-LBvthf-WX7SMc9NvDu7rO9IfOpkqIQ');
  gapi.client.load('youtube', 'v3', function() {
    var request = gapi.client.youtube.playlistItems.list({
      part: 'snippet',
      playlistId: $('#video-holder').attr('playlistid'),
      maxResults: 5
    });
    request.execute(function(response) {
      var videoIds = '';
      videos = {};
      console.log(response.items);
      for (var i = 0; i < response.items.length; i++) {
        videoIds += response.items[i].snippet.resourceId.videoId+",";
        videos[i] = {'videoId': response.items[i].snippet.resourceId.videoId,
                     'title': response.items[i].snippet.title,
                     'image': (response.items[i].snippet.thumbnails.maxres ? 'maxresdefault' : 'mqdefault')};
      }
      console.log(videos);

      var durrequest = gapi.client.youtube.videos.list({
        part: 'contentDetails',
        id: videoIds
      });
      durrequest.execute(function(durresponse) {
        for(var d = 0; d < durresponse.items.length; d++) {
          duration = YTDurationToSeconds(durresponse.items[d].contentDetails.duration);
          addVideo(videos[d], duration);
        }
      });
      $.getScript("/assets/js/video-init.js");
    });
  });
}
$.getScript("https://apis.google.com/js/client.js?onload=onGoogleLoad");
