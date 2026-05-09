import { useState } from 'react';

export default function CreateChatRoomForm({ token, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Room name is required');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: trimmed,
          description: description.trim(),
          isPrivate
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setName('');
        setDescription('');
        setIsPrivate(false);
        onCreated?.(data.data);
      } else {
        setError(data.message || 'Could not create room');
      }
    } catch {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={formTitleStyle}>New room</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Room name"
        style={inputStyle}
        disabled={busy}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        style={inputStyle}
        disabled={busy}
      />
      <label style={checkboxRowStyle}>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          disabled={busy}
        />
        <span>Private room</span>
      </label>
      {error ? <div style={errorStyle}>{error}</div> : null}
      <button type="submit" style={submitStyle} disabled={busy}>
        {busy ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}

const formStyle = {
  padding: '1rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const formTitleStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)'
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)'
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const errorStyle = {
  fontSize: '0.8rem',
  color: '#f87171'
};

const submitStyle = {
  marginTop: '0.25rem',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  background: 'var(--accent-primary)',
  color: 'white',
  fontWeight: '600',
  fontSize: '0.85rem',
  alignSelf: 'flex-start'
};
