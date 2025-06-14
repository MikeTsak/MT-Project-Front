import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function ProjectCard({ project }) {
  const { progress, spinSpeed } = useMemo(() => {
    const now = Date.now();
    const start = new Date(project.created_at).getTime();
    const end = new Date(project.deadline).getTime();

    const total = Math.max(end - start, 1);
    const elapsed = Math.max(now - start, 0);
    const percent = Math.min(elapsed / total, 1);

    const timeRatio = 1 - percent;
    const duration = Math.max(0.8, 5 * timeRatio + 0.1);

    return { progress: percent, spinSpeed: duration };
  }, [project.created_at, project.deadline]);

  return (
    <Link to={`/projects/${project.project_id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          color: '#1a202c',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          marginBottom: '1rem',
          transition: 'transform 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            🏷️ {project.name || 'Χωρίς τίτλο' }
          </div>

          <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
            📌 {project.description || '—'}
          </div>

          <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
            🗓️ Προθεσμία: {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#4c51bf', marginTop: '0.5rem' }}>
            👥 {Array.isArray(project.assignees) && project.assignees.length > 0
              ? project.assignees.join(', ')
              : 'Κανείς'}
          </div>

          <div
            style={{
              marginTop: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                flexGrow: 1,
                background: '#e2e8f0',
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#4c51bf',
                  width: `${(progress * 100).toFixed(0)}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <span
              style={{
                animation: progress < 1 ? `spin ${spinSpeed}s linear infinite` : 'none',
                display: 'inline-block',
                fontSize: '1.2rem',
              }}
              title={`Ολοκλήρωση: ${(progress * 100).toFixed(0)}%`}
            >
              {progress < 1 ? '⌛' : '🎯'}
            </span>
          </div>
        </div>

        {/* 📎 Project ID */}
        <div style={{
          fontSize: '0.75rem',
          marginTop: '1rem',
          color: '#718096',
          textAlign: 'right',
          fontStyle: 'italic'
        }}>
          ID έργου: {project.project_id}
        </div>
      </div>
    </Link>
  );
}
