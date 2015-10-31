$(document).ready(function() {
	function getRandom (min, max) {
		var rand = min - 0.5 + Math.random()*(max-min)
		return Math.round(rand);
	}


	function showOpacity() {
		//console.log(w_count);
		var count = $('.slider_image').length;
		var w_count = getRandom(0, count);
		var old_rand = w_count;
		console.log(w_count);
		$('.slider_image').css({'z-index':'1', 'opacity': '0'});
		$('.slider_image').eq(w_count).css({'z-index':'10','opacity':'1'});
	}

	setInterval(showOpacity,2000);
});