import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/modal.css';

export default function AddProjectModal({ onClose, onCreated }) {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline]   = useState('');
  const [assignees, setAssignees] = useState([]);
  const [allUsers, setAllUsers]   = useState([]);
  const [error, setError]         = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(r => r.json())
      .then(d => setAllUsers(d.users))
      .catch(() => setAllUsers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description, deadline, assignees })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onCreated();
        onClose();
      } else {
        setError(data.error || 'Σφάλμα');
      }
    } catch {
      setError('Σφάλμα δικτύου');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>➕ Νέο Project</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <textarea
          placeholder="Περιγραφή"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
        <select multiple value={assignees} onChange={e => {
          const opts = Array.from(e.target.selectedOptions).map(o => o.value);
          setAssignees(opts);
        }} required>
          {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>❌ Ακύρωση</button>
          <button type="submit">💾 Αποθήκευση</button>
        </div>
      </form>
    </div>
  );
}
