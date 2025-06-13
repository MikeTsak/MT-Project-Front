import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { API_BASE_URL } from '../config';

export default function ProjectPage() {
  const { project_id } = useParams();
  const [project, setProject]   = useState(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${project_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setProject(d.project);
        else setError(d.error);
      })
      .catch(() => setError('Σφάλμα φόρτωσης'));
  }, [project_id]);

  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto', color: '#f0f4f8' }}>
        {error && <p>{error}</p>}
        {!error && !project && <p>Φόρτωση...</p>}
        {project && (
          <>
            <h1>📌 {project.description}</h1>
            <p>🗓️ Προθεσμία: {new Date(project.deadline).toLocaleDateString()}</p>
            <p>👤 Δημιουργός: {project.created_by}</p>
            <p>👥 Ανατεθειμένοι: {project.assignees.join(', ')}</p>
          </>
        )}
      </div>
    </>
  );
}
