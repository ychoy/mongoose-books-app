var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: { type: String, required: true, default: 'default' },
  alive: { type: Boolean, required: true, default: false },
  image: [String]
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
