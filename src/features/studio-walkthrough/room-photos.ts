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

const recordPhotos = [
  {
    src: "/images/record/record-2.jpeg",
    alt: "Portrait of a guest on the sofa in the wood-paneled Record set",
    width: 922,
    height: 1336,
  },
  {
    src: "/images/record/record-1.jpeg",
    alt: "Guest on the leather sofa beside the Hellden Record vinyl display",
    width: 980,
    height: 1384,
  },
  {
    src: "/images/record/record-3.jpeg",
    alt: "Guest posing beside the record sleeves and turntable",
    width: 958,
    height: 1368,
  },
];

const expressPhotos = [
  {
    src: "/images/express/express-2.jpeg",
    alt: "Guest seated by the train window in the Express set",
    width: 940,
    height: 1384,
  },
  {
    src: "/images/express/express-1.jpeg",
    alt: "Guest holding a strap in the Hellden Express train set",
    width: 970,
    height: 1386,
  },

  {
    src: "/images/express/express-3.jpeg",
    alt: "Full-length portrait with the train window and overhead straps",
    width: 1010,
    height: 1390,
  },
];

const selfPhotoPassPhotos = [
  {
    src: "/images/self/self-1.jpeg",
    alt: "Blue Star Series layout with two strips of self portraits",
    width: 1078,
    height: 1408,
  },
  {
    src: "/images/self/self-2.jpeg",
    alt: "Side-by-side portraits with Rainbow and Blue Star backgrounds",
    width: 1036,
    height: 1330,
  },
  {
    src: "/images/self/self-3.jpeg",
    alt: "Four Rainbow self portraits arranged on a pink layout",
    width: 1044,
    height: 1364,
  },
];

const diyPassportPhotos = [
  {
    src: "/images/diy-passport/diy-pass-1.jpeg",
    alt: "Open DIY passport with a portrait and stamps beside craft supplies",
    width: 778,
    height: 1210,
  },
  {
    src: "/images/diy-passport/diy-pass-2.jpeg",
    alt: "Decorated DIY passport with a portrait, stickers, and colorful stamps",
    width: 748,
    height: 1214,
  },
  {
    src: "/images/diy-passport/diy-pass-3.jpeg",
    alt: "Self-photo passport on a work surface with stamping supplies",
    width: 802,
    height: 1226,
  },
];

export const roomPhotos: Partial<Record<RoomId, RoomPhoto[]>> = {
  portrait_l1: portraitPhotos,
  cinema_l1: cinemaPhotos,
  record_l1: recordPhotos,
  express_l1: expressPhotos,
  self_photo_portrait_l2: selfPhotoPassPhotos,
  diy_self_photo_l2: diyPassportPhotos,
};
