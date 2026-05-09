import CreateChatRoomForm from '../CreateChatRoomForm';
import RoomList from './RoomList';

export default function ChatSidebar({
  rooms,
  currentRoomId,
  token,
  user,
  onSelectRoom,
  onRoomCreated,
  onLogout,
  mobileOpen,
  onCloseMobile,
  sidebarAriaHidden
}) {
  return (
    <aside
      id="chat-room-drawer"
      className={`chat-sidebar${mobileOpen ? ' chat-sidebar--open' : ''}`}
      aria-hidden={sidebarAriaHidden ?? undefined}
    >
      <header className="chat-sidebar__header">
        <div className="chat-sidebar__header-row">
          <div className="chat-sidebar__brand">
            <span className="chat-sidebar__brand-dot" aria-hidden />
            ChatRooms
          </div>
          <button
            type="button"
            className="chat-sidebar__close"
            onClick={onCloseMobile}
            aria-label="Close room list"
          >
            ✕
          </button>
        </div>
      </header>
      <CreateChatRoomForm token={token} onCreated={onRoomCreated} />
      <RoomList rooms={rooms} currentRoomId={currentRoomId} onSelectRoom={onSelectRoom} />
      <footer className="chat-sidebar__footer">
        <div className="chat-user">
          <div className="chat-user__avatar" aria-hidden>
            {user.username?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <span className="chat-user__name">{user.username}</span>
        </div>
        <button type="button" className="chat-btn-ghost" onClick={onLogout}>
          Log out
        </button>
      </footer>
    </aside>
  );
}
