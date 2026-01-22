import { Router } from "express";
import { userLoginSchema, userSingnupSchema } from "../schemas/userSchema";
import { ZodError } from "zod";
import { errorObject, sucessObject } from "../constants/index";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma/client";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/api/auth/signup", async (req, res) => {
  const body = req.body;

  try {
    userSingnupSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ...errorObject, error: "INVALID_REQUEST" });
    }
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }

  try {
    const { email, password, role, name, phone } = body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name,
        phone,
      },
    });

    if (role) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role,
        },
      });
    }
    const responseObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return res.json({
      ...sucessObject,
      data: responseObj,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ ...errorObject, error: "EMAIL_ALREADY_EXISTS" });
      }
    }
    return res
      .status(500)
      .json({ ...errorObject, error: "INTERNAL_SERVER_ERROR" });
  }
});
router.post("/api/auth/login", async (req, res) => {
  const body = req.body;
  try {
    userLoginSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ...errorObject, error: "INVALID_REQUEST" });
    }
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }

  try {
    const { email, password } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ ...errorObject, error: "USER_NOT_FOUND" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ ...errorObject, error: "INVALID_CREDENTIALS" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY!,
      { expiresIn: "1d" },
    );
    const responseObj = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return res.json({ ...sucessObject, data: responseObj });
  } catch (error) {
    return res.status(500).json({
      ...errorObject,
      error: "Internal server error",
    });
  }
});

export default router;
