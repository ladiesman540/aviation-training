CREATE TABLE IF NOT EXISTS "doc_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"edition" text NOT NULL,
	"date" text NOT NULL,
	"sha256_hash" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hop_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"card_index" integer NOT NULL,
	"selected_option" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"responded_at" timestamp DEFAULT now(),
	"phase" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hop_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"aircraft" text,
	"mission_type" text,
	"instructor_mode" boolean DEFAULT false,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"total_cards" integer,
	"correct_count" integer,
	"bust_reason" text,
	"phase_at_end" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"reference_text" text NOT NULL,
	"canonical_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"stem" text NOT NULL,
	"option_1" text NOT NULL,
	"option_2" text NOT NULL,
	"option_3" text NOT NULL,
	"option_4" text NOT NULL,
	"correct_option" integer NOT NULL,
	"is_critical" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sim_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"selected_option" integer NOT NULL,
	"is_correct" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sim_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"score" integer,
	"total" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_mastery" (
	"user_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"times_seen" integer DEFAULT 0,
	"times_correct" integer DEFAULT 0,
	"last_seen_at" timestamp,
	"next_due_at" timestamp,
	"ease_factor" real DEFAULT 2.5,
	"interval_days" integer DEFAULT 0,
	CONSTRAINT "user_mastery_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hop_responses" ADD CONSTRAINT "hop_responses_session_id_hop_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "hop_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hop_responses" ADD CONSTRAINT "hop_responses_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hop_sessions" ADD CONSTRAINT "hop_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_references" ADD CONSTRAINT "question_references_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sim_responses" ADD CONSTRAINT "sim_responses_session_id_sim_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "sim_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sim_responses" ADD CONSTRAINT "sim_responses_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sim_sessions" ADD CONSTRAINT "sim_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_mastery" ADD CONSTRAINT "user_mastery_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_mastery" ADD CONSTRAINT "user_mastery_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
