require(["SessionManager","ApplicationManager/views/top-apps","ApplicationManager/helpers/top-apps","Quoin/Model","Quoin/Handlebars","dojo/text!/templates/dashboard/components/application-bar","dojo/query"],function(e,t,n,r,s,o,u){function a(t){n.getAppData(e.orgId(),t).then(function(e){appModel.set("timeRangePhrase",e.timeRangePhrase),appModel.set("appUsageData",e.appUsageData),appModel.set("mostCredits",e.mostCredits),barTemplate=s.compile(o);var t=u("#app-list")[0];t.innerHTML="";for(i=0;i<appModel.appUsageData.length;i++){var n=barTemplate(appModel.appUsageData[i]);t.innerHTML+=n}})}function f(){u("#date_range").on("change",function(e){var t=u(this).attr("value")[0];u("#loader1",this.domNode).removeClass("hidden"),a(t)})}e.requireSession(),appModel=new r;var l=new t({model:appModel},"top-apps");a("month"),f()});