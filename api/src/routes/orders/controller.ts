import e, { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "../../db/index.js";
import { ordersTable, orderItems } from "../../db/ordersSchema.js";
import { productsTable } from "../../db/productsSchema.js";

export async function list(req: Request, res: Response) {
  try {
    let orders;
    const orders_items = [];

    if (req.role?.toLowerCase() == "admin") {
      orders = await db
        .select()
        .from(ordersTable)
        .leftJoin(orderItems, eq(ordersTable.id, orderItems.orderId));
    } else if (req.role?.toLowerCase() == "seller") {
      orders = await db
        .select()
        .from(ordersTable)
        .leftJoin(
          orderItems,
          and(
            eq(ordersTable.id, orderItems.orderId),
            eq(orderItems.sellerId, Number(req.userId))
          )
        );
    } else if (req.role?.toLowerCase() == "user") {
      orders = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.userId, Number(req.userId)))
        .leftJoin(orderItems, eq(ordersTable.id, orderItems.orderId));
    } else {
      res.status(400).json({ message: "Invalid user role." });
      return;
    }

    if (orders?.length == 0) {
      res.status(404).json({
        message: "There are no orders that belong to the current user.",
      });
      return;
    }

    // WORK ON THIS TO MAKE IT ACCOUNT FOR MULTIPLE ORDERS
    // const mergedOrders = {
    //   ...orders[0].orders,
    //   items: orders?.map((oi) => oi.orderItems),
    // };

    const mergedOrders = [];

    for (const order in orders) {
      if (mergedOrders.length > 0) {
        for (const element in mergedOrders) {
          if (orders[order].orders.id != mergedOrders[element].order.id) {
            var found = false;
            var count = 0;
            while (!found && count < mergedOrders.length) {
              if (mergedOrders[count].order.id != orders[order].orders.id) {
              } else {
                found = true;
                console.log(mergedOrders[count]);
                mergedOrders[count].items?.push(orders[order].orderItems);
              }
              count++;
            }
            if (!found) {
              mergedOrders.push({
                order: orders[order].orders,
                items: [orders[order].orderItems],
              });
            }
            break;
          } else {
            mergedOrders[element].items?.push(orders[order].orderItems);
          }
        }
      } else {
        mergedOrders.push({
          order: orders[order].orders,
          items: [orders[order].orderItems],
        });
      }
    }

    res.status(200).json(mergedOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function details(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!order) {
      res
        .status(404)
        .json({ message: `The order with the ID ${id} does not exist.` });
    } else {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      res.status(200).json({ order, items });
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
    const newItems = [];
    const orders = [];

    const userId = req.userId;

    for (const item of items) {
      console.log(item);

      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));

      if (!product) {
      } else {
        item.price = product.price;
        item.sellerId = product.seller;
        newItems.push(item);
      }
    }

    if (newItems.length == 0) {
      res.status(404).json({ message: "None of the products were found." });
      return;
    }

    const [new_order] = await db
      .insert(ordersTable)
      .values({ userId: userId })
      .returning();

    const order_items = newItems.map((item: any) => ({
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
