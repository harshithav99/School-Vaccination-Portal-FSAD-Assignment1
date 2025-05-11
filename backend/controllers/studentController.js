const Student = require('../models/Student');

// GET all students
const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// POST add student
const addStudent = async (req, res) => {
  const { name, class: studentClass, studentId } = req.body;
  const student = new Student({ name, class: studentClass, studentId });
  await student.save();
  res.status(201).json(student);
};

module.exports = { getStudents, addStudent };
