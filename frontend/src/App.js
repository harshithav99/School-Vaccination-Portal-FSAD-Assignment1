/*import React from 'react';
import MyDashboard from './pages/MyDashboard'; 
console.log(MyDashboard); 
function App() {
  return (
    <div>
      <MyDashboard />
    </div>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MyDashboard from './pages/MyDashboard';
import PrivateRoute from './components/PrivateRoute'; // wherever you placed PrivateRoute.js
import StudentManagement from './pages/StudentManagement';
import VaccinationDrive from './pages/DriveManagement';
import Reports from './pages/Reports'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <MyDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/students" 
          element={
              <PrivateRoute>
                  <StudentManagement />
              </PrivateRoute>
          } 
        />
        <Route
          path="/drives"
          element={
            <PrivateRoute>
                <VaccinationDrive />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
