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
    <form className="create-room" onSubmit={handleSubmit} aria-labelledby="create-room-heading">
      <div id="create-room-heading" className="create-room__title">
        New room
      </div>
      <div className="create-room__inputs">
        <input
          type="text"
          className="create-room__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
          disabled={busy}
          required
        />
        <input
          type="text"
          className="create-room__input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={busy}
        />
        <label className="create-room__row">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            disabled={busy}
          />
          <span>Private (invite-only)</span>
        </label>
      </div>
      {error ? <div className="create-room__error">{error}</div> : null}
      <button type="submit" className="create-room__submit" disabled={busy}>
        {busy ? 'Creating…' : 'Create room'}
      </button>
    </form>
  );
}
