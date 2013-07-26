require(["Config","SessionManager","dojo/query","dojo/dom-construct","dojo/io-query","dojo/topic","/js/account/payment-form.js","/js/account/new-plan-summary.js"],function(e,t,n,r,i,s,o,u){function g(){var e=document.location.search.substr(document.location.search[0]==="?"?1:0),t=i.queryToObject(e).orderprocess;m=typeof t!="undefined"&&t==="true",B(),j(),m&&(n("#plan-summary").removeClass("hide"),n("#purchase-footer").removeClass("hide"),n("#continueBtn").on("click",P)),n(".cancel").on("click",y)}function y(){n("#remove-card").addClass("hide"),n("#remove-card").addClass("hide"),n("#add-card").addClass("hide"),n("#existing-cards").removeClass("hide"),m&&n("#purchase-footer").removeClass("hide"),B()}function b(){n("#card-list").empty(),n("#content-wrapper").removeClass("hide"),typeof d=="undefined"&&(d=[]),d.length>=2?n("#add-payment").addClass("hide"):d.length==0&&m?T():n("#add-payment").removeClass("hide"),d.forEach(function(e){var t=e.default===!0?"first":"last",i=r.create("div",{"class":"panel"},"card-list",t),s=e.type.toUpperCase()!="MC"?S(e.type)+" Card":S(e.type),o=r.create("h4",{"class":"trailer-half",innerHTML:s},i);e.default===!0&&r.create("small",{innerHTML:" &nbsp; Default"},o);var u=r.create("div",{"class":"row"},i),a=r.create("div",{"class":"payment-method-details column-12"},u);r.create("p",{"class":"no-trailer",innerHTML:e.cardHolderName},a),r.create("p",{"class":"no-trailer",innerHTML:"Card ending in "+e.externalToken},a),r.create("p",{innerHTML:"Expires "+x(e.expirationMonth,e.expirationYear)},a);if(e.address){e.address.streetAddress&&r.create("p",{"class":"no-trailer",innerHTML:e.address.streetAddress},a);var f="";e.address.city&&(f+=e.address.city+", "),f+=e.address.state+" "+e.address.postalCode,r.create("p",{"class":"no-trailer",innerHTML:f},a)}var l=r.create("div",{"class":"column-12 center-text"},u);r.create("input",{type:"button","class":"btn small light post-1 cc-action",value:"Modify","data-cc-id":e.id,"data-cc-action":"modify"},l),e.default===!0?(n(i).addClass("blue"),h=e.id):(r.create("input",{type:"button","class":"btn small light cc-action",value:"Remove","data-cc-id":e.id,"data-cc-action":"remove"},l),r.create("input",{type:"button","class":"btn small light cc-action",value:"Set as Default","data-cc-id":e.id,"data-cc-action":"default"},l))}),n("a.cc-action, input.cc-action").on("click",w),n(".btn").removeAttr("disabled")}function w(e){e.preventDefault(),n(".general-error").orphan();var t=n(e.target).attr("data-cc-action")[0],r=n(e.target).attr("data-cc-id")[0];switch(t){case"remove":C(r);break;case"cancelRemove":k();break;case"confirmRemove":R();break;case"modify":N(r);break;case"addCard":T();break;case"default":U(r)}}function E(e){var t=dojo.filter(d,function(t){return t.id==e});return t.length>0?t[0]:null}function S(e){return e.toUpperCase()!="MC"?e:"Master Card"}function x(e,t){var n=e<10?"0"+e:e;return n+" / 20"+t}function T(){n("#add-card").removeClass("hide"),o.clearForm(typeof d!="undefined"&&d.length!=0),m&&(n("#existing-cards").addClass("hide"),n("#purchase-footer").addClass("hide"))}function N(e){var t=E(e);if(!t)return;o.populateForm(t),n("#add-card").removeClass("hide"),m&&(n("#existing-cards").addClass("hide"),n("#purchase-footer").addClass("hide")),n("#existing-cards .btn, #purchase-footer .btn").attr("disabled","disabled")}function C(e){var t=E(e);if(!t)return;n("#remove-cc-type").html(S(t.type)),l=t.id,n("#remove-cc-name").html(t.cardHolderName),n("#remove-cc-token").html(t.externalToken),n("#remove-cc-expiration").html(x(t.expirationMonth,t.expirationYear)),n("#remove-card").removeClass("hide"),n(".remove-error").orphan(),m&&(n("#existing-cards").addClass("hide"),n("#purchase-footer").addClass("hide")),n("#existing-cards .btn, #purchase-footer .btn").attr("disabled","disabled")}function k(){l=0,y()}function L(){n("#loading-message").addClass("hide"),n("#purchase-body").addClass("hide"),n("#purchase-footer").addClass("hide"),n("#error-message").removeClass("hide")}function A(e){e=e||"We were unable to complete your request at this time.",r.create("div",{"class":"error-message server-error general-error",innerHTML:e},"card-list","after"),n(".btn").removeAttr("disabled")}function O(e){e=e||"We were unable to complete your request at this time.",r.create("div",{"class":"error-message server-error remove-error",innerHTML:e},"removeBtn","before"),n("#removeBtn").attr("disabled",!1).html("Remove Payment Method")}function M(e){e=e||"We were unable to complete your request at this time.",r.create("div",{"class":"error-message server-error",innerHTML:e},"submitBtn","before"),n("#submitBtn").attr("disabled",!1).attr("value","Add Payment Method")}function _(e){e=e||"We were unable to complete your request at this time.",r.create("div",{"class":"error-message server-error",innerHTML:e},"continueBtn","before")}function D(e,t){a=e,c=t}function P(){d.length>0?n('input[name="planOverages"]:checked').length>0?H(STEP_BILLING):(n("#plan-usage-wrapper").addClass("error"),_("Please select your plan usage.")):_("Please add a card before continuing.")}function H(e){v=e,n("#submitBtn").attr("disabled",!0).attr("value","Processing...");switch(v){case STEP_CREDIT_CARD:F();break;case STEP_BILLING:I();break;case STEP_STORAGE:q();break;case STEP_VALIDATION:default:o.callCreditCardForm("submitCreditCardForm")}}function B(){esri.request({url:e.billing+"/cc/ecomm/billing",content:{token:t.token(),f:"json"},handleAs:"json"}).then(function(e){e.code==200||e.code==404?(n("#loading-message").addClass("hide"),n("#existing-cards").removeClass("hide"),d=e.cards,b()):L()},function(e){L()})}function j(){esri.request({url:e.billing+"/storage/",content:{id:p,userToken:t.token(),f:"json"},handleAs:"json"}).then(function(e){e.code=="200"?(f=JSON.parse(e.value),u.loadSubscription(f.selectedPlan,t.token())):m&&L()},function(e){L()})}function F(){esri.request({url:e.billing+"/cc/ecomm/billing/",content:{id:c,"street-address":a.address,city:a.city,state:a.state,"postal-code":a.postalCode,country:a.country,name:a.nameOnCard,vat:a.vat,token:t.token(),"expiration-month":a.expMon,"expiration-year":a.expYear,f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.code=="200"?a.default?U(c):y():M()},function(e){M()})}function I(){f.creditCardID=h,f.allowOverage=n('input[name="planOverages"]:checked').attr("value")==1,esri.request({url:e.billing+"/storage/",content:{id:p,userToken:t.token(),value:JSON.stringify(f),f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.code=="200"?H(STEP_STORAGE):M()},function(e){M()})}function q(){window.location="/"+dojo.locale.substr(0,2)+"/account/purchase-confirmation"}function R(){if(l===0)return;var r=E(l);if(!r)return;n(".remove-error").orphan(),esri.request({url:e.billing+"/cc/ecomm/billing/remove/",content:{id:l,token:t.token(),f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.code=="200"?y():O()},function(e){O()})}function U(r){if(!r)return;n("#existing-cards .btn, #purchase-footer .btn").attr("disabled","disabled"),esri.request({url:e.billing+"/cc/ecomm/billing/default",content:{id:r,token:t.token(),f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.code=="200"?y():A()},function(e){A()})}STEP_VALIDATION=0,STEP_CREDIT_CARD=1,STEP_BILLING=2,STEP_STORAGE=3,STEP_CONFIRMATION=4;var a={},f,l=0,c=0,h=0,p="subscription-signup",d=[],v=STEP_VALIDATION,m=!1;s.subscribe("processStep",H),s.subscribe("setData",D),t.queue(g)});