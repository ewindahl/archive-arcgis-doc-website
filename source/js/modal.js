// Vanilla JS for Modals
function modalHandler() {

  function addEvent(element, event, funct){
    if (element.attachEvent){
     return element.attachEvent('on'+event, funct);
    } else {
     return element.addEventListener(event, funct, false);
    }
  }

  var overlay = document.getElementById('modal-overlay1');
  var modal   = document.getElementById('modal1');
  var button  = document.getElementById('show-modal');
  var close   = document.getElementById('close-login');

  addEvent(button, 'click', function(e){
    e.preventDefault();
    overlay.className += ' visible';
    modal.className += ' visible';
  });

  addEvent(close, 'click', function(e){
    e.preventDefault();
    overlay.className = 'modal-overlay';
    modal.className = 'modal';
  });
}

modalHandler();