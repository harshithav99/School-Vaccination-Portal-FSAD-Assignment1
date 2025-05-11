import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReport(res.data);
      } catch (err) {
        setError('Failed to fetch reports');
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Reports</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report ? (
        <div style={{ width: '200px', height: '200px', marginTop: '20px' }}>
          <p>Total Students: {report.totalStudents}</p>
          <p>Vaccinated Students: {report.vaccinatedStudents}</p>
          <p>Vaccination Percentage: {report.vaccinationPercentage}%</p>
          <Pie
          data={{
          labels: ['Vaccinated', 'Not Vaccinated'],
          datasets: [
          {
            data: [
              report.vaccinatedStudents,
              report.totalStudents - report.vaccinatedStudents,
            ],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1,
          },
        ],
      }}
      />
          <h3>Upcoming Drives (Next 30 Days)</h3>
          {report.upcomingDrives.length === 0 ? (
            <p>No upcoming drives</p>
          ) : (
            <ul>
              {report.upcomingDrives.map((drive, index) => (
                <li key={index}>
                  <strong>{drive.title}</strong><br />
                  {new Date(drive.date).toLocaleDateString()}<br />
                  {drive.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Reports;