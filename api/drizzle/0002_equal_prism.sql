ALTER TABLE "orders" ADD COLUMN "sellerId" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;