// grab packages needed for the review model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// movie schema
var ReviewSchema = new Schema({
    name: { type: String, required: true },
    comment: String,
    rating: { type: Number, min: 0, max: 5 },
    movie: String
});

// return the model
module.exports = mongoose.model('Review', ReviewSchema);
