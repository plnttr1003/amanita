var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);

var Event = require('../../models/main.js').Event;
var Subject = require('../../models/main.js').Subject;


var __appdir = path.dirname(require.main.filename);

// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
	return new Date(Date.UTC(year, 0, 1));
}

var checkNested = function (obj, layers) {

	if (typeof layers == 'string') {
		layers = layers.split('.');
	}

	for (var i = 0; i < layers.length; i++) {
		if (!obj || !obj.hasOwnProperty(layers[i])) {
			return false;
		}
		obj = obj[layers[i]];
	}
	return true;
}


// ------------------------
// *** Admin Subjects Block ***
// ------------------------


exports.list = function(req, res) {
	var id = req.params.event_id;
	var sizes = [];

	Event.findById(id).populate('subjects').exec(function(err, event) {
		async.forEachSeries(event.subjects, function(subject, callback) {
			gm(appDir + '/public' + subject.image.original).size({bufferStream: true}, function(err, size) {
				size
					? sizes.push({width: size.width, height: size.height})
					: sizes.push({width: null, height: null});
				callback();
			});

		}, function() {
			res.render('auth/subjects', {event: event, sizes: sizes});
		});
	});
}


// ------------------------
// *** Add Subjects Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/subjects/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var subject = new Subject();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& subject.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'description'])
			&& subject.setPropertyLocalised('description', post[locale].description, locale);

		checkNested(post, [locale, 'size'])
			&& subject.setPropertyLocalised('meta.size', post[locale].size, locale);

		checkNested(post, [locale, 'author'])
			&& subject.setPropertyLocalised('meta.author', post[locale].author, locale);

		checkNested(post, [locale, 'date'])
			&& subject.setPropertyLocalised('meta.date', post[locale].date, locale);

		checkNested(post, [locale, 'technique', 'comment'])
			&& subject.setPropertyLocalised('meta.technique.comment', post[locale].technique.comment, locale);
	});

	subject.meta.technique.hidden = post.technique.hidden;
	subject.meta.technique.tag = post.technique.tag;
	subject.meta.inventory = post.inventory;
	subject.meta.interval.start = set_date(post.interval.start);
	subject.meta.interval.end = set_date(post.interval.end);

	var public_folder = appDir + '/public';
	var subject_folder = '/images/subjects/' + subject._id;

  if (!files.image) {
    return (function () {
			subject.save(function(err, subject) {
				Event.findById(req.params.event_id).exec(function(err, event) {
					event.subjects.push(subject._id);
					event.save(function(err, event) {
						res.redirect('/auth/albums/' + req.params.event_id + '/subjects');
					});
				});
			});
    })();
  }

	mkdirp.sync(public_folder + subject_folder);

	gm(files.image.path).write(public_folder + subject_folder + '/original.jpg', function() {
		gm(files.image.path).resize(1200, false).write(public_folder + subject_folder + '/thumb.jpg', function() {
			subject.image.original = subject_folder + '/original.jpg';
			subject.image.thumb = subject_folder + '/thumb.jpg';

			subject.save(function(err, subject) {
				Event.findById(req.params.event_id).exec(function(err, event) {
					event.subjects.push(subject._id);
					event.save(function(err, event) {
						res.redirect('/auth/albums/' + req.params.event_id + '/subjects');
					});
				});
			});
		});
	});
}


// ------------------------
// *** Edit Subjects Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.subject_id;

	Subject.findById(id).exec(function(err, subject) {
		res.render('auth/subjects/edit.jade', {subject: subject});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.subject_id;

	Subject.findById(id).exec(function(err, subject) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				? subject.setPropertyLocalised('title', post[locale].title, locale)
				: subject.removePropertyLocale('title', locale);

			checkNested(post, [locale, 'description'])
				? subject.setPropertyLocalised('description', post[locale].description, locale)
				: subject.removePropertyLocale('description', locale);

			checkNested(post, [locale, 'size'])
				? subject.setPropertyLocalised('meta.size', post[locale].size, locale)
				: subject.removePropertyLocale('meta.size', locale);

			checkNested(post, [locale, 'author'])
				? subject.setPropertyLocalised('meta.author', post[locale].author, locale)
				: subject.removePropertyLocale('meta.author', locale);

			checkNested(post, [locale, 'date'])
				? subject.setPropertyLocalised('meta.date', post[locale].date, locale)
				: subject.removePropertyLocale('meta.date', locale);

			checkNested(post, [locale, 'technique', 'comment'])
				? subject.setPropertyLocalised('meta.technique.comment', post[locale].technique.comment, locale)
				: subject.removePropertyLocale('meta.technique.comment', locale);
		});

		subject.meta.technique.hidden = post.technique.hidden;
		subject.meta.technique.tag = post.technique.tag;
    subject.meta.inventory = post.inventory;
		subject.meta.interval.start = set_date(post.interval.start);
		subject.meta.interval.end = set_date(post.interval.end);

		var public_folder = appDir + '/public';
		var subject_folder = '/images/subjects/' + subject._id;

    if (!files.image) {
      return (function () {
				subject.save(function(err, subject) {
					res.redirect('/auth/albums/' + req.params.event_id + '/subjects');
				});
      })();
    }

    mkdirp.sync(public_folder + subject_folder);

		gm(files.image.path).write(public_folder + subject_folder + '/original.jpg', function() {
			gm(files.image.path).resize(1200, false).write(public_folder + subject_folder + '/thumb.jpg', function() {
				subject.image.original = subject_folder + '/original.jpg';
				subject.image.thumb = subject_folder + '/thumb.jpg';

				subject.save(function(err, subject) {
					res.redirect('/auth/albums/' + req.params.event_id + '/subjects');
				});
			});
		});
	});
}


// ------------------------
// *** Generate tiles Block ***
// ------------------------


exports.tiles_gen = function(req, res) {
	var subject_id = req.body.subject_id;

	Subject.findById(subject_id).exec(function(err, subject) {
		var zoom = [{ size: '100%', level: '4' }, { size: '50%', level: '3' }, { size: '25%', level: '2' }, { size: '12.5%', level: '1' }];
		var public_folder = appDir + '/public';
		var subject_folder = '/images/subjects/' + subject._id;

		del(public_folder + subject_folder + '/tiles', function() {
			async.forEach(zoom, function(item, callback) {
				var level_folder = public_folder + subject_folder + '/tiles/' + item.level;

				mkdirp(level_folder, function() {
					gm()
						.in(public_folder + subject_folder + '/original.jpg')
						.in('-resize', item.size)
						.write(level_folder + '/original.mpc', function(err) {
							gm()
								.in(level_folder + '/original.mpc')
								.in('-crop', '256x256')
								.in('-set', 'filename:tile')
								.in('%[fx:page.y/256]_%[fx:page.x/256]')
								.write(level_folder + '/image_tile_%[filename:tile].jpg', function(err) {
									del([level_folder + '/original.mpc', level_folder + '/original.cache'], function() {
										callback();
									});
								});
						});
					});
				}, function() {
					subject.image.tiles = subject_folder + '/tiles';
					subject.save(function(err, subject) {
						res.send('ok')
					});
				});
		});
	});
}
