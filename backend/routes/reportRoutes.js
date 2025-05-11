const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const VaccinationDrive = require('../models/Drive');

// @route   GET /api/reports
// @desc    Get reports combining students and their vaccinations
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find().lean();
    const drives = await VaccinationDrive.find().lean();

    const totalStudents = students.length;
    const vaccinatedStudents = students.filter(s => s.vaccinated).length;
    

    const vaccinationPercentage = totalStudents > 0
      ? ((vaccinatedStudents / totalStudents) * 100).toFixed(2)
      : 0;

    // Get upcoming drives within next 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingDrives = drives.filter(d => {
      const driveDate = new Date(d.date);
      return driveDate >= today && driveDate <= thirtyDaysFromNow;
    });

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinationPercentage,
      upcomingDrives
    });
  } catch (error) {
    console.error('Error generating report:', error.message);
    res.status(500).json({ message: 'Server Error generating report' });
  }
});

module.exports = router;