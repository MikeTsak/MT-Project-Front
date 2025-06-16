import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/ChatBox.css';

export default function ChatBox({ projectId }) {
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ──────────────────────── Setup & Load Chat ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setMyUsername(payload.username);
    } catch (err) {
      console.error('❌ Token decode error:', err);
    }

    fetch(`${API_BASE_URL}/projects/${projectId}/chat`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => d.success && setChat(d.chat));
  }, [projectId]);

  useEffect(() => {
    if (pushEnabled) subscribeToPush();
  }, [pushEnabled]);

  // ──────────────────────── Push Notification Logic ────────────────────────
  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      await fetch(`${API_BASE_URL}/user/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          project_id: projectId,
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys
        })
      });

      console.log('🔔 Push subscription successful');
    } catch (err) {
      console.error('❌ Push subscription failed:', err);
    }
  };

  const testNotification = async () => {
    await fetch(`${API_BASE_URL}/user/notify-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ project_id: projectId })
    });
    alert('🚀 Test notification sent');
  };

  // ──────────────────────── Chat Functions ────────────────────────
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
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setChat([
            ...chat,
            {
              id: Date.now(),
              username: myUsername,
              message: newMessage,
              timestamp: new Date().toISOString()
            }
          ]);
          setNewMessage('');
        }
      });
  };

  const updateMessage = () => {
    const token = localStorage.getItem('token');
    if (!editingId || !editingText.trim()) return;

    fetch(`${API_BASE_URL}/projects/${projectId}/chat/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: editingText })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setChat(chat.map(c => (c.id === editingId ? { ...c, message: editingText } : c)));
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
    })
      .then(r => r.json())
      .then(d => {
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

  // ──────────────────────── Render ────────────────────────
  return (
    <div className="chat-wrapper">
      <h3>💬 Συζήτηση έργου</h3>

      <div className="push-controls">
        <label>
          {/*
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={() => setPushEnabled(!pushEnabled)}
          />
           🔔 Push Notifications */}
        </label>
        {/* <button onClick={testNotification}>📤 Send Test</button> */}
      </div>

      <div className="chat-window">
        {chat.map((msg) => {
          const isMine = msg.username === myUsername;
          const isEditing = editingId === msg.id;

          return (
            <div key={msg.id} className={`msg-row ${isMine ? 'mine' : ''}`}>
              <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>
                <div className="msg-user">{isMine ? 'Εσείς' : msg.username}</div>

                {isEditing ? (
                  <>
                    <input
                      className="msg-edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateMessage()}
                    />
                    <div className="edit-btn-group">
                      <button onClick={updateMessage}>✅</button>
                      <button onClick={cancelEdit}>❌</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{msg.message}</div>
                    <div className="msg-timestamp">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                    {isMine && (
                      <div className="bubble-actions">
                        <button onClick={() => { setEditingId(msg.id); setEditingText(msg.message); }}>
                          ✏️
                        </button>
                        <button onClick={() => confirmDelete(msg.id)}>🗑️</button>
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

      <div className="chat-input-group">
        <input
          className="chat-input"
          type="text"
          placeholder="✍️ Νέο μήνυμα"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={sendMessage}>➤</button>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>🗑️ Επιβεβαίωση διαγραφής</h4>
            <p>Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το μήνυμα;</p>
            <div className="modal-btn-row">
              <button className="modal-btn-confirm" onClick={deleteMessage}>
                Ναι, Διαγραφή
              </button>
              <button
                className="modal-btn-cancel"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
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
