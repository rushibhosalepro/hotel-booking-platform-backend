import type { NextFunction, Request, Response } from "express";
import { errorObject } from "../constants";

import jwt from "jsonwebtoken";
const publicRoutes = ["/api/auth/"];
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isMatch = publicRoutes.some((path) => req.path.startsWith(path));

  if (isMatch) {
    return next();
  }
  const headers = req.headers.authorization;

  if (!headers) {
    return res
      .status(401)
      .json({ ...errorObject, error: "INVALID_CREDENTIALS" });
  }

  const [schema, token] = headers.split(" ");
  if (!schema || !token || schema !== "Bearer") {
    return res
      .status(401)
      .json({ ...errorObject, error: "INVALID_CREDENTIALS" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY!);
  } catch (error) {
    return res
      .status(401)
      .json({ ...errorObject, error: "INVALID_CREDENTIALS" });
  }
  const d = decoded as { id: string; role: string };
  req.userId = d.id;
  req.role = d.role;
  next();
};
