import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  uuid,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  name: text("name").notNull(),
});

export const questions = pgTable("questions", {
  id: text("id").primaryKey(),
  sectionId: integer("section_id")
    .notNull()
    .references(() => sections.id),
  stem: text("stem").notNull(),
  option1: text("option_1").notNull(),
  option2: text("option_2").notNull(),
  option3: text("option_3").notNull(),
  option4: text("option_4").notNull(),
  correctOption: integer("correct_option").notNull(),
  // Game layer fields
  phase: text("phase").notNull().default("enroute"), // preflight | taxi_depart | enroute | arrival
  flightContext: text("flight_context").notNull().default(""),
  explanation: text("explanation").notNull().default(""),
  isCritical: boolean("is_critical").default(false),
  riskPoints: integer("risk_points").notNull().default(1), // 1-3
});

export const questionReferences = pgTable("question_references", {
  id: serial("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  referenceText: text("reference_text").notNull(),
  canonicalUrl: text("canonical_url"),
});

export const docMetadata = pgTable("doc_metadata", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  edition: text("edition").notNull(),
  date: text("date").notNull(),
  sha256Hash: text("sha256_hash"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userMastery = pgTable(
  "user_mastery",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    timesSeen: integer("times_seen").default(0),
    timesCorrect: integer("times_correct").default(0),
    lastSeenAt: timestamp("last_seen_at"),
    nextDueAt: timestamp("next_due_at"),
    easeFactor: real("ease_factor").default(2.5),
    intervalDays: integer("interval_days").default(0),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.questionId] }) })
);

export const hopSessions = pgTable("hop_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  aircraft: text("aircraft"),
  missionType: text("mission_type"),
  instructorMode: boolean("instructor_mode").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  totalCards: integer("total_cards"),
  correctCount: integer("correct_count"),
  bustReason: text("bust_reason"),
  phaseAtEnd: text("phase_at_end"),
});

export const hopResponses = pgTable("hop_responses", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => hopSessions.id),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  cardIndex: integer("card_index").notNull(),
  selectedOption: integer("selected_option").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  respondedAt: timestamp("responded_at").defaultNow(),
  phase: text("phase"),
});

export const simSessions = pgTable("sim_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  score: integer("score"),
  total: integer("total"),
});

export const simResponses = pgTable("sim_responses", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => simSessions.id),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  selectedOption: integer("selected_option").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});
