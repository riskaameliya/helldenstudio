"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { sectionIds } from "@/config/navigation";
import { floors } from "@/features/studio-anatomy/types/rooms";
import { ModelErrorBoundary } from "@/features/studio-anatomy/components/model-error-boundary";
import { entranceMotion } from "./entrance-motion";
import { tourChapterId, type WalkthroughStop } from "./walkthrough-stops";
import styles from "./studio-walkthrough.module.css";

const WalkthroughCanvas = dynamic(() => import("./walkthrough-canvas"), {
  ssr: false,
});

const entranceId = "tour-entrance";

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

    if (window.location.hash.startsWith("#tour-")) loadOnTourScroll();
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

        {stops.map((room, index) => (
          <article
            key={room.id}
            id={tourChapterId(room.id)}
            className={styles.chapter}
            data-last-stop={index === stops.length - 1 || undefined}
            tabIndex={-1}
          >
            <div className={styles.roomCard}>
              <p className="mb-2 text-sm text-amber">Floor {room.floor}</p>
              <h2 className={styles.roomTitle}>{room.name}</h2>
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
          </article>
        ))}
      </div>
    </section>
  );
}
