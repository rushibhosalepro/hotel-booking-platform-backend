import { Router } from "express";
const router = Router();

router.post("/api/hotels", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.get("/api/hotels", async (req, res) => {
  return res.json({ ok: "Hello" });
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
router.post("/api/hotels/:hotelId/rooms", async (req, res) => {
  return res.json({ ok: "Hello" });
});

export default router;
