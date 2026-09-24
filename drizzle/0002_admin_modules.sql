CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"time" text,
	"location" text NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"range" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"days" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board_members" ALTER COLUMN "sort_order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "photo" text;--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "quote" text;--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "values" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "board_members" ADD COLUMN "mottos" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "quote" text;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;