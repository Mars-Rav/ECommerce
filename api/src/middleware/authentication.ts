import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Access denied." });
    return;
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // @ts-ignore
    if (typeof decoded != "object" || !decoded.userId) {
      res.status(401).json({ message: "Access denied." });
      return;
    }

    // @ts-ignore
    req.userId = decoded.userId;
    // @ts-ignore
    req.role = decoded.role;
    next();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
}

export function authenticateRole(role: string) {
  role = role.toLowerCase();
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      if (req.role?.toLowerCase() != role) {
        res
          .status(401)
          .json({ message: `Access denied. You are not a ${role}.` });
        return;
      }

      next();
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Internal server error: ${error.message}` });
    }
  };
}
