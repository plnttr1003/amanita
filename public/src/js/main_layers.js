$(document).ready(function() {
function intro_runction() {
	var scr = $('body').height();
	$('.intro_block').animate({
			opacity: 0,
	}, 500, function() {
		$('.content_column.main .column_main_inner').css({'overflow-y':'scroll'});
		$('.content_column main').css({'padding-bottom':'65px'});
		$('.header_block, .footer_block').show();
		$('.content_outer_block').css({'visibility':'visible','opacity':'1'});
	}

	)
	setTimeout(function() { $('.intro_block').remove()}, 600)
}

	$('.screen_block.intro_block').click(function () {
		intro_runction()
	});


	$('.option.menu_option').click(function () {
			var scr = $('body').height();
			$('.about_block, .contacts_block').hide();
			$('.header_block').addClass('black_header');
	});

	$('.goto_down_inner.info').click(function () {
			var scr = $('body').height();
			$('.info_block').show(100);
			setTimeout(function() { $('.info_block').hide()}, 0);
			$('.header_block').removeClass('black_header');
		});



		$('.menu_item.about').click(function () {
			var scr = $('body').height();
			$('.about_block').show();
			$('.contacts_block').hide();
			$('.header_block').addClass('black_header');
	});

		$('.menu_item.contacts').click(function () {
			var scr = $('body').height();
			$('.contacts_block').show();
			$('.about_block').hide();
			$('.header_block').addClass('black_header');
	});

	$('.goto_down_inner.about').click(function () {
			var scr = $('body').height();
			$('.about_block').show(100);
			setTimeout(function() { $('.about_block, .contacts_block').hide()}, 100);
			$('.header_block').removeClass('black_header');
		});


})