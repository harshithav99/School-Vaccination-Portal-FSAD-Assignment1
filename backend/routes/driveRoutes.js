const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive'); // Make sure the path is correct
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// Protect this route: only logged-in users can create a drive
// 1. Create a vaccination drive
router.post('/', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const newDrive = new Drive({ title, date, location, description });
    await newDrive.save();
    res.status(201).json(newDrive);
  } catch (err) {
    console.error('Error creating drive:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. Assign students to a drive
router.post('/:driveId/assign', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const { studentIds } = req.body;
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    drive.students.push(...studentIds);
    await drive.save();

    res.status(200).json(drive);
  } catch (err) {
    console.error('Error assigning students:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. Get all drives
router.get('/', authenticateUser, async (req, res) => {
  console.log('GET /api/drives hit'); 
  try {
    const drives = await Drive.find();
    res.json(drives);
  } catch (err) {
    console.error('Error fetching drives:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 4. Get a drive and its students
router.get('/:driveId/students', authenticateUser, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId).populate('students');
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    res.json(drive);
  } catch (err) {
    console.error('Error fetching drive with students:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.delete('/:driveId', async (req, res) => { 
  try {
    const drive = await Drive.findByIdAndDelete(req.params.driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    res.json({ message: 'Drive deleted successfully' });
  } catch (err) {
    console.error('Error deleting Drive:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
