CREATE TABLE "board_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_type" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"size" text
);
--> statement-breakpoint
CREATE TABLE "lineup_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" text NOT NULL,
	"player" text NOT NULL,
	"number" integer NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"summary" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"birth_year" integer NOT NULL,
	"jersey_number" integer NOT NULL,
	"is_placeholder" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"description" text NOT NULL,
	"photo" text NOT NULL
);
