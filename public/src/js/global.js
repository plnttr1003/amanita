$(document).ready(function() {
	var menu_var = 1;
	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				data.events.length == 0 && data.exhibits.length == 0
					? $('.search_result').hide()
					: $('.search_result').show();

				$('.search_context').hide().children('.context_results_block').empty();

				data.exhibits.forEach(function(exhibit) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/exhibits/' + exhibit._id, 'text': exhibit.title[0].value});
					$('.search_context.exhibits').show().children('.context_results_block').append(context_result);
				});

				data.events.forEach(function(event) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/events/' + event.type + '/' + event._id, 'text': event.title[0].value});
					$('.search_context.events').show().children('.context_results_block').append(context_result);
				});
			});
		}
	};

	$('.search_input')
	.on('keyup change', function(event) {
		search.val = $(this).val();
	})
	.on('focusin', function(event) {
		search.interval = setInterval(function() {
			search.checkResult.call(search);
		}, 1000);
	})
	.on('focusout', function(event) {
		clearInterval(search.interval);
	});


	$('.option.search').on('click', function(event) {
		$('.search_block').toggle().find('.search_input').focus();
	});

	$('.navigate_item').on('click', function() {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$(this).addClass('selected');
		} else {
			$(this).removeClass('selected');
		}
	});

	$('.block').css('color', '#B8B8B8').on('click', function(event) {
		event.preventDefault();
	});




	$('.menu_press').on('click', function(event) {
		if (menu_var === 1) {
			$('.column_main_inner').append('<div class="screen_block press_block"><div class="press_block_inner"></div></div>');
			menu_var = 0;
			$('.press_block_inner').load('../news .content_outer_block_inner')
			$('.screen_block.press_block').append('<div class="goto_down"><a class="goto_down_inner press"></a></div>');
			window.location.hash = '#press';

			$('a.goto_down_inner.press').click(function(event) {
					$('.screen_block.press_block').remove();
					menu_var = 1;
					window.location.hash = '';
			})
		}
		else if (menu_var === 0) {
			$('.screen_block.press_block').remove();
			menu_var = 1;
			window.location.hash = '';
		}
	});

	$(window).on('hashchange', function(event) {
		//console.log(window.location.hash);
		hash = window.location.hash;
		console.log(hash);
		if(hash !== '#press' || !hash) {
			//console.log('1');
			$('.screen_block.press_block').remove();
		}
	});





	$(document).on('mouseup', function(event) {
		var container = $('.search_block');

		if (!container.is(event.target)
				&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});