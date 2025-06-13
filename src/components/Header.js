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
      <a href="/home" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src="/mtlogo.png" alt="MT Logo" style={{ height: '40px' }} />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
            MyAccountApp
        </span>
        </a>


      <div className="profile-icon" onClick={() => setMenuOpen(!menuOpen)}>
        👤
        {menuOpen && (
          <div className="profile-dropdown">
            <a href="/profile">🔧 Ρυθμίσεις Προφίλ</a>
            <button onClick={handleLogout}>🚪 Αποσύνδεση</button>
          </div>
        )}
      </div>
    </header>
  );
}
