$('body').click(function() {
    $('#dropDown').hide();
    $('#openMenu').removeClass('active');
    //console.log("clicked");
    
    /*$('#dropDownAccount').hide();
    $('#openMenuAccount').removeClass('active');*/
});
$(window).click(function() {
    $('#dropDown').hide();
    $('#openMenu').removeClass('active');
});
$(document).ready( function(){
  $('#openMenu').click(function(event){	
      $('#dropDown').toggle();
      $(this).toggleClass('active');
      // close menu when outisde of element
      event.stopPropagation();
  });
 /* $('#openMenuAccount').click(function(event){	
      $('#dropDownAccount').toggle();
      $(this).toggleClass('active');
      // close menu when outisde of element
      event.stopPropagation();
  });*/
});