import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import ChatSidebar from './chat/ChatSidebar';
import ChatInterface from './chat/ChatInterface';
import ChatEmptyState from './chat/ChatEmptyState';
import '../styles/chat.css';

const MQ_MOBILE = '(max-width: 768px)';

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MQ_MOBILE).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MQ_MOBILE);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export default function ChatPage() {
  const { user, token, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [presenceUsers, setPresenceUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const isMobileLayout = useIsMobileLayout();

  useEffect(() => {
    if (!isMobileLayout) setMobileRoomsOpen(false);
  }, [isMobileLayout]);

  useEffect(() => {
    if (!(isMobileLayout && mobileRoomsOpen)) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileRoomsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileLayout, mobileRoomsOpen]);

  useEffect(() => {
    if (!(isMobileLayout && mobileRoomsOpen)) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileLayout, mobileRoomsOpen]);

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

  const handleSelectRoom = useCallback((room) => {
    setCurrentRoom(room);
    setMobileRoomsOpen(false);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentRoom || !socket) return;

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
      setMobileRoomsOpen(false);
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  };

  const handleRoomCreated = (room) => {
    mergeRoomIntoList(room);
    setCurrentRoom(room);
    fetchRooms();
    setMobileRoomsOpen(false);
  };

  const closeMobileRooms = useCallback(() => setMobileRoomsOpen(false), []);

  const sidebarHiddenFromAssistiveTech =
    isMobileLayout && !mobileRoomsOpen ? true : undefined;

  return (
    <div
      className={`chat-layout${isMobileLayout ? ' chat-layout--mobile-nav' : ''}`}
      data-drawer-open={isMobileLayout && mobileRoomsOpen ? 'true' : 'false'}
    >
      {isMobileLayout && mobileRoomsOpen ? (
        <button
          type="button"
          className="chat-sidebar-backdrop"
          onClick={closeMobileRooms}
          aria-label="Dismiss room list"
        />
      ) : null}

      <ChatSidebar
        rooms={rooms}
        currentRoomId={currentRoom?._id}
        token={token}
        user={user}
        onSelectRoom={handleSelectRoom}
        onRoomCreated={handleRoomCreated}
        onLogout={logout}
        mobileOpen={isMobileLayout && mobileRoomsOpen}
        onCloseMobile={closeMobileRooms}
        sidebarAriaHidden={sidebarHiddenFromAssistiveTech}
      />

      <main className="chat-main">
        {currentRoom ? (
          <ChatInterface
            currentRoom={currentRoom}
            user={user}
            messages={messages}
            presenceUsers={presenceUsers}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSend={handleSendMessage}
            onLeaveRoom={handleLeaveRoomClick}
            messagesEndRef={messagesEndRef}
            showRoomsMenu={isMobileLayout}
            roomsMenuExpanded={mobileRoomsOpen}
            onOpenRoomsMenu={() => setMobileRoomsOpen(true)}
          />
        ) : (
          <ChatEmptyState
            showRoomsMenu={isMobileLayout}
            roomsMenuExpanded={mobileRoomsOpen}
            onOpenRoomsMenu={() => setMobileRoomsOpen(true)}
          />
        )}
      </main>
    </div>
  );
}
