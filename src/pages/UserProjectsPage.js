import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Header from '../components/Header';
import AccountingLoader from '../components/AccountingLoader';

export default function UserProjectsPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/user/${username}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setProjects(d.projects);
        else setError(d.error || 'Κάτι πήγε στραβά.');
      })
      .catch(() => setError('Σφάλμα φόρτωσης.'));
  }, [username]);

  return (
    <>
      <Header />
      <div className="project-wrapper">
        <h2>📁 Έργα χρήστη: {username}</h2>
        {error && <p>❌ {error}</p>}
        {!error && projects.length === 0 && <AccountingLoader />}
        {!error && projects.length > 0 && (
          <ul style={{ paddingLeft: '1rem' }}>
            {projects.map(p => (
              <li
                key={p.project_id}
                style={{ marginBottom: '1rem', cursor: 'pointer', color: '#4299e1' }}
                onClick={() => navigate(`/projects/${p.project_id}`)}
              >
                <strong>📌 {p.name}</strong><br />
                <small>🗓️ Προθεσμία: {new Date(p.deadline).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
