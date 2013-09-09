
$(document).ready (function (){
  $("[data-collapsed='false'] ul").css("display", "block");
  $("[data-collapsed='true'] ul").css("display", "none");

  $("div[data-collapsed] header").on("click", function(e){
    var outer = $(this).parent();
    var list = outer.children("ul");
    var collapsed = outer.attr("data-collapsed");
    if(collapsed === "true"){
      list.slideDown();
      outer.attr("data-collapsed", "false");
    } else {
      list.slideUp();
      outer.attr("data-collapsed", "true");
    }
  });

});