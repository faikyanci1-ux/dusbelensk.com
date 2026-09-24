ALTER TABLE "news_items" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "tag" text;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;