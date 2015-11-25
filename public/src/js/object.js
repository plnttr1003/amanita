$(document).ready(function() {
	var subjectsGroup;
	var map;
	var oldLayer;


	$('.object_navigate.subjects').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.subjects_slide').show();
		$('.column_item').hide();

		subjectsGroup = L.layerGroup();

		$('.object_slide_item.subjects').each(function() {
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
	});



	$('.object_slide_item.subjects').on('click', function(event) {
		$('body').css({'height':'100%','overflow':'hidden'});
		$('.object_subjects_block').show();
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