require(["Config","SessionManager","Notifications","dojo/query","dojo/fx"],function(e,t,n,r,i){function s(){r("#placeholder").addClass("hide");var e=t.subscription.allowOverages==1?"allow":"disallow";r("#"+e).removeClass("hide")}function o(n){esri.request({url:e.billing+"/subscription/preferences/overage",content:{allowOverages:n,token:t.token(),f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.code==200?u("Your preferences have been saved.","success"):u()},function(e){u()})}function u(e,t){e=e||"We were unable to complete your request at this time.",t=t||"error",r("#submitBtn").attr("disabled",!1),r("#notifications").empty();var i=new n(r("#notifications"));i[t](e)}t.queue(s),r("#moreDetails").on("click",function(e){e.preventDefault(),r("#moreDetailsWrapper").addClass("hide"),i.wipeIn({node:r("#overageExplanation")[0]}).play()}),r("#submitBtn").on("click",function(e){r("#notifications").empty(),r("#submitBtn").attr("disabled",!0);var t;r('input[name="overage"]').some(function(e){if(e.checked)return t=e.value,!0});if(typeof t=="undefined"){u("No option has been selected, please choose whether to allow overages.");return}o(t)})});