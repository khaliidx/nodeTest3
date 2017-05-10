var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    title : String,
	releaseYear: String,
	director: String,
	genre:String
});

module.exports = mongoose.model('Movie', MovieSchema);
