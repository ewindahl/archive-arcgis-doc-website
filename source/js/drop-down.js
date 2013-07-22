// Vanilla JS for the Inter-Site Dropdown Menu
function dropDownHandler() {

  function addEvent(element, event, funct){
    if (element.addEventListener){
     return element.addEventListener(event, funct, false);
    } else {
     return element.attachEvent('on'+event, funct);
    }
  }

  var downArrow = document.getElementById('down-arrow');
  var body      = document.getElementsByTagName("body")[0];
  var dropDown  = document.getElementById('dropDown');

  addEvent(body, 'click', function(e){
    if (e.target == downArrow && dropDown.className !== 'visible') {
      dropDown.className = 'visible';
    } else {
      dropDown.className = '';
    }
  });
}

dropDownHandler();