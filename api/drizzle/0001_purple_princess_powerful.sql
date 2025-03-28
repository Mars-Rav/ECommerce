ALTER TABLE "orders" DROP CONSTRAINT "orders_orderItem_orderItems_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "orderItem";