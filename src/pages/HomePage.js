import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import AddProjectModal from '../components/AddProjectModal';
import { API_BASE_URL } from '../config';
import '../styles/home.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [page, setPage]         = useState(1);
  const [limit, setLimit]       = useState(10);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => d.success && setProjects(d.projects))
      .catch(() => setProjects([]));
  };

  useEffect(() => { fetchProjects(); }, [page, limit]);

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-toolbar">
          <button onClick={() => setShowModal(true)}>➕ Προσθήκη Project</button>

          <select value={limit} onChange={e => { setPage(1); setLimit(Number(e.target.value)); }}>
            <option value={10}>10</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="project-list">
          {projects.map(p => <ProjectCard key={p.project_id} project={p} />)}
          {projects.length === 0 && <p>Δεν υπάρχουν projects.</p>}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>⬅️ Προηγ.</button>
          <span>Σελίδα {page}</span>
          <button onClick={() => setPage(p => p + 1)}>Επόμενη ➡️</button>
        </div>
      </div>

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}
    </>
  );
}
