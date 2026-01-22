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

export const hotelQueryParms = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().int().positive().min(0).max(5).optional(),
});
