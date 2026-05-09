export default function ChatInterface({
  currentRoom,
  user,
  messages,
  presenceUsers,
  newMessage,
  onNewMessageChange,
  onSend,
  onLeaveRoom,
  messagesEndRef,
  showRoomsMenu,
  roomsMenuExpanded,
  onOpenRoomsMenu
}) {
  const onlineLabel = presenceUsers.length
    ? presenceUsers.map((u) => u.username).join(', ')
    : 'No one else';

  return (
    <>
      <header className="chat-header">
        <div className="chat-header__primary">
          {showRoomsMenu ? (
            <button
              type="button"
              className="chat-header__menu-btn"
              onClick={onOpenRoomsMenu}
              aria-label="Open room list"
              aria-expanded={Boolean(roomsMenuExpanded)}
              aria-controls="chat-room-drawer"
            >
              <span className="chat-header__menu-icon" aria-hidden>
                ☰
              </span>
            </button>
          ) : null}
          <div className="chat-header__titles">
            <h2 id="chat-active-room-heading">{currentRoom.name}</h2>
            <p>{currentRoom.description || 'No description'}</p>
          </div>
        </div>
        <div className="chat-header__aside">
          <div className="chat-presence">
            <span className="chat-presence__label">Online now</span>
            <span className="chat-presence__names">{onlineLabel}</span>
          </div>
          <button type="button" className="chat-btn-outline" onClick={onLeaveRoom}>
            Leave room
          </button>
        </div>
      </header>

      <div
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-labelledby="chat-active-room-heading"
      >
        {messages.map((msg, index) => {
          const isSystem = msg.user === 'System';
          const isOwn =
            !isSystem && (msg.sender?.username === user.username || msg.user === user.username);
          let rowClass = 'chat-message chat-message--peer';
          if (isSystem) rowClass += ' chat-message--system';
          else if (isOwn) rowClass += ' chat-message--own';

          return (
            <article key={msg._id ?? index} className={rowClass}>
              {!isSystem && (
                <div className="chat-message__meta">
                  <span className="chat-message__author">{msg.sender?.username || msg.user}</span>
                  <time className="chat-message__time" dateTime={msg.createdAt}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
              )}
              <div className="chat-message__bubble">{msg.content || msg.text}</div>
            </article>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-composer" onSubmit={onSend}>
        <label htmlFor="chat-message-input" className="visually-hidden">
          Message
        </label>
        <input
          id="chat-message-input"
          className="chat-composer__input"
          type="text"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          placeholder="Write a message…"
          autoComplete="off"
        />
        <button type="submit" className="chat-composer__send">
          Send
        </button>
      </form>
    </>
  );
}
