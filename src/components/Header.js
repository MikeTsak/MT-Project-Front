import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div
        className="header-logo"
        onClick={() => navigate('/home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}
      >
        <img src="/mtlogo.png" alt="MT Logo" style={{ height: '40px' }} />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
          MyAccountApp
        </span>
      </div>

      <div className="profile-icon" onClick={() => setMenuOpen(!menuOpen)}>
        👤
        {menuOpen && (
          <div className="profile-dropdown">
            <button onClick={() => navigate('/profile')}>🔧 Ρυθμίσεις Προφίλ</button>
            <button onClick={handleLogout}>🚪 Αποσύνδεση</button>
          </div>
        )}
      </div>
    </header>
  );
}
