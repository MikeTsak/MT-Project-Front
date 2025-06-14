import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { API_BASE_URL } from '../config';

export default function EditProjectPage() {
  const { project_id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/projects/${project_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setProject(d.project);
        else setError(d.error || 'Σφάλμα φόρτωσης έργου');
      });

    fetch(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setAllUsers(d.users);
        else setError('Σφάλμα φόρτωσης χρηστών');
        setLoading(false);
      });
  }, [project_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setError('Λείπει το token');

    console.log('🔑 Token:', token);
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/projects/${project_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          deadline: project.deadline,
          assignees: project.assignees
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        navigate(`/projects/${project_id}`);
      } else {
        setError(data.error || 'Αποτυχία ενημέρωσης');
      }
    } catch (err) {
      console.error('❌ PUT error:', err);
      setError('Σφάλμα αποστολής');
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!project || loading) return <p style={{ textAlign: 'center' }}>⏳ Φόρτωση...</p>;

  return (
    <>
      <Header />
      <div style={{
        padding: '100px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        background: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>✏️ Επεξεργασία έργου</h2>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label>📛 Όνομα:</label>
            <input
              type="text"
              value={project.name}
              maxLength={255}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>

          <div>
            <label>📝 Περιγραφή:</label>
            <textarea
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', minHeight: '100px' }}
            />
          </div>

          <div>
            <label>📅 Προθεσμία:</label>
            <input
              type="date"
              value={project.deadline.slice(0, 10)}
              onChange={(e) => setProject({ ...project, deadline: e.target.value })}
              required
              style={{ padding: '10px', width: '100%' }}
            />
          </div>

          <div>
            <label>👥 Ανάθεση σε:</label>
            <select
              multiple
              value={project.assignees}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setProject({ ...project, assignees: selected });
              }}
              required
              style={{ width: '100%', padding: '10px', height: '150px' }}
            >
              {allUsers.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {saving ? '💾 Αποθήκευση...' : '💾 Αποθήκευση αλλαγών'}
          </button>
        </form>
      </div>
    </>
  );
}
