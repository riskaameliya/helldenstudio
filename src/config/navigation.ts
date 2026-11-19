export const sectionIds = {
  studio: "studio-preview",
  rooms: "rooms",
  gallery: "gallery",
  booking: "booking",
} as const;

export const navigation = [
  { label: "Studio", href: `/#${sectionIds.studio}` },
  { label: "Rooms", href: `/#${sectionIds.rooms}` },
  { label: "Gallery", href: `/#${sectionIds.gallery}` },
  { label: "Booking", href: `/#${sectionIds.booking}` },
];
