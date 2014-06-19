var doc = {};

function dbg (s) {
    //window.console && console.info (s);
}

// Fix for window.location.origin not working in i.e. (adapted from http://tosbourn.com/2013/08/javascript/a-fix-for-window-location-origin-in-internet-explorer/)
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
}

doc.securityConcernForm = (function() {

	return {
	/* Function for the form validation */
		validateForm : function(){
				
			if($('#name').val() == ""){
				alert("Please enter your name!");
				$('#name').focus();
				return false;
			}
			if ($('#userEmail').val() == "") {
				alert("Please enter your email address!");
				$('#userEmail').focus();
				return false;
			}
			if ($('#userPhone').val() == "") {
			    alert("Please enter your phone number!");
			    $('#userEmail').focus();
			    return false;
			}
			if ($('#subject').val() == "") {
			    alert("Please select an appropriate subject!");
			    $('#subject').focus();
			    return false;
			}
			if ($('#description').val() == "") {
			    alert("Please describe the issue!");
			    $('#description').focus();
			    return false;
			}
			if(!this.ValidCaptcha()){
				alert("Please enter the valid captcha value!");
				$('#txtCaptchaInput').focus();
				return false;
			}

			this.submission();
		},

		submission: function () {

			$.ajax({
			        url: $('#securityConcernForm').attr('action'),
			        type: 'POST',
			        dataType: 'jsonp',
                    cache: false,
                    data: {
                        name: $('#name').val(),
                        userEmail: $('#userEmail').val(),
                        userPhone: $('#userPhone').val(),
                        organization: $('#organization').val(),
                        subject: $('#subject').val(),
                        description: encodeURIComponent($('#description').val()),
                        datablock: $("#datablock").val(),
                        fname: window.location.origin + $("#fname").val(),
                        submit: true
                    },
                    timeout: 1000,
					beforeSend: function() {
						$("#form-fields").hide();
						$("#spinner").show();
					},
			    // At the moment cross domain transfer is not allowed, so the success function is not
			    // called. The success and error functions here will be updated after IST implements
                // a work around which will map the form api to the local server
					success: function (response) {
                        if (response) {
                            // show confirmation page
                            $("#submission-confirmation").show();
                            if (document.referer) {
                                $("#feedback-referring-link").attr("href", document.referer);
                                $("#referPageLink").show();
                            } else {
                                $("#resubmit").show();
                            }
                        }else{
							//Reload the form
							$("#form-fields").show();
						}
                    },
                    error: function (response) {
						//Reload the form
                        //$("#form-fields").show();
                        /*
                        $("#submission-confirmation").show();
                        if (document.referrer.length > 0 && document.referrer != document.URL) {
                            $("#feedback-referring-link").attr("href", document.referer);
                            $("#referPageLink").show();
                        } else {
                                $("#resubmit").show();
		                }*/
                        $("#submission-error").show();
                    }
				});
				return; 
		},
		
		/*********** CAptcha related code ****************************/
		/*** The Captcha code (ValidCaptcha, DrawCaptcha) has been copied from http://stackoverflow.com with a reference to http://osticket.com/forums/showthread.php?t=6489&highlight=captcha,
		*	 We did some customization and using it for our feedback form.
		*/
		DrawCaptcha : function () {
			var a = Math.ceil(Math.random() * 9)+ '';
			var b = Math.ceil(Math.random() * 9)+ '';       
			var c = Math.ceil(Math.random() * 9)+ '';  
			var d = Math.ceil(Math.random() * 9)+ '';  
			var e = Math.ceil(Math.random() * 9)+ '';  
			var f = Math.ceil(Math.random() * 9)+ '';  
			var g = '10';  
			var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
			document.getElementById("txtCaptcha").innerHTML = code;
			document.getElementById("txtHiddenCaptcha").value = code;
		},

		ValidCaptcha : function () { 
			function removeSpaces (string) { 
				return string.split(' ').join('');
			};

			var str1 = removeSpaces(document.getElementById('txtHiddenCaptcha').value);
			var str2 = removeSpaces(document.getElementById('txtCaptchaInput').value);
			return (str1 === str2);
		},

	/*************** End of Captcha code *************/

	};
})();


