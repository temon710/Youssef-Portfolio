import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const adminData = pgTable("admin_data", {
  id: serial("id").primaryKey(),
  bioAr: text("bio_ar").notNull(),
  bioEn: text("bio_en").notNull(),
  phone: varchar("phone").notNull(),
  profileImage: text("profile_image").notNull(),
  adminPassword: varchar("admin_password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  titleAr: varchar("title_ar").notNull(),
  titleEn: varchar("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  categoryAr: varchar("category_ar").notNull(),
  categoryEn: varchar("category_en").notNull(),
  images: text("images").array().notNull(),
});

export const insertAdminDataSchema = createInsertSchema(adminData).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });

export type AdminData = typeof adminData.$inferSelect;
export type InsertAdminData = z.infer<typeof insertAdminDataSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
