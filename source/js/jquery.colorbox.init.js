function colorBoxInitSettings(){
	if (!$.colorbox) {
        return;
    }
	// Colorbox Image
	$('.colorbox-image').colorbox({scrolling:false, maxWidth:"90%", maxHeight:"90%", current:"({current} of {total})"});
	// Colorbox Video
	$('.colorbox-video').colorbox({scrolling:false, innerWidth:"700", innerHeight:"394", current:"({current} of {total})", onLoad:function(){ swfobject.removeSWF("video"); }});
	$('.colorbox-videoauto').colorbox({scrolling:false, innerWidth:"auto", innerHeight:"auto", current:"({current} of {total})", onLoad:function(){ swfobject.removeSWF("video"); }});
//Unique for old pages using the colorbox -- can delete after full conversion
	$('.colorbox-videoauto2').colorbox({scrolling:false, innerWidth:"auto", innerHeight:"auto", current:"({current} of {total})", onLoad:function(){ swfobject.removeSWF("video"); }});
	// Colorbox Content
	$('.colorbox-content').colorbox({scrolling:false, maxWidth:"90%", maxHeight:"90%", current:"({current} of {total})"});
	$('.colorbox-inline').colorbox({inline:true, scrolling:false, maxWidth:"90%", maxHeight:"90%", current:"({current} of {total})"});
	$('.colorbox-iframe').colorbox({iframe:true, scrolling:false, innerWidth:"700", innerHeight:"394", maxWidth:"90%", maxHeight:"90%"});
	$('.colorbox-iframe-auto').colorbox({iframe:true, scrolling:false, innerWidth:"90%", innerHeight:"90%", maxWidth:"90%", maxHeight:"90%"});
	//For MP3 files
	$('.colorbox-audio').colorbox({iframe:true, innerWidth:'480', innerHeight:'150'});
	// FOR ESRI VIDEO
	$('.colorbox-evsmall').colorbox({iframe:true,scrolling:false, innerWidth:"480", innerHeight:"270", current:"({current} of {total})"});
	$('.colorbox-evlarge').colorbox({iframe:true,scrolling:false, innerWidth:"960", innerHeight:"540", current:"({current} of {total})"});
	$('.colorbox-evmedium').colorbox({iframe:true,scrolling:false, innerWidth:"720", innerHeight:"405", current:"({current} of {total})"});
	$('.colorbox-evauto').colorbox({iframe:true,scrolling:false, innerWidth:"auto", innerHeight:"auto", current:"({current} of {total})"});
}
$(document).ready(function() {
	colorBoxInitSettings();
});