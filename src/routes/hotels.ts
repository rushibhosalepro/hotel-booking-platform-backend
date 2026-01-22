import { Router } from "express";
import { errorObject, sucessObject } from "../constants";
import {
  hotelQueryParms,
  hotelSchema,
  roomSchema,
} from "../schemas/hotelSchema";
import { ZodError } from "zod";
import prisma from "../lib/prisma";
const router = Router();

router.post("/api/hotels", async (req, res) => {
  const { userId, role } = req;
  if (!role || role !== "owner") {
    return res.status(403).json({ ...errorObject, error: "FORBIDDEN" });
  }

  const body = req.body;

  try {
    hotelSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ...errorObject, error: "INVALID_REQUEST" });
    }
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
  const { name, description, amenities, city, country } = body;

  try {
    const hotel = await prisma.hotel.create({
      data: {
        name,
        description,
        amenities,
        city,
        country,
        owner_id: userId,
      },
    });
    const responseObj = {
      id: hotel.id,
      ownerId: hotel.owner_id,
      name: hotel.name,
      description: hotel.description,
      city: hotel.city,
      country: hotel.country,
      amenities: hotel.amenities,
      rating: hotel.rating,
      totalReviews: hotel.total_reviews,
    };
    return res.status(201).json({ ...sucessObject, data: responseObj });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
});
router.post("/api/hotels/:hotelId/rooms", async (req, res) => {
  const { userId, role } = req;
  if (!role || role !== "owner") {
    return res.status(403).json({ ...errorObject, error: "FORBIDDEN" });
  }

  const body = req.body;

  try {
    roomSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ...errorObject, error: "INVALID_REQUEST" });
    }
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }

  const { roomNumber, roomType, pricePerNight, maxOccupancy } = body;

  const { hotelId } = req.params;
  try {
    const hotel = await prisma.hotel.findFirst({
      where: { id: hotelId },
    });
    if (!hotel) {
      return res.status(404).json({ ...errorObject, error: "HOTEL_NOT_FOUND" });
    }
    if (hotel.owner_id !== userId) {
      return res.status(403).json({ ...errorObject, error: "FORBIDDEN" });
    }

    const exissting = await prisma.room.findFirst({
      where: {
        hotel_id: hotel.id,
        room_number: roomNumber,
      },
    });
    if (exissting) {
      return res
        .status(400)
        .json({ ...errorObject, error: "ROOM_ALREADY_EXISTS" });
    }

    const room = await prisma.room.create({
      data: {
        hotel_id: hotel.id,
        room_number: roomNumber,
        max_occupancy: maxOccupancy,
        price_per_night: pricePerNight,
        room_type: roomType,
      },
    });
    const responseObj = {
      id: room.id,
      hotelId: room.hotel_id,
      roomNumber: room.room_number,
      roomType: room.room_type,
      pricePerNight: room.price_per_night,
      maxOccupancy: room.max_occupancy,
    };
    return res.status(201).json({ ...sucessObject, data: responseObj });
  } catch (error) {
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
});

router.get("/api/hotels", async (req, res) => {
  try {
    hotelQueryParms.parse(req.query);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ...errorObject, error: "INVALID_REQUEST" });
    }
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
  const city = req.query.city?.toString() ?? undefined;
  const country = req.query.country?.toString() ?? undefined;
  const rating = Number(req.query.minRating);
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice) ?? undefined;
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        ...(country ? { country } : {}),
        ...(city ? { city } : {}),
        ...(rating ? { rating: { gte: rating } } : {}),
      },
      include: {
        rooms: {
          where: {
            price_per_night: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {}),
            },
          },
        },
      },
    });

    const responseObj = hotels.map((h) => {
      return {
        id: h.id,
        name: h.name,
        description: h.description,
        city: h.city,
        country: h.country,
        amenities: h.amenities,
        rating: h.rating,
        totalReviews: h.total_reviews,
        minPricePerNight: h.rooms.reduce((accumulator, currentRoom) => {
          if (currentRoom.price_per_night < accumulator) {
            return currentRoom.price_per_night;
          }
          return accumulator;
        }, h.rooms[0]?.price_per_night ?? 0),
      };
    });
    return res.json({ ...sucessObject, data: responseObj });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
});
router.get("/api/hotels/:hotelId", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.post("/api/bookings", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.get("/api/bookings", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.put("/api/bookings/:bookingId/cancel", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.post("/api/reviews", async (req, res) => {
  return res.json({ ok: "Hello" });
});

export default router;
