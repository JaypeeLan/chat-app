export default function RoomList({ rooms, currentRoomId, onSelectRoom }) {
  if (!rooms?.length) {
    return (
      <div className="room-list">
        <span className="room-list__label">Your rooms</span>
        <p className="room-list__empty">No rooms yet. Create one above.</p>
      </div>
    );
  }

  return (
    <nav className="room-list" aria-label="Chat rooms">
      <span className="room-list__label">Your rooms</span>
      <ul className="room-list__scroll" role="list">
        {rooms.map((room) => {
          const active = currentRoomId && String(currentRoomId) === String(room._id);
          const memberCount = Array.isArray(room.participants) ? room.participants.length : 0;

          const desc =
            (room.description && String(room.description).trim()) ||
            (room.isPrivate ? 'Private room' : 'Open chat');

          return (
            <li key={room._id}>
              <button
                type="button"
                className={`room-list__item${active ? ' room-list__item--active' : ''}`}
                onClick={() => onSelectRoom(room)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="room-list__icon" aria-hidden>
                  {room.name?.charAt(0)?.toUpperCase() ?? '?'}
                </span>
                <span className="room-list__body">
                  <span className="room-list__row">
                    <span className="room-list__name">{room.name}</span>
                    {memberCount > 0 ? (
                      <span className="room-list__badge" title={`${memberCount} members`}>
                        {memberCount}
                      </span>
                    ) : null}
                  </span>
                  <span className="room-list__desc">{desc}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
