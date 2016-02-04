

;(function($) {
  'use strict';

  $.fn.rssFeed = function(options) {
      var opts = $.extend({}, $.fn.rssFeed.defaults, options);
      
      return this.each(function() {
          var url = (opts.url.indexOf("blogs.esri.com") >=0)?opts.url.replace("http://","https://") : opts.url,
              node = this;
          $.ajax ({
            //cache: false,
            url : "/apps/proxy/sm-proxy.php?" + url,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            context: this,
            success: function(feed) {
            	if (feed) {
            	  $.fn.rssFeed.format (node, feed, opts.max)
            	}
            },
            error: function(xhr, status, err) {
            	 if(xhr.responseText) {
            		 $.fn.rssFeed.format (node, xhr.responseText, opts.max)
            	 }
            }
          });
      });
  };

  $.fn.rssFeed.defaults = {
    url:  "http://blogs.esri.com/esri/arcgis/feed/",
    max: 2
  };

  $.fn.rssFeed.format = function (node, feed, narticles) {

  function getNodeValue(post, tag) {
    var tag =  post.getElementsByTagName(tag);
    if (tag && tag.length) {
      var tagElement = tag[0]
      if (tagElement) {
        return tagElement.childNodes[0].nodeValue;
       }
     }
     return '';
  }

  function parseItems(xmlString) {
    if (typeof window.DOMParser != "undefined") {
      var parser = new window.DOMParser();
      var parsedXml = parser.parseFromString(xmlString, "text/xml");
      if (parsedXml) {
        return parsedXml.getElementsByTagName('item');
        }
    }
    return []
  }
	 
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
    s = s.replace(/(<([^>]+)>)/ig,"");

    return s;
  }
	 
   function truncateDescription (s, maxLength) {
  	s = s.replace(/[\n]/g, ' ')
  	s = s.substr(0, maxLength);
  	
  	// Re-trim in case we are in middle of a word
  	s = s.substr(0, Math.min(s.length, s.lastIndexOf(" ")));
  	
  	return s
   }

    var max = narticles,
        data = parseItems(feed),
        buf = [];

    for(var i=0; i<data.length && i<max; i++){
      var item= data[i];
		
      buf.push ("<article>"+
            "<h4><a href='" + getNodeValue(item, "link") + "'>" + truncateDescription(getNodeValue(item, "title"), 50) + " ..</a></h4>"+
            "<small><time>"+ formatTheDate (getNodeValue(item, "pubDate")) +"</time></small>"+
            "<p>" + truncateDescription(cleanText (getNodeValue(item, "description")), 100)  + " ... <a href='" +getNodeValue(item, "link") + "'>Continue reading →</a>"  + "</p>" +
            "</article>");
    }
    $(node).html(buf.join ("\n"));      
  };

})(jQuery);