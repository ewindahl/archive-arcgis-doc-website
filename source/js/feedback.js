require(["dojo/query","Config","dojo/domReady!","dojo/NodeList-dom"],function(e,t){e("#source").attr("value","internal"),e("#redirect-url").attr("value",window.location.protocol+"//"+window.location.host+"/en/thank-you"),e("#feedback-form").attr("action",t.feedback_url)});