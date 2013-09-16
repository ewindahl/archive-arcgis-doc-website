$('body').click(function() {
    $('#dropDown').removeClass('visible');
    $('#logo-wrap').removeClass('expanded');
    
    $('#dropDownAccount').hide();
    $('#openMenuAccount').removeClass('active');
});

$(document).ready( function(){
  $('#down-arrow').click(function(event){	
      $('#dropDown').toggleClass('visible');
      $("#logo-wrap").toggleClass('expanded');
      // close menu when outisde of element
      event.stopPropagation();
  });
  $('#openMenuAccount').click(function(event){	
      $('#dropDownAccount').toggle();
      $(this).toggleClass('active');
      // close menu when outisde of element
      event.stopPropagation();
  });
});
