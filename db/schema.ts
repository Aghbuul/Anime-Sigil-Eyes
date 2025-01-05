import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const processedImages = pgTable("processed_images", {
  id: serial("id").primaryKey(),
  originalImage: text("original_image").notNull(),
  processedImage: text("processed_image").notNull(),
  eyeCoordinates: jsonb("eye_coordinates").notNull(),
  sigilSize: integer("sigil_size").notNull(),
  leftEyeEnabled: boolean("left_eye_enabled").notNull().default(true),
  rightEyeEnabled: boolean("right_eye_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertImageSchema = createInsertSchema(processedImages);
export const selectImageSchema = createSelectSchema(processedImages);
export type InsertImage = typeof processedImages.$inferInsert;
export type SelectImage = typeof processedImages.$inferSelect;