import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

const symbols = ['+', '-', '=', '%', '€', '×', '÷', '≈', '∑', 'π'];
const floatingElements = Array.from({ length: 20 }, () => ({
  symbol: symbols[Math.floor(Math.random() * symbols.length)],
  left: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 10 + Math.random() * 20,
}));


    try {
      console.log('📡 Αποστολή αιτήματος σύνδεσης...');

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('📨 Απάντηση από τον server:', data);

      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);
        console.log('✅ Είσοδος επιτυχής! Ανακατεύθυνση...');
        navigate('/home');
      } else {
        console.warn('❌ Αποτυχία σύνδεσης:', data.error);
        setError('❌ Λάθος στοιχεία σύνδεσης');
      }
    } catch (err) {
      console.error('🔥 Σφάλμα:', err);
      setError('⚠️ Πρόβλημα σύνδεσης με τον διακομιστή');
    }
  };

  return (
    <form className="login-container" onSubmit={handleLogin}>
      <div className="login-title">📊 Σύνδεση Λογιστή</div>
      {error && <div className="error-text">{error}</div>}
      <input
        type="text"
        placeholder="👤 Όνομα χρήστη"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="🔑 Κωδικός"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="login-button">
        ➡️ Είσοδος
      </button>
    </form>
  );
}
