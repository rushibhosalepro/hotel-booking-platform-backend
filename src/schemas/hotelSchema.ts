import z from "zod";

export const hotelSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  city: z.string(),
  country: z.string(),
  amenities: z.array(z.string()),
});

export const roomSchema = z.object({
  roomNumber: z.string(),
  roomType: z.string(),
  pricePerNight: z.int(),
  maxOccupancy: z.int(),
});
