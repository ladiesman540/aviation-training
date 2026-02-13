ALTER TABLE "questions" ADD COLUMN "phase" text DEFAULT 'enroute' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "flight_context" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "explanation" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "risk_points" integer DEFAULT 1 NOT NULL;