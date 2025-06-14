import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/modal.css';

export default function AddProjectModal({ onClose, onCreated }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  const nameLimit = 255;
  const descriptionLimit = 5000;

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setAllUsers(d.users);
        setLoadingUsers(false);
      })
      .catch(() => {
        setAllUsers([]);
        setLoadingUsers(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length > nameLimit || description.length > descriptionLimit) return;
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, deadline, assignees })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onCreated();
        onClose();
        navigate(`/projects/${data.project_id}`);
      } else {
        setError(data.error || 'Σφάλμα');
      }
    } catch {
      setError('Σφάλμα δικτύου');
    }
  };

  const isDisabled = !name || !description || !deadline || assignees.length === 0 || name.length > nameLimit || description.length > descriptionLimit;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>➕ Δημιουργία Project</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 📛 Όνομα */}
        <label htmlFor="name">📛 Όνομα έργου:</label>
        <input
          id="name"
          type="text"
          placeholder="Π.χ. Μισθοδοσία Ιουνίου"
          value={name}
          maxLength={nameLimit}
          onChange={e => setName(e.target.value)}
          required
        />
        <div className="char-counter">{name.length}/{nameLimit}</div>

        {/* 🔤 Περιγραφή */}
        <label htmlFor="description">📝 Περιγραφή του έργου:</label>
        <textarea
          id="description"
          placeholder="Π.χ. Συγκέντρωση παραστατικών για Μάιο"
          value={description}
          maxLength={descriptionLimit}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <div className="char-counter">{description.length}/{descriptionLimit}</div>

        {/* 📅 Προθεσμία */}
        <label htmlFor="deadline">📅 Προθεσμία υποβολής:</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />

        {/* 👥 Ανάθεση σε */}
        <label htmlFor="assignees">👥 Ανάθεση σε χρήστες:</label>
        {loadingUsers ? (
          <p>⏳ Φόρτωση χρηστών...</p>
        ) : (
          <select
            id="assignees"
            multiple
            value={assignees}
            onChange={e => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value);
              setAssignees(opts);
            }}
            required
          >
            {allUsers.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>❌ Ακύρωση</button>
          <button
            type="submit"
            disabled={isDisabled}
            style={{
              backgroundColor: isDisabled ? '#ccc' : '#4caf50',
              color: isDisabled ? '#666' : '#fff',
              cursor: isDisabled ? 'not-allowed' : 'pointer'
            }}
          >
            💾 Αποθήκευση
          </button>
        </div>
      </form>
    </div>
  );
}
