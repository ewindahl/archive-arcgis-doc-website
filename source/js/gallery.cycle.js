$(document).ready(function () {
  $('#gallery-cont').cycle({
        slides: '> div',
        fx: 'scrollHorz', 
        sync: true, 
        speed: 1500,
        prev: '#glprev',
        next: '#glnext',
        paused: true,
        autohHeight:0
  });
});