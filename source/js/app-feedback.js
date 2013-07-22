	/* Function for the form validation */
	function validateFeedbackForm(){
				
		if(document.getElementById('userFeedback').value == ""){
			alert("Please enter the valid feedback!");
			document.getElementById('userFeedback').focus();
			return false;
		}
		if(document.getElementById('userEmail').value == ""){
			alert("Please enter your Email address!");
			document.getElementById('userEmail').focus();
			return false;
		}
		
		if(!ValidCaptcha()){
			alert("Please enter the valid captcha value!");
			document.getElementById('txtCaptchaInput').focus();
			return false;
		}
			

	}

		
	/*********** CAptcha related code ****************************/
	/*** The Captcha code (ValidCaptcha, DrawCaptcha) has been copied from http://stackoverflow.com with a reference to http://osticket.com/forums/showthread.php?t=6489&highlight=captcha,
	*	 We did some customization and using it for our feedback form.
	*/
	function DrawCaptcha() {
		var a = Math.ceil(Math.random() * 9)+ '';
		var b = Math.ceil(Math.random() * 9)+ '';       
		var c = Math.ceil(Math.random() * 9)+ '';  
		var d = Math.ceil(Math.random() * 9)+ '';  
		var e = Math.ceil(Math.random() * 9)+ '';  
		var f = Math.ceil(Math.random() * 9)+ '';  
		var g = '10';  
		var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
		document.getElementById("txtCaptcha").innerHTML = code;
	}
	function ValidCaptcha() { 
		var str1 = removeSpaces(document.getElementById('txtCaptcha').innerHTML);
		var str2 = removeSpaces(document.getElementById('txtCaptchaInput').value);
		if (str1 == str2){
			return true; } 
		else {
			return false; } 
	}
	function removeSpaces(string) { 
		return string.split(' ').join('');
	} 

	/*************** End of Captcha code *************/



	function addReferrerLink(){
		document.getElementById('referPageLink').value = "Return to the " + "<a href=''>referring page</a>";
			var referPageLink = "";
			var tempArr = document.URL.split('?');
			
			if(tempArr.length >= 2){
				var queryString = tempArr[1];
				var tempArr2 = queryString.split('=');
				if(tempArr2[0] == "referrer_url" && tempArr2[1] != ""){
					document.getElementById('referPageLink').innerHTML = "Return to the " + "<a href='" + tempArr2[1] +"'>referring page</a>";
				}
			}
	}