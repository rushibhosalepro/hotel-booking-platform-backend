import { Router } from "express";
const router = Router();

router.post("/api/auth/signup", async (req, res) => {
  return res.json({ ok: "Hello" });
});
router.post(" /api/auth/login", async (req, res) => {
  return res.json({ ok: "Hello" });
});

export default router;
