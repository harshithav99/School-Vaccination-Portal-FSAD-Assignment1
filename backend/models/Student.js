const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  studentClass: String,
  studentId: String,
  vaccinated: { type: Boolean, default: false },
  vaccinationRecord: [{
    vaccineName: String,
    date: Date,
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
    }
  }]
});

module.exports = mongoose.model('Student', studentSchema);
