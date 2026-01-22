import { Router } from "express";

const router = Router();

router.post("/api/bookings", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.get("/api/bookings", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.put("/api/bookings/:bookingId/cancel", async (req, res) => {
  return res.json({ ok: "Hello" });
});

export default router;
