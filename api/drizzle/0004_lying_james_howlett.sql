ALTER TABLE "orders" DROP CONSTRAINT "orders_sellerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItems" ADD COLUMN "sellerId" integer;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "sellerId";