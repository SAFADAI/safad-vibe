import { pgTable, text, serial, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const priceAlertsTable = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  productTitle: text("product_title").notNull(),
  targetPrice: numeric("target_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  platform: text("platform"),
  isTriggered: boolean("is_triggered").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlertsTable).omit({
  id: true,
  isTriggered: true,
  createdAt: true,
});

export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlertsTable.$inferSelect;
