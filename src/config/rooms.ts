export const roomNames = {
  kasir_l1: "Cashier",
  portrait_l1: "Hellden Portrait",
  cinema_l1: "Cinema",
  record_l1: "Record",
  express_l1: "Express",
  stairs_l1: "Stairs",
  waiting_l1: "Waiting area",
  diy_l1: "DIY photography area",
  beverage_l1: "Beverage area",
  self_photo_portrait_l2: "Self Photo Passport",
  operator_cashier_l2: "Operator / Cashier",
  diy_self_photo_l2: "DIY Self Photo Passport",
} as const;

export type RoomId = keyof typeof roomNames;
