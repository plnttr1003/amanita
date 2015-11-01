$(document).ready(function() {
	var sho = $('.slider_image').length;
	var i = 0;
	$('.slider_image').eq(0).css({'z-index':'10', 'opacity': '1'});
	function showOpacity() {
		console.log('sho: '+ sho +', i: ' + i);
		if (i !== sho)
		{$('.slider_image').css({'z-index':'1', 'opacity': '0'}).eq(i).css({'z-index':'10','opacity':'1'}) }
		else
		{$('.slider_image').eq(0).css({'z-index':'10','opacity':'1'}); i=0}
		i++;
	}
	setInterval(showOpacity,5000);
});