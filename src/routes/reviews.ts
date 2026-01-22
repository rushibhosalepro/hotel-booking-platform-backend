import { Router } from "express";

const router = Router();

router.post("/api/reviews", async (req, res) => {
  return res.json({ ok: "Hello" });
});

export default router;
