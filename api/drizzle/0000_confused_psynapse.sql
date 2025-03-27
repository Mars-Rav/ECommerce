CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(255),
	"price" double precision NOT NULL,
	"quantity" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fullname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(255) DEFAULT 'user' NOT NULL,
	"address" text,
	"pfp" varchar(255),
	"dob" date,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_fullname_unique" UNIQUE("fullname"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
