// src/components/TaskList.js
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TaskList.css';

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUserId(data.user.id);
      });

    fetchTasks();
  }, [projectId]);

  const fetchTasks = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTasks(data.tasks));
  };

  const handleCreate = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: newTask })
    }).then(() => {
      setNewTask('');
      fetchTasks();
    });
  };

  const handleEdit = (taskId) => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: editingText })
    }).then(() => {
      setEditingId(null);
      setEditingText('');
      fetchTasks();
    });
  };

  const handleComplete = (taskId) => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/done`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    }).then(fetchTasks);
  };

  const handleDelete = (taskId) => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(fetchTasks);
  };

  return (
    <div className="task-section">
      <h2>📋 Καθήκοντα</h2>
      <div className="task-create">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Προσθήκη νέου καθήκοντος"
        />
        <button onClick={handleCreate}>➕</button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.is_done ? 'done' : ''}`}>
          {editingId === task.id ? (
            <>
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button onClick={() => handleEdit(task.id)}>💾</button>
              <button onClick={() => { setEditingId(null); setEditingText(''); }}>❌</button>
            </>
          ) : (
            <>
              <span>{task.description}</span>
              <div className="task-actions">
                {!task.is_done && (
                  <button onClick={() => handleComplete(task.id)}>✅</button>
                )}
                {userId === task.created_by && (
                  <>
                    <button onClick={() => { setEditingId(task.id); setEditingText(task.description); }}>✏️</button>
                    <button onClick={() => handleDelete(task.id)}>🗑️</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
