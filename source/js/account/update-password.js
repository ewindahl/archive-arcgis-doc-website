require(["Config","SessionManager","Notifications","dojo/query","dojo/dom-form","dojo/NodeList-traverse"],function(e,t,n,r,i){function o(){r("input[name='currentPassword']").val(""),r("input[name='newPassword']").val(""),r("input[name='passwordConfirmation']").val(""),r("#submitPasswordBtn").attr("disabled",!1)}function u(){formFields=i.toObject("password-form");if(!a())return;r("#submitPasswordBtn").attr("disabled",!0),l(formFields)}function a(){var e=!0;return r(".error").removeClass("error"),r("#passwordNotifications").empty(),formFields.currentPassword||(e=!1,r("input[name='currentPassword']").addClass("error")),formFields.newPassword||(e=!1,r("input[name='newPassword']").addClass("error")),formFields.passwordConfirmation||(e=!1,r("input[name='passwordConfirmation']").addClass("error")),e?formFields.newPassword.match(s)?formFields.newPassword!==formFields.passwordConfirmation&&(e=!1,r("input[name='passwordConfirmation']").addClass("error"),f("The password and confirmation values do not match")):(e=!1,r("input[name='newPassword']").addClass("error"),f("The password entered is invalid")):f("Please validate all form fields"),e}function f(e,t){e=e||"We were unable to complete your request at this time.",t=t||"error",r("#passwordNotifications").empty();var i=new n(r("#passwordNotifications"));i[t](e)}function l(n){esri.request({url:e.billing+"/subscription/preferences/password/update",content:{token:t.token(),currentPassword:n.currentPassword,newPassword:n.newPassword,passwordConfirmation:n.passwordConfirmation,f:"json"},handleAs:"json"},{usePost:!0}).then(function(e){e.status=="success"?(f("Your password has been update","success"),o()):(f("Password failed to update","error"),o())},function(e){f("Your password has been update","success"),o()})}var s=/^([a-zA-Z\d]{8,28})$/;r("#password-form").on("submit",function(e){e.preventDefault(),e.stopImmediatePropagation(),u()})});