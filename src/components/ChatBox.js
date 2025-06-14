import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

export default function ChatBox({ projectId }) {
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setMyUsername(payload.username);
    } catch (err) {
      console.error('❌ Error decoding token:', err);
    }

    fetch(`${API_BASE_URL}/projects/${projectId}/chat`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => d.success && setChat(d.chat));
  }, [projectId]);

  const sendMessage = () => {
    const token = localStorage.getItem('token');
    if (!newMessage.trim()) return;

    fetch(`${API_BASE_URL}/projects/${projectId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: newMessage })
    }).then(r => r.json()).then(d => {
      if (d.success) {
        setChat([...chat, {
          id: Date.now(),
          username: myUsername,
          message: newMessage,
          timestamp: new Date().toISOString()
        }]);
        setNewMessage('');
      }
    });
  };

  const updateMessage = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/chat/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: editingText })
    }).then(r => r.json()).then(d => {
      if (d.success) {
        setChat(chat.map(c => c.id === editingId ? { ...c, message: editingText } : c));
        cancelEdit();
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const deleteMessage = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/projects/${projectId}/chat/${deleteTargetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      if (d.success) {
        setChat(chat.filter(c => c.id !== deleteTargetId));
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
    if (e.key === 'ArrowUp') {
      const last = [...chat].reverse().find(m => m.username === myUsername);
      if (last) {
        setEditingId(last.id);
        setEditingText(last.message);
      }
    }
  };

  return (
    <div>
      <h3>💬 Συζήτηση έργου</h3>
      <div style={{
        background: '#2d3748',
        padding: '1rem',
        borderRadius: '0.5rem',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {chat.map((msg) => {
          const isMine = msg.username === myUsername;
          const isEditing = editingId === msg.id;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                marginBottom: '0.5rem'
              }}
            >
              <div
                style={{
                  background: isMine ? '#4c51bf' : '#4a5568',
                  color: 'white',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{isMine ? 'Εσείς' : msg.username}</div>

                {isEditing ? (
                  <>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateMessage()}
                      style={{
                        width: '100%',
                        padding: '0.3rem',
                        marginTop: '0.3rem',
                        border: '1px solid #d69e2e',
                        borderRadius: '4px'
                      }}
                    />
                    <div style={{ marginTop: '0.3rem' }}>
                      <button onClick={updateMessage} style={{ marginRight: '0.5rem', color: 'white' }}>✅</button>
                      <button onClick={cancelEdit} style={{ color: 'white' }}>❌</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{msg.message}</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e0', marginTop: '0.2rem' }}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                    {isMine && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                        <button
                          onClick={() => {
                            setEditingId(msg.id);
                            setEditingText(msg.message);
                          }}
                          style={{ marginRight: '0.3rem', background: 'transparent', color: 'white' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => confirmDelete(msg.id)}
                          style={{ background: 'transparent', color: 'white' }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {chat.length === 0 && <p>🚫 Καμία συνομιλία ακόμη.</p>}
      </div>

      {/* Send Message Input */}
      <div style={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="✍️ Νέο μήνυμα"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flexGrow: 1, padding: '0.5rem' }}
        />
        <button onClick={sendMessage} style={{ background: '#4c51bf', color: 'white', border: 'none', padding: '0.5rem 1rem' }}>
          ➤
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d3748',
            color: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h4>🗑️ Επιβεβαίωση διαγραφής</h4>
            <p>Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το μήνυμα;</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={deleteMessage}
                style={{ background: '#e53e3e', color: 'white', padding: '0.5rem 1rem', border: 'none' }}
              >
                Ναι, Διαγραφή
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
                style={{ background: '#4a5568', color: 'white', padding: '0.5rem 1rem', border: 'none' }}
              >
                Άκυρο
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
