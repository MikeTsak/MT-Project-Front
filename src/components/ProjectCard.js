import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function ProjectCard({ project }) {
  /** ---------- progress υπολογισμός ---------- **/
  const { progress, spinSpeed } = useMemo(() => {
    const now   = Date.now();
    const start = new Date(project.created_at).getTime();
    const end   = new Date(project.deadline).getTime();

    const total     = Math.max(end - start, 1);         // avoid /0
    const elapsed   = Math.max(now - start, 0);
    const percent   = Math.min(elapsed / total, 1);     // 0–1

    /* Όσο μικρότερο το timeRatio (άρα πιο κοντά στο deadline) => πιο γρήγορο flip */
    const timeRatio = 1 - percent;                      // 1 (μόλις ξεκίνησε) → 0 (deadline)
    const duration  = Math.max(0.8, 5 * timeRatio + 0.8); // 0.8-5.8s

    return { progress: percent, spinSpeed: duration };
  }, [project.created_at, project.deadline]);

  /** ---------- JSX ---------- **/
  return (
    <Link to={`/projects/${project.project_id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '0.75rem',
        padding: '1rem 1.5rem',
        color: '#1a202c',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          📌 {project.description}
        </div>

        <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
          🗓️ Προθεσμία: {new Date(project.deadline).toLocaleDateString()}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#4c51bf', marginTop: '0.5rem' }}>
          👥 {project.assignees.join(', ')}
        </div>

        {/* progress bar + hourglass */}
        <div className="progress-wrapper">
          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{ width: `${(progress * 100).toFixed(0)}%` }}
            />
          </div>

          <span
            className="hourglass"
            style={{ animationDuration: `${spinSpeed}s` }}
            title={`Progress ${(progress * 100).toFixed(0)}%`}
          >
            ⌛
          </span>
        </div>
      </div>
    </Link>
  );
}
