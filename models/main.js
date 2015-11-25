var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt'),
		Schema = mongoose.Schema;


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});





var hallSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary' },
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var subsidiarySchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	adress: { type: String, trim: true, locale: true },
	status: String,
	logo: {
		path: String,
		position: {
			x: String,
			y: String
		}
	},
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var eventSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary' },
	categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
	interval: {
		hidden: Boolean,
		start: Date,
		end: Date
	},
	status: String,
	type: String,
	videos: [{type: String, trim: true}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});




var subjectSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	//categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	meta: {
		technique: {
			tag: String,
			hidden: Boolean,
			comment: { type: String, trim: true, locale: true }
		},
		size: { type: String, trim: true, locale: true },
		date: { type: String, trim: true, locale: true },
		author: { type: String, trim: true, locale: true },
		inventory: String,
		interval: {
			start: Date,
			end: Date
		}
	},
	image: {
		original: String,
		thumb: String,
		tiles: String
	},
	date: {type: Date, default: Date.now}
});





var categorySchema = new Schema({
	title: { type: String, trim: true, locale: true },
	category: { type: Schema.Types.ObjectId, ref: 'Category' },
	status: String,
	date: {type: Date, default: Date.now}
});




// ------------------------
// *** Statics Block ***
// ------------------------




// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });


hallSchema.plugin(mongooseLocale);
subsidiarySchema.plugin(mongooseLocale);
eventSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);
subjectSchema.plugin(mongooseLocale);


// ------------------------
// *** Index Block ***
// ------------------------


eventSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});
subjectSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});


//architectSchema.set('autoIndex', true);
eventSchema.set('autoIndex', true);
subjectSchema.set('autoIndex', true);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Hall = mongoose.model('Hall', hallSchema);
module.exports.Subsidiary = mongoose.model('Subsidiary', subsidiarySchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Subject = mongoose.model('Subject', subjectSchema);
