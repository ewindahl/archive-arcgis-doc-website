require(["SessionManager","dojo/query","dojo/domReady!"],function(e,t){function n(){var n=e.orgUrl(),r=t(".map-viewer"),i=t(".my-content"),s=n+"/home/content.html",o=n+"/home/webmap/viewer.html";r.attr("href",o),i.attr("href",s)}e.requireSession(),e.ready?n():e.queue(function(){n()})});