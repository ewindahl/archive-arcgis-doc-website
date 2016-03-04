var doc = {};

function dbg (s) {
    //window.console && console.info (s);
}


doc.signUpForm = (function() {

	return {
	/* Function for the form validation */
		validateSignUpForm : function(){
				
			if($('#firstName').val() == ""){
				alert("Please enter your First Name!");
				$('#firstName').focus();
				return false;
			}
			if($('#lastName').val() == ""){
				alert("Please enter your Last Name!");
				$('#lastName').focus();
				return false;
			}
			if($('#userEmail').val() == ""){
				alert("Please enter your Email Address!");
				$('#userEmail').focus();
				return false;
			}
						
			if(!this.ValidCaptcha()){
				alert("Please enter the valid captcha value!");
				$('#txtCaptchaInput').focus();
				return false;
			}
			
			this.signUpEmail();
		},

		signUpEmail : function (){
			
			$.ajax({
               url: $('#sign-up-form').attr('action'),
					type: 'POST',
               dataType: 'JSON',
               cache: false,
					data: {
						companyName: $('#companyName').val(), 
						firstName: $('#firstName').val(), 
						lastName: $('#lastName').val(),
						userEmail: $('#userEmail').val(),
						userPhone: $('#userPhone').val(), 
						userWebsite: $('#userWebsite').val(), 
						userComment:encodeURIComponent($('#userComment').val()), 
						userServices:encodeURIComponent($('#userServices').val()), 
						datablock: $("#datablock").val(), 
						fname: window.location.origin + $("#fname").val(), 
						submitSignUp: true 
					},
               timeout: 2000,
					beforeSend: function() {
						$("#sign-up-form-fields").hide();
						$("#spinner").show();
					},
               success: function (data) {
					
                  if (data) {
                     // show confirmation page
							$("#signup-confirmation").show();
                  }else{
							//Reload the form
							$("#sign-up-form-fields").show();
						}
               },
					error: function (data) {
							//Reload the form
							//$("#sign-up-form-fields").show();
							$("#signup-confirmation").show();
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


