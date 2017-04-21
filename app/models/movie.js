// grab packages needed for the movie model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// movie schema
var MovieSchema = new Schema({
    name: { type: String, required: true, unique: true },
    year: String,
    actors: Array
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);
