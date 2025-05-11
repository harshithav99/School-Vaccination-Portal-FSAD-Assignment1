import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
  
<nav style={{
  padding: '10px',
  backgroundColor: '#001f3f',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap'
}}>
  {['/dashboard', '/students', '/drives', '/reports', '/register'].map((path, i) => {
    const names = ['Dashboard', 'Students', 'Vaccination Drives', 'Reports', 'Register'];
    return (
      <Link
        key={path}
        to={path}
        style={{
          backgroundColor: '#001f3f',
          padding: '6px 12px',
          borderRadius: '5px',
          color: 'white',
          textDecoration: 'none',
        }}
      >
        {names[i]}
      </Link>
    );
  })}
  <button onClick={handleLogout} style={{
    backgroundColor: '#005288',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
  }}>
    Logout
  </button>
</nav>
  );
  
}

export default Navbar;