export default function ChatEmptyState({ showRoomsMenu, onOpenRoomsMenu, roomsMenuExpanded }) {
  return (
    <div className="chat-empty">
      {showRoomsMenu ? (
        <button
          type="button"
          className="chat-empty__menu-btn"
          onClick={onOpenRoomsMenu}
          aria-label="Open room list"
          aria-expanded={Boolean(roomsMenuExpanded)}
          aria-controls="chat-room-drawer"
        >
          <span className="chat-header__menu-icon" aria-hidden>
            ☰
          </span>
          Rooms
        </button>
      ) : null}
      <div className="chat-empty__icon" aria-hidden>
        💬
      </div>
      <h2>Pick a room</h2>
      <p>Create a new space or choose a room from the list, or open Rooms to browse.</p>
    </div>
  );
}
