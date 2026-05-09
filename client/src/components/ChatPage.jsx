import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import CreateChatRoomForm from './CreateChatRoomForm';

function ChatPage() {
  const { user, token, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [presenceUsers, setPresenceUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const mergeRoomIntoList = useCallback((room) => {
    if (!room?._id) return;
    setRooms((prev) => {
      const idx = prev.findIndex((r) => String(r._id) === String(room._id));
      if (idx === -1) return [...prev, room].sort((a, b) => a.name.localeCompare(b.name));
      const next = [...prev];
      next[idx] = room;
      return next;
    });
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  }, [token]);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      auth: { token }
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchRooms();
  }, [token, fetchRooms]);

  useEffect(() => {
    if (!rooms.length) {
      setCurrentRoom(null);
      return;
    }
    setCurrentRoom((prev) => {
      if (prev && rooms.some((r) => String(r._id) === String(prev._id))) return prev;
      return rooms[0];
    });
  }, [rooms]);

  useEffect(() => {
    if (!currentRoom?._id || !token) {
      setMessages([]);
      return;
    }
    setMessages([]);
    const rid = currentRoom._id;

    const load = async () => {
      try {
        const res = await fetch(`/api/rooms/${rid}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    load();
  }, [currentRoom?._id, token]);

  useEffect(() => {
    if (!socket || !user?._id || !token || !currentRoom?._id) {
      setPresenceUsers([]);
      return undefined;
    }

    const rid = currentRoom._id;
    let finished = false;

    const onPresence = ({ roomId, users }) => {
      if (String(roomId) !== String(rid)) return;
      setPresenceUsers(Array.isArray(users) ? users : []);
    };

    const onMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('roomPresence', onPresence);
    socket.on('message', onMessage);

    fetch(`/api/rooms/${rid}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (finished || !data.success) return;
        if (data.data) mergeRoomIntoList(data.data);
        socket.emit('joinRoom', {
          roomId: rid,
          userId: user._id,
          username: user.username
        });
      })
      .catch((err) => console.error('Error joining room:', err));

    return () => {
      finished = true;
      socket.off('roomPresence', onPresence);
      socket.off('message', onMessage);
      socket.emit('leaveRoom', { roomId: rid });
      fetch(`/api/rooms/${rid}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) mergeRoomIntoList(data.data);
        })
        .catch(() => {});
      setPresenceUsers([]);
    };
  }, [socket, currentRoom?._id, user?._id, user?.username, token, mergeRoomIntoList]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentRoom) return;

    try {
      const res = await fetch(`/api/rooms/${currentRoom._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });
      const data = await res.json();
      if (data.success) {
        socket.emit('chatMessage', { roomId: currentRoom._id, message: data.data });
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleLeaveRoomClick = async () => {
    if (!currentRoom || !token || !socket) return;
    socket.emit('leaveRoom', { roomId: currentRoom._id });
    try {
      const res = await fetch(`/api/rooms/${currentRoom._id}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) mergeRoomIntoList(data.data);

      const next = rooms.filter((r) => String(r._id) !== String(currentRoom._id));
      setRooms(next);
      setCurrentRoom(next[0] || null);
      setMessages([]);
      setPresenceUsers([]);
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  };

  const handleRoomCreated = (room) => {
    mergeRoomIntoList(room);
    setCurrentRoom(room);
    fetchRooms();
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>ChatRooms</h2>
        </div>
        <CreateChatRoomForm token={token} onCreated={handleRoomCreated} />
        <div style={roomListStyle}>
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => setCurrentRoom(room)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCurrentRoom(room);
                }
              }}
              style={{
                ...roomItemStyle,
                backgroundColor:
                  currentRoom?._id === room._id ? 'var(--bg-tertiary)' : 'transparent',
                borderColor:
                  currentRoom?._id === room._id ? 'var(--accent-primary)' : 'transparent'
              }}
            >
              <div style={roomIconStyle}>{room.name.charAt(0)}</div>
              <div>
                <div style={roomNameStyle}>{room.name}</div>
                <div style={roomDescStyle}>
                  {room.description || 'Public room'}
                  {Array.isArray(room.participants) ? ` · ${room.participants.length} members` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={userProfileStyle}>
          <div style={userInfoStyle}>
            <div style={userAvatarStyle}>{user.username.charAt(0).toUpperCase()}</div>
            <div style={usernameStyle}>{user.username}</div>
          </div>
          <button type="button" onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>

      <div style={chatAreaStyle}>
        {currentRoom ? (
          <>
            <div style={chatHeaderStyle}>
              <div>
                <h3 style={roomHeaderNameStyle}>{currentRoom.name}</h3>
                <p style={roomHeaderDescStyle}>
                  {currentRoom.description || 'No description'}
                </p>
              </div>
              <div style={headerActionsStyle}>
                <div style={presenceStyle}>
                  <span style={presenceLabelStyle}>Online</span>
                  <span style={presenceNamesStyle}>
                    {presenceUsers.length
                      ? presenceUsers.map((u) => u.username).join(', ')
                      : 'No one else'}
                  </span>
                </div>
                <button type="button" onClick={handleLeaveRoomClick} style={leaveButtonStyle}>
                  Leave room
                </button>
              </div>
            </div>

            <div style={messagesContainerStyle}>
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  style={{
                    ...messageWrapperStyle,
                    alignSelf:
                      msg.sender?.username === user.username || msg.user === user.username
                        ? 'flex-end'
                        : 'flex-start'
                  }}
                >
                  <div style={msgInfoStyle}>
                    <span style={msgSenderStyle}>
                      {msg.sender?.username || msg.user || 'System'}
                    </span>
                    <span style={msgTimeStyle}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      ...messageContentStyle,
                      backgroundColor:
                        msg.user === 'System'
                          ? 'transparent'
                          : msg.sender?.username === user.username
                            ? 'var(--accent-primary)'
                            : 'var(--bg-tertiary)',
                      color: msg.user === 'System' ? 'var(--text-muted)' : 'white',
                      fontStyle: msg.user === 'System' ? 'italic' : 'normal',
                      boxShadow: msg.user === 'System' ? 'none' : 'var(--shadow-sm)'
                    }}
                  >
                    {msg.content || msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={inputAreaStyle}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={inputStyle}
              />
              <button type="submit" style={sendButtonStyle}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={emptyChatStyle}>
            <h2>Select or create a room to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: 'var(--bg-primary)'
};

const sidebarStyle = {
  width: '320px',
  background: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
};

const sidebarHeaderStyle = {
  padding: '1.5rem',
  borderBottom: '1px solid var(--border-color)'
};

const sidebarTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const roomListStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '1rem'
};

const roomItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.875rem',
  borderRadius: 'var(--border-radius)',
  cursor: 'pointer',
  transition: 'var(--transition-fast)',
  marginBottom: '0.5rem',
  border: '1px solid transparent'
};

const roomIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: 'var(--accent-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '1.2rem',
  color: 'white'
};

const roomNameStyle = {
  fontWeight: '600',
  fontSize: '0.95rem'
};

const roomDescStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px'
};

const userProfileStyle = {
  padding: '1rem',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(0,0,0,0.1)'
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

const userAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const usernameStyle = {
  fontSize: '0.9rem',
  fontWeight: '500'
};

const logoutButtonStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  padding: '0.4rem 0.8rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)'
};

const chatAreaStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
};

const chatHeaderStyle = {
  padding: '1rem 2rem',
  borderBottom: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap'
};

const headerActionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.5rem',
  minWidth: '200px'
};

const presenceStyle = {
  textAlign: 'right',
  maxWidth: '420px'
};

const presenceLabelStyle = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
  marginBottom: '0.25rem'
};

const presenceNamesStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
};

const leaveButtonStyle = {
  fontSize: '0.8rem',
  padding: '0.4rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  background: 'var(--bg-secondary)'
};

const roomHeaderNameStyle = {
  fontSize: '1.1rem',
  fontWeight: '700'
};

const roomHeaderDescStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

const messagesContainerStyle = {
  flex: 1,
  padding: '2rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const messageWrapperStyle = {
  maxWidth: '70%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const msgInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  padding: '0 0.5rem'
};

const msgSenderStyle = {
  fontWeight: '600',
  color: 'var(--text-secondary)'
};

const msgTimeStyle = {
  opacity: 0.8
};

const messageContentStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '16px',
  fontSize: '0.95rem',
  lineHeight: 1.4,
  wordBreak: 'break-word'
};

const inputAreaStyle = {
  padding: '1.5rem 2rem',
  display: 'flex',
  gap: '1rem',
  borderTop: '1px solid var(--border-color)',
  background: 'var(--bg-primary)'
};

const inputStyle = {
  flex: 1,
  padding: '0.875rem 1.25rem',
  fontSize: '0.95rem'
};

const sendButtonStyle = {
  backgroundColor: 'var(--accent-primary)',
  color: 'white',
  padding: '0 1.5rem',
  borderRadius: 'var(--border-radius)',
  fontWeight: '600'
};

const emptyChatStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-muted)'
};

export default ChatPage;
