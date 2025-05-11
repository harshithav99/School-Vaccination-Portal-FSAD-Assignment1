const express = require('express');
const router = express.Router();

// Sample Student Model
const Student = require('../models/Student'); // Replace with actual path
const authenticateToken = require('../middleware/authMiddleware');
// Create a student
router.post('/', async (req, res) => {
  try {
    const { name, className, age } = req.body;
    const newStudent = new Student({ name, studentClass:className, age });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error creating student:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/', async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (err) {
      console.error('Error fetching students:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
// Get a single student by ID
router.get('/:id', async (req, res) => {
    try {
      console.log('Student ID param:', req.params.id);
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (err) {
      console.error('Error fetching student by ID:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { name, className, age } = req.body;
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { name, className, age },
        { new: true }
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json(updatedStudent);
    } catch (err) {
      console.error('Error updating student:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
   });
   router.delete('/:id', async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    } catch (err) {
      console.error('Error deleting student:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  const multer = require('multer');
const csv = require('csv-parser');
const upload = multer({ dest: 'uploads/' });

router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  const results = [];
  const fs = require('fs');
  const stream = fs.createReadStream(req.file.path);

  stream.pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Student.insertMany(results);
        res.status(200).json({ message: 'Students uploaded' });
      } catch (error) {
        res.status(500).json({ message: 'Upload failed' });
      }
    });
});
router.get('/', async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { class: { $regex: search, $options: 'i' } },
          { studentId: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  const students = await Student.find(filter);
  res.json(students);
});

const mongoose = require('mongoose');

// POST /api/students/:id/vaccinate
router.post('/:studentId/vaccinate', authenticateToken, async (req, res) => {
  const { studentId } = req.params;
  const { driveId, vaccineName, date } = req.body;

  try {
  
    console.log("💉 Vaccinating student:", studentId);
    console.log("📦 Drive ID received:", driveId);

    if (!studentId || !driveId || !vaccineName || !date) {
      return res.status(400).json({ message: 'All fields are required: studentId, driveId, vaccineName, date' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.vaccinated = true;
    student.vaccinationRecord.push({
      driveId: new mongoose.Types.ObjectId(driveId),
      vaccineName,
      date: new Date(date)
    });

    await student.save();

    res.status(200).json({ message: 'Student vaccinated successfully', student });
  } catch (error) {
    console.error('❌ Vaccination error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


