"use client";

import { useState } from "react";
import { sectionIds } from "@/config/navigation";
import { StudioPreview } from "./studio-preview";
import { floors, type StudioRoom, type StudioSelection } from "../types/rooms";

export function StudioExploration({ rooms }: { rooms: StudioRoom[] }) {
  const [manual, setManual] = useState(false);
  const [selection, setSelection] = useState<StudioSelection>({
    kind: "building",
  });
  const activeRoom =
    selection.kind === "room"
      ? rooms.find((room) => room.id === selection.roomId)
      : undefined;
  const activeFloor =
    selection.kind === "floor" ? selection.floor : activeRoom?.floor;

  function choose(next: StudioSelection) {
    setManual(true);
    setSelection(next);
  }

  function selectRoom(room: StudioRoom) {
    choose({ kind: "room", roomId: room.id });
  }

  return (
    <section
      data-light-surface
      id={sectionIds.studio}
      aria-labelledby="preview-title"
      className="site-gutter mx-auto max-w-screen-2xl py-10 sm:py-16"
    >
      <div className="grid overflow-hidden border border-paper/20 bg-ink/65 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
        <div className="p-5 sm:p-8">
          <h2
            id="preview-title"
            className="font-display text-5xl font-bold uppercase"
          >
            Studio map
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            A conceptual model of the two-floor studio.
          </p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold">View</legend>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={selection.kind === "building"}
                onClick={() => choose({ kind: "building" })}
                className="min-h-11 border border-paper/25 px-3 text-sm hover:border-amber aria-pressed:border-amber aria-pressed:bg-amber aria-pressed:text-ink"
              >
                Whole building
              </button>
              {floors.map((floor) => (
                <button
                  key={floor}
                  type="button"
                  aria-pressed={activeFloor === floor}
                  onClick={() => choose({ kind: "floor", floor })}
                  className="min-h-11 border border-paper/25 px-3 text-sm hover:border-amber aria-pressed:border-amber aria-pressed:bg-amber aria-pressed:text-ink"
                >
                  Floor {floor}
                </button>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor="map-room"
            className="mt-5 block text-sm font-semibold"
          >
            Room on map
          </label>
          <select
            id="map-room"
            className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 text-sm text-paper scheme-dark hover:border-amber"
            value={activeRoom?.id ?? ""}
            onChange={(event) => {
              const room = rooms.find(
                ({ id }) => id === event.currentTarget.value,
              );
              if (room) selectRoom(room);
            }}
          >
            <option value="" disabled>
              Choose a room
            </option>
            {floors.map((floor) => (
              <optgroup key={floor} label={`Floor ${floor}`}>
                {rooms
                  .filter((room) => room.floor === floor)
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <p
            className="mt-4 text-sm text-muted"
            role="status"
            aria-label="Studio selection"
          >
            {activeRoom
              ? `${activeRoom.name} · Floor ${activeRoom.floor}`
              : activeFloor
                ? `Floor ${activeFloor}`
                : "Building overview"}
          </p>
        </div>
        <StudioPreview
          manual={manual}
          rooms={rooms}
          activeFloor={activeFloor}
          activeRoom={activeRoom}
          onSelect={selectRoom}
        />
      </div>
    </section>
  );
}
