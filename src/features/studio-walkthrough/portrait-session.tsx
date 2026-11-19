import Image from "next/image";
import styles from "./studio-walkthrough.module.css";

const portraitPhotos = [
  {
    src: "/images/potrait/potrait-2.jpeg",
    alt: "Two guests posing together in sunglasses",
    width: 1014,
    height: 1348,
  },
  {
    src: "/images/potrait/potrait-1.jpeg",
    alt: "Hellden Portrait print layout with black-and-white photo strips",
    width: 1066,
    height: 1444,
  },

  {
    src: "/images/potrait/potrait-3.jpeg",
    alt: "Black-and-white portrait against a textured backdrop",
    width: 1006,
    height: 1312,
  },
];

export const portraitPhotoCount = portraitPhotos.length;

const inclusions = [
  "No mirror",
  "2 photo strips",
  "Unlimited retakes",
  "All soft files included",
];

export function PortraitGallery() {
  return (
    <>
      <ul aria-label="Hellden Portrait examples" className={styles.photoStack}>
        {portraitPhotos.map(({ src, alt, width, height }) => (
          <li key={src} data-portrait-photo>
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
                sizes="(max-width: 768px) 168px, 384px"
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

export function PortraitSession() {
  return (
    <div className="mt-4 border-t border-paper/25 pt-4">
      <p className="text-lg font-semibold text-amber">35k/session</p>
      <ul
        aria-label="Session inclusions"
        className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs leading-relaxed uppercase"
      >
        {inclusions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted">Photo, GIF &amp; Live Photo</p>
    </div>
  );
}
