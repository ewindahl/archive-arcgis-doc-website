

;(function($) {
  'use strict';

  $.fn.rssFeed = function(options) {
      var opts = $.extend({}, $.fn.rssFeed.defaults, options);
      
      return this.each(function() {
          var url = opts.url,
              node = this;

          $.ajax ({
            cache: false,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            url : "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent (url)
          }).done (function(feed) {
            if (feed) {
              $.fn.rssFeed.format (node, feed, opts.max)
            }
          }).fail (function (xhr, status, err) {
          }).always (function() {
          });
      });
            
  };

  $.fn.rssFeed.defaults = {
    url:  "http://blogs.esri.com/esri/arcgis/feed/",
    max: 2
  };

  $.fn.rssFeed.format = function (node, feed, narticles) {

    function formatTheDate(feedDate){
      function toMonth (m) {
        return {
          1: "January",2:  "February",3: "March",
          4: "April",5: "May",6: "June",
          7: "July",8: "August",9: "September",
          10: "October",11: "November",12: "December"
        }[m];
      }
      var entrydate=new Date(feedDate);
      var entrydatestr=' '+toMonth(entrydate.getMonth()+1)+" "+entrydate.getDate()+", "+entrydate.getFullYear();
      return entrydatestr;
    }    

    function cleanText (s) {
      s = s.replace (/&lt;!--[\s\S]*][\s](--&gt;)?/gmi, "");
      return s;
    }

    var max = narticles,
        data = feed.responseData.feed.entries,
        buf = [];

    for(var i=0; i<data.length && i<max; i++){
      var item= data[i];
      buf.push ("<article>"+
            "<h4><a href='" + item.link + "'>" + item.title + "</a></h4>"+
            "<small><time>"+ formatTheDate (item.publishedDate) +"</time></small>"+
            "<p>" + cleanText (item.contentSnippet) + " <a href='" +item.link + "'>Continue reading →</a>"  + "</p>" +
            "</article>");
    }
    $(node).html(buf.join ("\n"));      
  };

})(jQuery);