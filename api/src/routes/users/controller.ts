import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { userTable } from "../../db/usersSchema";
import { db } from "../../db";

export async function list(req: Request, res: Response) {
  try {
    const users = await db.select().from(userTable);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function details(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));
    if (!user) {
      res.status(404).json({ message: `User with ID ${id} was not found` });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    req.cleanBody.password = await hash(req.cleanBody.password, 10);
    const [user] = await db.insert(userTable).values(req.cleanBody).returning();
    // @ts-ignore
    delete user.password;

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const email = req.cleanBody.email;
  const password = req.cleanBody.password;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    res.status(404).json({ message: "Email or password is incorrect." });
  } else {
    if (await compare(password, user.password)) {
      const { password: _, ...user_data } = user;
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        // @ts-ignore
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );
      res.status(200).json({
        message: "You have logged in successfully.",
        user: user_data,
        token,
      });
    } else {
      res.status(404).json({ message: "Email or password is incorrect." });
    }
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [user] = await db
      .update(userTable)
      .set(req.cleanBody)
      .where(eq(userTable.id, id))
      .returning();

    if (!user) {
      res.status(404).json({ message: `User with ID ${id} was not found.` });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [user] = await db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning();
    if (!user) {
      res.status(404).json({ message: `User with ID ${id} was not found.` });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
