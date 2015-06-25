$(document).ready(function() {
  console.log("ready");
  $('.slideshow').cycle({
    timeout: 0,
    manualSpeed: 200,
    slides: '> .slide',
    pager: '> .cycle-pager',
    prev: '> .prev',
    next: '> .next',
    allowWrap: false
  });
});
