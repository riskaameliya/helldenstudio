import type { RoomId } from "@/config/rooms";

export type RoomPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

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

const cinemaPhotos = [
  {
    src: "/images/cinema/cinema-2.jpeg",
    alt: "Guest posing with popcorn and glasses in the red cinema seats",
    width: 946,
    height: 1354,
  },
  {
    src: "/images/cinema/cinema-1.jpeg",
    alt: "Hellden Cinema portrait with a clapperboard in the red seats",
    width: 972,
    height: 1372,
  },
  {
    src: "/images/cinema/cinema-3.jpeg",
    alt: "Guest reaching toward the camera in the cinema set",
    width: 998,
    height: 1452,
  },
];

export const roomPhotos: Partial<Record<RoomId, RoomPhoto[]>> = {
  portrait_l1: portraitPhotos,
  cinema_l1: cinemaPhotos,
};
