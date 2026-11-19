import Image from "next/image";
import type { RoomPhoto } from "./room-photos";
import styles from "./studio-walkthrough.module.css";

export function RoomPhotoStack({
  photos,
  roomName,
}: {
  photos: RoomPhoto[];
  roomName: string;
}) {
  return (
    <>
      <ul aria-label={`${roomName} examples`} className={styles.photoStack}>
        {photos.map(({ src, alt, width, height }) => (
          <li key={src} data-gallery-photo>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg bg-ink"
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 768px) 252px, 384px"
                className="aspect-[3/4] w-full object-cover"
              />
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.photoHint}>Scroll through the photos</p>
    </>
  );
}
