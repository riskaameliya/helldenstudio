"use client";

import { useState } from "react";
import { sectionIds } from "@/config/navigation";
import { StudioPreview } from "./studio-preview";
import { RoomIndex } from "@/features/room-experience/room-index";
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

  function selectRoom(room: StudioRoom) {
    setManual(true);
    setSelection({ kind: "room", roomId: room.id });
  }

  return (
    <>
      <section
        data-light-surface
        id={sectionIds.studio}
        aria-labelledby="preview-title"
        className="site-gutter mx-auto max-w-screen-2xl border-t border-paper/25 py-14 sm:py-20"
      >
        <h2
          id="preview-title"
          className="font-display text-5xl font-bold uppercase sm:text-6xl"
        >
          Studio preview
        </h2>
        <p className="mt-3 text-muted">
          A conceptual model of the two-floor studio.
        </p>
        <fieldset className="mt-6">
          <legend className="mb-3 text-muted">Explore the studio</legend>
          <div className="flex flex-wrap gap-3">
            {floors.map((floor) => (
              <button
                key={floor}
                type="button"
                aria-pressed={activeFloor === floor}
                onClick={() => {
                  setManual(true);
                  setSelection({ kind: "floor", floor });
                }}
                className="min-h-11 border border-paper/40 px-4 hover:border-amber aria-pressed:bg-amber aria-pressed:text-ink"
              >
                Floor {floor}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setManual(true);
                setSelection({ kind: "building" });
              }}
              className="min-h-11 border border-paper/40 px-4 hover:border-amber"
            >
              Back to building
            </button>
            <a
              href={`#${sectionIds.rooms}`}
              className="inline-flex min-h-11 items-center px-2 text-amber underline underline-offset-4"
            >
              Browse rooms
            </a>
          </div>
          <p
            className="mt-3 text-muted"
            role="status"
            aria-label="Studio selection"
          >
            {activeRoom?.name ??
              (activeFloor ? `Floor ${activeFloor}` : "Building overview")}
          </p>
        </fieldset>
        <StudioPreview
          manual={manual}
          rooms={rooms}
          activeFloor={activeFloor}
          activeRoom={activeRoom}
          onSelect={selectRoom}
        />
      </section>
      <RoomIndex
        rooms={rooms}
        activeFloor={activeFloor}
        activeRoom={activeRoom}
        onSelect={selectRoom}
      />
    </>
  );
}
