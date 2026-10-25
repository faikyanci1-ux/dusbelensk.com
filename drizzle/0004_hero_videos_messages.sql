CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"caption" text NOT NULL,
	"focus" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"caption" text NOT NULL,
	"poster" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "request_type" text DEFAULT 'message' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "child_name" text;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "age_group" text;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "is_read" boolean DEFAULT false NOT NULL;