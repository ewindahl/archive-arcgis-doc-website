require(["Config","SessionManager","dojo/query","dojo/topic"],function(e,t,n,r){function i(){r.publish("subscriptionLoadError","subscription information failed to load")}function s(){n("#loading-message").addClass("hide"),n("#plan-summary").removeClass("hide");var e=t.subscription;n("#credit-allowance").html(e.credits),n("#subscription-id").html(e.smsId),e.type.toLowerCase()=="trial developer"?(n("#current-plan").html("90-Day Trial"),n("#change-plan").html("Purchase a Plan")):n("#current-plan").html(e.primaryProduct.credits+" credits, $"+e.primaryProduct.price+" / month");var r=new Date(e.termStart),i=new Date(e.termEnd);n("#term-start").html(r.getMonth()+1+"/"+r.getDate()+"/"+r.getFullYear()),n("#term-end").html(i.getMonth()+1+"/"+i.getDate()+"/"+i.getFullYear()),n("#credits-remaining-wrapper").removeClass("hide"),n("#credits-remaining").html(t.organization.subscriptionInfo.availableCredits)}t.queue(s)});