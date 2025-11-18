import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const productTable = pgTable("product", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").$type<string | null>().default(null),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("VND").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 1024 }).notNull(),
  url: text("url").$type<string | null>().default(null),
  alt: varchar("alt", { length: 255 }).$type<string | null>().default(null),
  mime: varchar("mime", { length: 100 }).$type<string | null>().default(null),
  ordering: integer("ordering").default(0).notNull(),
  is_primary: boolean("is_primary").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
