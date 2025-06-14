import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import Header from '../components/Header';
import '../styles/ProfilePage.css';
import AccountingLoader from '../components/AccountingLoader';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', permission_level: '' });
  const [newPassword, setNewPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.profile);
          setForm(data.profile);
        }
      });

    fetch(`${API_BASE_URL}/auth/is-admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin));
  }, []);

  const handleUpdate = () => {
    fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert('✅ Προφίλ ενημερώθηκε');
        else alert(`❌ Αποτυχία: ${data.error}`);
      });
  };

  const handlePasswordChange = () => {
    if (!newPassword) return alert('⚠️ Δώσε νέο κωδικό');
    fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert('🔐 Κωδικός άλλαξε');
        else alert(`❌ Σφάλμα: ${data.error}`);
      });
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <h1>👤 Το προφίλ μου</h1>

        {profile ? (
          <>
            {!editMode ? (
              <div className="profile-info">
                <p><strong>👥 Όνομα χρήστη:</strong> {profile.username}</p>
                <p><strong>📧 Email:</strong> {profile.email}</p>
                <p><strong>🔑 Ρόλος:</strong> {profile.permission_level}</p>
                <button onClick={() => setEditMode(true)}>✏️ Επεξεργασία</button>
              </div>
            ) : (
              <div className="profile-edit">
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="Όνομα χρήστη"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                />
                <button onClick={handleUpdate}>💾 Αποθήκευση</button>
                <button onClick={() => setEditMode(false)}>↩️ Ακύρωση</button>
              </div>
            )}

            <div className="password-change">
              <h3>🔐 Αλλαγή Κωδικού</h3>
              <input
                type="password"
                placeholder="Νέος κωδικός"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button onClick={handlePasswordChange}>🔄 Ανανέωση</button>
            </div>

            {isAdmin && <p style={{ color: 'limegreen' }}>👑 Είσαι Admin</p>}
          </>
        ) : (
          <p><AccountingLoader />.</p>
        )}
      </div>
    </>
  );
}
