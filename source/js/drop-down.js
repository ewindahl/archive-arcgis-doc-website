//jquery version
$('body').click(function() {
    $('#dropDown').hide();
    $('#down-arrow').removeClass('active');
});
$(document).ready( function(){
  $('#down-arrow').click(function(event){	
      $('#dropDown').toggle();
      $(this).toggleClass('active');
      // close menu when outisde of element
      event.stopPropagation();
  });
});