"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type CSSProperties,
} from "react";
import { sectionIds } from "@/config/navigation";
import { floors } from "@/features/studio-anatomy/types/rooms";
import { ModelErrorBoundary } from "@/features/studio-anatomy/components/model-error-boundary";
import { RoomSession } from "./room-session";
import { roomPhotos } from "./room-photos";
import { RoomPhotoStack } from "./room-photo-stack";
import { entranceMotion } from "./entrance-motion";
import { tourChapterId, type WalkthroughStop } from "./walkthrough-stops";
import styles from "./studio-walkthrough.module.css";

const WalkthroughCanvas = dynamic(() => import("./walkthrough-canvas"), {
  ssr: false,
});

const entranceId = "tour-entrance";

const sessionPrices = new Map([
  ["portrait_l1", 35],
  ["cinema_l1", 40],
]);

function closeRoomMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

export function StudioWalkthrough({ stops }: { stops: WalkthroughStop[] }) {
  const tour = useRef<HTMLElement>(null);
  const entranceChapter = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable"
  >("idle");

  const requestScene = useCallback(() => {
    setStatus((current) => (current === "idle" ? "loading" : current));
  }, []);
  const markReady = useCallback(() => setStatus("ready"), []);
  const markUnavailable = useCallback(() => setStatus("unavailable"), []);

  useEffect(() => {
    if (status !== "idle") return;

    function loadOnTourScroll() {
      const bounds = tour.current?.getBoundingClientRect();
      if (
        bounds &&
        window.scrollY > 4 &&
        bounds.top < window.innerHeight &&
        bounds.bottom > window.innerHeight
      ) {
        requestScene();
      }
    }

    loadOnTourScroll();
    window.addEventListener("scroll", loadOnTourScroll, { passive: true });
    return () => window.removeEventListener("scroll", loadOnTourScroll);
  }, [requestScene, status]);

  useEffect(() => {
    const section = tour.current;
    const chapter = entranceChapter.current;
    if (!section || !chapter) return;
    let frame = 0;

    function syncEntrance() {
      if (!section || !chapter) return;
      frame = 0;
      const progress =
        -chapter.getBoundingClientRect().top / chapter.offsetHeight;
      const { angle, corridorOpacity } = entranceMotion(progress);
      section.style.setProperty("--door-angle", `${angle}deg`);
      section.style.setProperty("--corridor-opacity", String(corridorOpacity));
      section.dataset.entered = String(corridorOpacity >= 0.5);
    }

    function scheduleSync() {
      if (!frame) frame = requestAnimationFrame(syncEntrance);
    }

    syncEntrance();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const galleries = Array.from(
      tour.current?.querySelectorAll<HTMLElement>("[data-gallery-chapter]") ??
        [],
    ).flatMap((chapter) => {
      const layout = chapter.querySelector<HTMLElement>(
        "[data-gallery-layout]",
      );
      const photos = Array.from(
        chapter.querySelectorAll<HTMLElement>("[data-gallery-photo]"),
      );
      return layout && photos.length ? [{ chapter, layout, photos }] : [];
    });

    const updateGalleries = () => {
      for (const { chapter, layout, photos } of galleries) {
        const travelled = -chapter.getBoundingClientRect().top;
        const hold = chapter.offsetHeight - layout.offsetHeight;
        const visible =
          travelled >= -layout.offsetHeight * 0.1 && travelled <= hold;
        chapter.dataset.galleryVisible = String(visible);

        const step = Math.min(
          photos.length - 1,
          Math.max(0, Math.floor(travelled / (hold / photos.length || 1))),
        );
        const photo = (step + 1) % photos.length;
        const midpoint = Math.floor(photos.length / 2);
        photos.forEach((item, index) => {
          const position =
            ((index - photo + midpoint + photos.length) % photos.length) -
            midpoint;
          item.style.setProperty("--photo-offset", String(position));
          item.dataset.photoPosition =
            position === 0 ? "active" : position < 0 ? "above" : "below";
          const link = item.querySelector("a");
          if (link) link.tabIndex = position === 0 ? 0 : -1;
        });
      }
    };

    for (const { chapter } of galleries)
      chapter.dataset.galleryVisible = "false";
    updateGalleries();
    window.addEventListener("scroll", updateGalleries, { passive: true });
    window.addEventListener("resize", updateGalleries);
    return () => {
      window.removeEventListener("scroll", updateGalleries);
      window.removeEventListener("resize", updateGalleries);
      for (const { chapter, photos } of galleries) {
        delete chapter.dataset.galleryVisible;
        photos.forEach((item) => {
          item.style.removeProperty("--photo-offset");
          delete item.dataset.photoPosition;
          item.querySelector("a")?.removeAttribute("tabindex");
        });
      }
    };
  }, []);

  const firstStop = stops[0];
  const showCanvas = status === "loading" || status === "ready";

  return (
    <section
      id={sectionIds.tour}
      ref={tour}
      aria-labelledby="hero-title"
      className={styles.tour}
      data-light-surface="oxblood"
    >
      <div className={styles.stage}>
        <div className={styles.entrance} aria-hidden="true">
          <div className={styles.door}>
            <div className={styles.doorLeaf} data-testid="entrance-door-leaf" />
          </div>
        </div>
        {showCanvas && (
          <div
            className={styles.canvas}
            data-ready={status === "ready"}
            aria-hidden="true"
          >
            <ModelErrorBoundary onError={markUnavailable}>
              <WalkthroughCanvas
                tour={tour}
                stops={stops}
                onReady={markReady}
                onUnavailable={markUnavailable}
              />
            </ModelErrorBoundary>
          </div>
        )}
        <div className={styles.scrim} aria-hidden="true" />
        <details className={styles.roomMenu}>
          <summary>Choose a room</summary>
          <nav aria-label="Walkthrough stops">
            <a href={`#${entranceId}`} onClick={closeRoomMenu}>
              Entrance
            </a>
            {floors.map((floor) => (
              <div key={floor} className={styles.roomMenuGroup}>
                <p>Floor {floor}</p>
                {stops
                  .filter((room) => room.floor === floor)
                  .map((room) => (
                    <a
                      key={room.id}
                      href={`#${tourChapterId(room.id)}`}
                      onClick={(event) => {
                        requestScene();
                        closeRoomMenu(event);
                      }}
                    >
                      {room.name}
                    </a>
                  ))}
              </div>
            ))}
          </nav>
        </details>
        <p role="status" aria-label="Walkthrough view" className="sr-only">
          {status === "loading" && "Loading the studio walkthrough."}
          {status === "ready" && "Walkthrough view loaded."}
          {status === "unavailable" &&
            "3D is unavailable. Continue with the room guide."}
        </p>
      </div>

      <div className={styles.chapters}>
        <article
          data-tour-chapter
          id={entranceId}
          ref={entranceChapter}
          className={`${styles.chapter} ${styles.entranceChapter}`}
          tabIndex={-1}
        >
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Hellden Studio entrance</p>
            <h1 id="hero-title" className={styles.title}>
              <span className={styles.titlePrelude}>Enter the</span>{" "}
              <span className={styles.titleName}>Hellden Universe</span>
            </h1>
            <p className={styles.introText}>
              Scroll to open the door and explore the studio sets.
            </p>
            <div className={styles.entranceActions}>
              {firstStop && (
                <a
                  href={`#${tourChapterId(firstStop.id)}`}
                  className={styles.primary}
                  onClick={requestScene}
                >
                  Enter studio <span aria-hidden="true">↓</span>
                </a>
              )}
              <a href={`#${sectionIds.studio}`} className={styles.textLink}>
                Studio map
              </a>
            </div>
          </div>
        </article>

        {stops.map((room, index) => {
          const photos = roomPhotos[room.id];
          const sessionPrice = sessionPrices.get(room.id);
          const roomCard = (
            <div className={styles.roomCard}>
              <p className="mb-2 text-sm text-amber">Floor {room.floor}</p>
              <h2 className={styles.roomTitle}>
                {room.id === "cinema_l1" ? "Hellden Cinema" : room.name}
              </h2>
              {sessionPrice !== undefined && (
                <RoomSession price={sessionPrice} />
              )}
              <details className="mt-4">
                <summary className="min-h-11 cursor-pointer py-2 underline underline-offset-4">
                  Look around
                </summary>
                <p className="max-w-sm pb-4 text-paper">{room.detail}</p>
              </details>
              {room.id === "stairs_l1" ? (
                <a
                  className={styles.textLink}
                  href={`#${tourChapterId("diy_self_photo_l2")}`}
                >
                  Continue upstairs
                </a>
              ) : (
                <a className={styles.textLink} href={`#${sectionIds.gallery}`}>
                  See studio photos
                </a>
              )}
              {index === stops.length - 1 && (
                <a
                  className={`${styles.textLink} ml-4`}
                  href={`#${sectionIds.studio}`}
                >
                  Open studio map
                </a>
              )}
            </div>
          );
          return (
            <article
              key={room.id}
              id={tourChapterId(room.id)}
              className={photos ? styles.galleryChapter : styles.chapter}
              style={
                photos
                  ? ({ "--photo-count": photos.length } as CSSProperties)
                  : undefined
              }
              data-tour-chapter
              data-gallery-chapter={photos ? true : undefined}
              data-last-stop={index === stops.length - 1 || undefined}
              tabIndex={-1}
            >
              {photos ? (
                <div
                  className={`${styles.chapter} ${styles.galleryLayout}`}
                  data-gallery-layout
                >
                  {roomCard}
                  <aside
                    aria-label={`${room.name} gallery`}
                    className={styles.galleryPanel}
                  >
                    <RoomPhotoStack photos={photos} roomName={room.name} />
                  </aside>
                </div>
              ) : (
                roomCard
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
