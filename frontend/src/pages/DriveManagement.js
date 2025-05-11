import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

function VaccinationDrive() {
  const [drives, setDrives] = useState([]);
  const [newDrive, setNewDrive] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [error, setError] = useState('');

  // Fetch all vaccination drives
  const fetchDrives = async () => {
    try {
      const res = await API.get('/drives'); 
      setDrives(res.data);
    } catch (err) {
      setError('Failed to load vaccination drives');
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleChange = (e) => {
    setNewDrive({ ...newDrive, [e.target.name]: e.target.value });
  };

  // Add a new vaccination drive
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await API.post('/drives', newDrive, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewDrive({ title: '', date: '', location: '', description: '' });
      fetchDrives();
    } catch (err) {
      setError('Failed to add drive');
    }
  };
  

  // Delete a vaccination drive
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/drives/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchDrives();
    } catch (err) {
      setError('Failed to delete drive');
    }
  };  

  return (
    <div>
      <Navbar />
      <h2>Vaccination Drive Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAdd}>
        <input name="title" placeholder="Title" value={newDrive.title} onChange={handleChange} required />
        <input name="date" type="date" value={newDrive.date} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={newDrive.location} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={newDrive.description} onChange={handleChange} required />
        <button type="submit">Add Drive</button>
      </form>

      <h3>Existing Drives</h3>
      <ul>
        {drives.map((drive) => (
          <li key={drive._id}>
            <strong>{drive.title}</strong> — {new Date(drive.date).toLocaleDateString()} — {drive.location}
            <p>{drive.description}</p>
            <button onClick={() => handleDelete(drive._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VaccinationDrive;