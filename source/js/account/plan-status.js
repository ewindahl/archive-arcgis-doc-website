require(["Config","SessionManager","dojo/query","dojo/topic","dojo/dom-construct"],function(e,t,n,r,i){function o(){n("#content-wrapper").removeClass("hide"),a()}function u(){n("#loading-message").addClass("hide"),n("#error-message").removeClass("hide")}function a(){esri.request({url:e.billing+"/ecomm/activity",content:{f:"json",token:t.token()}}).then(function(e){if(e.code=="200"){s=e.activity;if(s.length>0){var t,r,o;s.forEach(function(e){t=i.create("tr",{},"subscription-activity"),r=new Date(e.createdDate),o=r.getMonth()+1+"/"+r.getDate()+"/"+r.getFullYear(),i.create("td",{"class":"align-center",style:"width: 100px",innerHTML:o},t),i.create("td",{"class":"align-center",style:"width: 100px",innerHTML:e.action},t),i.create("td",{innerHTML:e.description},t)}),n("#subscription-wrapper").removeClass("hide")}}},function(e){})}t.queue(o),r.subscribe("subscriptionLoadError",u);var s=[]});