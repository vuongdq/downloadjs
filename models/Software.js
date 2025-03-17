const mongoose = require('mongoose');

const softwareSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  downloadLink: { type: String, required: true },
});

module.exports = mongoose.model('Software', softwareSchema);