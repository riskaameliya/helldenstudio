import { sectionIds } from "@/config/navigation";
import {
  floors,
  type FloorId,
  type StudioRoom,
} from "@/features/studio-anatomy/types/rooms";

type RoomIndexProps = {
  rooms: StudioRoom[];
  activeFloor?: FloorId;
  activeRoom?: StudioRoom;
  onSelect: (room: StudioRoom) => void;
};

export function RoomIndex({
  rooms,
  activeFloor,
  activeRoom,
  onSelect,
}: RoomIndexProps) {
  return (
    <section
      id={sectionIds.rooms}
      aria-labelledby="rooms-title"
      className="bg-paper text-ink"
    >
      <div className="site-gutter mx-auto grid max-w-screen-2xl gap-8 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 id="rooms-title" className="editorial-title">
            Two floors. Different frames.
          </h2>
          <div className="mt-6 border-l-2 border-oxblood pl-4" role="status">
            {activeRoom ? (
              <>
                <h3 className="font-semibold">{activeRoom.name}</h3>
                <p>Floor {activeRoom.floor}</p>
              </>
            ) : (
              <p>
                {activeFloor
                  ? `Floor ${activeFloor} selected. Choose a room for details.`
                  : "Choose a room to see its location in the studio."}
              </p>
            )}
          </div>
          {activeRoom && (
            <a
              href={`#${sectionIds.studio}`}
              className="mt-2 inline-flex min-h-11 items-center text-oxblood underline underline-offset-4"
            >
              View in 3D
            </a>
          )}
        </div>
        <div className="grid items-start gap-6 sm:grid-cols-2">
          {floors.map((floor) => (
            <div key={floor}>
              <h3 className="border-b border-ink/25 pb-3 font-semibold">
                Floor {floor}
              </h3>
              <ul className="divide-y divide-ink/20">
                {rooms
                  .filter((room) => room.floor === floor)
                  .map((room) => (
                    <li key={room.id}>
                      <button
                        type="button"
                        aria-pressed={activeRoom?.id === room.id}
                        onClick={() => onSelect(room)}
                        className="min-h-11 w-full px-2 py-2 text-left hover:text-oxblood aria-pressed:bg-oxblood aria-pressed:text-paper"
                      >
                        {room.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
