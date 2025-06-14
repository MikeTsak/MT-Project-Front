import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import ChatBox from '../components/ChatBox';
import { API_BASE_URL } from '../config';
import '../styles/ProjectPage.css';
import AccountingLoader from '../components/AccountingLoader';

export default function ProjectPage() {
  const { project_id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const navigate = useNavigate();

  /* little runner animation */
  const [runnerEmoji, setRunnerEmoji] = useState('🚶');
  const runnerFrames = ['🚶🏻‍♂️', '🧎🏻‍♂️'];
  useEffect(() => {
    const interval = setInterval(() => {
      setRunnerEmoji(prev => {
        const i = runnerFrames.indexOf(prev);
        return runnerFrames[(i + 1) % runnerFrames.length];
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  /* fetch the project */
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${project_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => d.success ? setProject(d.project) : setError(d.error))
      .catch(() => setError('Σφάλμα φόρτωσης'));
  }, [project_id]);

  /* delete handler */
  const deleteProject = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${project_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          alert('✅ Το έργο διαγράφηκε.');
          navigate('/dashboard');
        } else {
          alert(`❌ Αποτυχία διαγραφής: ${d.error}`);
        }
      });
  };

  /* progress-bar renderer */
  const renderProgressBar = () => {
    if (!project) return null;

    const startDate = new Date(project.created_at);
    const endDate   = new Date(project.deadline);
    const now       = new Date();

    const total          = endDate - startDate;
    const passed         = now - startDate;
    const remainingDays  = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const progress       = Math.min(100, Math.max(0, (passed / total) * 100));

    return (
      <div className="progress-container">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />

          <div
            className="runner-icon"
            style={{
              left: `calc(${progress}% - 12px)`,
              animation: remainingDays >= 0 ? 'bounce 0.6s infinite alternate ease-in-out' : 'none'
            }}
          >
            {remainingDays >= 0 ? runnerEmoji : '🧍🏻‍♂️'}
          </div>

          <div className="progress-label">
            {remainingDays >= 0
              ? `⏳ Απομένουν ${remainingDays} μέρες`
              : '✅ Ολοκληρώθηκε'}
          </div>
        </div>

        <div className="progress-dates">
          <span>{startDate.toLocaleDateString()}</span>
          <span>{endDate.toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  /* ───────────────────────── render ───────────────────────── */
  return (
    <>
      <Header />

      <div className="project-wrapper">
        {error && <p>{error}</p>}
        {!error && !project && <p> <AccountingLoader /></p>}

        {project && (
          <>
            <h1>📌 {project.name}</h1>
            <p>📝 {project.description}</p>
            <p>🗓️ Προθεσμία: {new Date(project.deadline).toLocaleDateString()}</p>
            <p>👤 Δημιουργός: {project.created_by}</p>
            <p>👥 Ανατεθειμένοι: {project.assignees.join(', ')}</p>

            {renderProgressBar()}
            <TaskList projectId={project.project_id} />

            <div className="button-group">
              <button
                className="btn-edit"
                onClick={() => navigate(`/edit/${project.project_id}`)}
              >
                ✏️ Επεξεργασία
              </button>

              {!confirmDelete ? (
                <button
                  className="btn-delete"
                  onClick={() => setConfirmDelete(true)}
                >
                  🗑️ Διαγραφή
                </button>
              ) : (
                <div className="delete-confirm">
                  <input
                    className="delete-input"
                    placeholder="Πληκτρολόγησε DELETE"
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                  />
                  <button
                    className={`btn-confirm-delete${deleteText === 'DELETE' ? '' : ' disabled'}`}
                    disabled={deleteText !== 'DELETE'}
                    onClick={deleteProject}
                    /* colour still toggles here so we keep it inline */
                    style={{ background: deleteText === 'DELETE' ? '#e53e3e' : '#a0aec0' }}
                  >
                    Επιβεβαίωση Διαγραφής
                  </button>
                </div>
              )}
            </div>

            <hr style={{ margin: '2rem 0' }} />
           <ChatBox projectId={project.project_id} />
           {/* 🔖 Project ID at bottom */}
          <div style={{
            fontSize: '0.75rem',
            marginTop: '1rem',
            color: '#a0aec0',
            textAlign: 'right',
            fontStyle: 'italic'
          }}>
            ID έργου: {project.project_id}
          </div>
          </>
        )}
        
      </div>
    </>
  );
}
