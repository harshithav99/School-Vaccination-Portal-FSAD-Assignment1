// src/pages/MyDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

function MyDashboard() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/drives', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDrives(res.data);
      } catch (err) {
        console.error('Failed to fetch drives', err);
      }
    };

    fetchDrives();
  }, []);

  return (
    <div>
      <Navbar /> {/* Your page content below */}
      <h2>Welcome to the Dashboard</h2>
      {drives.map((drive) => (
        <div key={drive._id}>
          <h3>{drive.name}</h3>
          <p>{new Date(drive.date).toDateString()} — {drive.venue}</p>
          <p>{drive.description}</p>
        </div> 
      ))}
    </div>
  );
}

export default MyDashboard;