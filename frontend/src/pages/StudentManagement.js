import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import axios from 'axios';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', studentClass: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentID, setSelectedStudentID] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState('');
  const [driveId, setDriveId] = useState('');
  const [drives, setDrives] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedDriveId, setSelectedDriveId] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5055/api/drives', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched drives:', response.data); 
        setDrives(response.data);
      } catch (error) {
        console.error('Error fetching drives:', error);
      }
    };
  
    fetchDrives();
  }, []);
  

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/students/${editId}`, form);
      } else {
        await API.post('/students', form);
      }
      setForm({ name: '', age: '', studentClass: '' });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      setError('Save failed');
    }
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, studentClass: student.studentClass });
    setEditId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await API.post('/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Upload successful');
      fetchStudents();
    } catch (err) {
      console.error('Upload failed', err);
    }
  };
  const token = localStorage.getItem('token');

const handleMarkVaccinated = async (e) => {
  e.preventDefault();

  if (!selectedStudentID || !selectedDriveId) {
    console.error("Student ID or Drive ID missing!");
    return;
  }

  const selectedDrive = drives.find((drive) => drive._id === selectedDriveId);
  if (!selectedDrive) {
    console.error("Selected drive not found!");
    return;
  }

  const vaccineData = {
    vaccineName,
    date: vaccinationDate,
    driveId: selectedDriveId,
  };

  try {
    const response = await axios.post(
      `http://localhost:5055/api/students/${selectedStudentID}/vaccinate`,
      vaccineData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(" Vaccinated successfully:", response.data);
    setShowModal(false); 
  } catch (error) {
    console.error(" Error while vaccinating:", error.response?.data || error.message);
  }
};

  return (
    <div>
      <Navbar />
      <h2>Student Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input name="studentClass" placeholder="Class" value={form.studentClass} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Student</button>
      </form>

      <form onSubmit={handleCSVUpload}>
        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} required />
        <button type="submit">Upload CSV</button>
      </form>

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} - Age: {student.age} - Class: {student.studentClass}
            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student._id)}>Delete</button>
            <button onClick={() => {
              setSelectedStudentID(student._id);
              setShowModal(true);
            }}>
              Mark as Vaccinated
            </button>
          </li>
        ))}
      </ul>

{showModal && (
  <div className="modal">
    <form onSubmit={handleMarkVaccinated}>
      <h3>Mark Vaccination</h3>

      <label>Select Vaccination Drive:</label>
      <select
        value={selectedDriveId}
        onChange={(e) => setSelectedDriveId(e.target.value)}
        required
      >
        <option value="">-- Select a Vaccination Drive --</option>
        {drives.length > 0 ? (
          drives.map((drive) => (
            <option key={drive._id} value={drive._id}>
              {drive.title}
            </option>
          ))
        ) : (
          <option disabled>No drives found</option>
        )}
      </select>

      <label>Vaccine Name:</label>
      <input
        type="text"
        value={vaccineName}
        onChange={(e) => setVaccineName(e.target.value)}
        required
      />

      <label>Vaccination Date:</label>
      <input
        type="date"
        value={vaccinationDate}
        onChange={(e) => setVaccinationDate(e.target.value)}
        required
      />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
    </form>
  </div>
)}
</div>
);
}
export default StudentManagement;