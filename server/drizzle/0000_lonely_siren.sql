CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"question_index" integer NOT NULL,
	"selected_option" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"time_taken_seconds" integer NOT NULL,
	"bonus_points" integer DEFAULT 0,
	"points_earned" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"question_text" text NOT NULL,
	"option_a" varchar(500) NOT NULL,
	"option_b" varchar(500) NOT NULL,
	"option_c" varchar(500) NOT NULL,
	"option_d" varchar(500) NOT NULL,
	"correct_answer" integer NOT NULL,
	"explanation" text DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"duration_minutes" integer DEFAULT 20,
	"is_active" boolean DEFAULT false,
	"submission_deadline" timestamp,
	"leaderboard_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"department" varchar(100) NOT NULL,
	"year" varchar(50) NOT NULL,
	"total_score" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"wrong_count" integer DEFAULT 0,
	"accuracy" integer DEFAULT 0,
	"time_taken_seconds" integer DEFAULT 0,
	"completed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "submissions_quiz_email_idx" ON "submissions" USING btree ("quiz_id","email");--> statement-breakpoint
CREATE INDEX "submissions_quiz_uid_idx" ON "submissions" USING btree ("quiz_id","uid");--> statement-breakpoint
CREATE INDEX "submissions_leaderboard_idx" ON "submissions" USING btree ("quiz_id","total_score","time_taken_seconds");