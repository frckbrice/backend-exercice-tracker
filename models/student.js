const mongoose = require('mongoose');

const {Schema} = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A Student must have a name'],
    min: 3,
    unique: true,
  }
}, {
  timestamps: true,
});



module.exports = mongoose.model('Student', studentSchema);

