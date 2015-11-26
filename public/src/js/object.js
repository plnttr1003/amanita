$(document).ready(function() {
	var subjectsGroup;
	var map;
	var oldLayer;
	var index = 0;

// клик по кнопке коллекции музея

		subjectsGroup = L.layerGroup();

		$('.images_zoom').each(function() {
			var path = $(this).attr('path');

			var layer = L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
				fitToMarkers: true,
				minZoom: 1,
				maxZoom: 4,
				attribution: '',
				tileSize: '256',
				tms: false,
				continuousWorld: true
			});

			layer._leaflet_id = path;
			subjectsGroup.addLayer(layer);
		});


// переключение слайдов


	$('.images_navigate_block_next').on('click', function(event) {
		index = $(this).parents('.object_image').index();
		var length = $('.object_image').length - 1;

		if (index != length) {
			$(this).parents('.object_image').hide().next().show()
			$('.description_item.images').eq(index).hide().next().show();
		}
		else {
			$('.object_image').hide().eq(0).show();
			$('.description_item.images').hide().eq(0).show();
		}
	});


	$('.images_navigate_block_prev').on('click', function(event) {
		index = $(this).parents('.object_image').index();

		if (index !== 0) {
			$(this).parents('.object_image').hide().prev().show();
			$('.description_item.images').eq(index).hide().prev().show();
		}
		else {
			$('.object_image').hide().last().show();
			$('.description_item.images').hide().last().show();
		}
	});


// клик по крестику изображения

	$('.cross').on('click', function(event) {
		$(this).hide();
		$('.object_images_block, .header_block, .content_title').show();
		$('.object_subjects_block').hide();
		$('.images_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.description_item.subjects').hide();
		$('body').css({'height':'auto','overflow':'auto'});
		$('.main_description_block').show();
	});


// клик по превьюшке единицы хранения

	$('.images_zoom').on('click', function(event) {

		$('.cross').show();
		$('body').css({'height':'100%','overflow':'hidden'});
		$('.object_subjects_block').show();
		$('.object_images_block, .header_block, .content_title').hide();
		$('.object_navigate').removeClass('current');
		$('.description_item.images').hide();

		var index = $(this).index();
		$('.description_item.subjects').hide().eq(index).show();

		var path = $(this).attr('path');
		console.log(path);
		var currentLayer = subjectsGroup.getLayer(path);

		if (map === undefined) {
			map = L.map('subjects_view').setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
		else {
			map.removeLayer(oldLayer).setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
	});
});