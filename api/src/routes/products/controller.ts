import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { productsTable } from "../../db/productsSchema.js";

export async function list(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.status(200).json(products);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}

export async function details(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ message: `Product ${id} was not found.` });
    } else {
      res.status(200).json(product);
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}

export async function create(req: Request, res: Response) {
  try {
    req.cleanBody.seller = Number(req.userId);
    const [product] = await db
      .insert(productsTable)
      .values(req.cleanBody as any)
      .returning();

    res.status(201).json(product);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [product] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (!product) {
      res.status(404).json({ message: `Product ${id} was not found.` });
    } else {
      res.status(200).json(product);
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [product] = await db
      .update(productsTable)
      .set(req.cleanBody)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ message: `Product ${id} was not found.` });
    } else {
      res.status(200).json(product);
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
