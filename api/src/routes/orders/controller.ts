import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "../../db/index.js";
import { ordersTable, orderItems } from "../../db/ordersSchema.js";
import { productsTable } from "../../db/productsSchema.js";

export async function list(req: Request, res: Response) {
  try {
    const users = await db.select().from(ordersTable);
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
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!user) {
      res
        .status(404)
        .json({ message: `The user with the ID ${id} does not exist.` });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(400).json({ message: "Invalid order data." });
      return;
    }

    const { order, items } = req.cleanBody;

    const userId = req.userId;
    const [new_order] = await db
      .insert(ordersTable)
      .values({ userId: userId })
      .returning();

    for (const item of items) {
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));

      if (!product) {
        const index = items.indexOf(item);
        items.splice(index, 1);
      } else {
        item.price = product.price;
      }
    }

    const order_items = items.map((item: any) => ({
      ...item,
      orderId: new_order.id,
    }));

    const new_order_items = await db
      .insert(orderItems)
      .values(order_items)
      .returning();

    res.status(200).json({ order: new_order.id, items: new_order_items });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [order] = await db
      .update(ordersTable)
      .set(req.cleanBody)
      .where(eq(ordersTable.id, id))
      .returning();

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [order] = await db
      .delete(ordersTable)
      .where(eq(ordersTable.id, id))
      .returning();
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
