require(["SessionManager","ApplicationManager/collections/applications","Quoin/History","dojo/on","dojo/query","dojo/dom-attr","dojo/_base/event","dojo/topic","ApplicationManager/router"],function(e,t,n,r,i,s,o,u){e.requireSession(),r(dojo.body(),"a:click",function(e){var t=i(this);s.has(t[0],"data-application-manager")&&(o.stop(e),u.publish("router:navigate",s.get(t[0],"href")))}),i("#application-manager").attr("href","").attr("data-application-manager","")});