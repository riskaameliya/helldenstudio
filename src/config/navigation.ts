export const sectionIds = {
  studio: "studio-preview",
  tour: "studio-tour",
  gallery: "gallery",
  booking: "booking",
} as const;

export const navigation = [
  { label: "Tour", href: `/#${sectionIds.tour}` },
  { label: "Studio map", href: `/#${sectionIds.studio}` },
  { label: "Gallery", href: `/#${sectionIds.gallery}` },
  { label: "Booking", href: `/#${sectionIds.booking}` },
];
