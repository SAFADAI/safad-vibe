import { Router } from "express";
import { GetSearchHistoryQueryParams } from "@workspace/api-zod";
import { db, searchHistoryTable } from "@workspace/db";
import { desc, eq, count, sql } from "drizzle-orm";

const router = Router();

router.get("/search/history", async (req, res) => {
  const parsed = GetSearchHistoryQueryParams.safeParse(req.query);
  const type = parsed.data?.type ?? "all";
  const limit = parsed.data?.limit ?? 10;

  const query = db.select().from(searchHistoryTable).orderBy(desc(searchHistoryTable.createdAt)).limit(limit);
  let rows;
  if (type !== "all") {
    rows = await db.select().from(searchHistoryTable)
      .where(eq(searchHistoryTable.type, type as "products" | "flights" | "hotels"))
      .orderBy(desc(searchHistoryTable.createdAt))
      .limit(limit);
  } else {
    rows = await query;
  }

  const items = rows.map((r) => ({
    id: String(r.id),
    type: r.type,
    query: r.query,
    createdAt: r.createdAt.toISOString(),
    resultCount: r.resultCount,
  }));

  res.json({ items, total: items.length });
});

router.get("/search/stats", async (_req, res) => {
  const [totals] = await db.select({
    total: count(),
    products: sql<number>`SUM(CASE WHEN type = 'products' THEN 1 ELSE 0 END)::int`,
    flights: sql<number>`SUM(CASE WHEN type = 'flights' THEN 1 ELSE 0 END)::int`,
    hotels: sql<number>`SUM(CASE WHEN type = 'hotels' THEN 1 ELSE 0 END)::int`,
  }).from(searchHistoryTable);

  const productRows = await db.select({ query: searchHistoryTable.query, cnt: count() })
    .from(searchHistoryTable)
    .where(eq(searchHistoryTable.type, "products"))
    .groupBy(searchHistoryTable.query)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  const flightRows = await db.select({ query: searchHistoryTable.query, cnt: count() })
    .from(searchHistoryTable)
    .where(eq(searchHistoryTable.type, "flights"))
    .groupBy(searchHistoryTable.query)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  const hotelRows = await db.select({ query: searchHistoryTable.query, cnt: count() })
    .from(searchHistoryTable)
    .where(eq(searchHistoryTable.type, "hotels"))
    .groupBy(searchHistoryTable.query)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  res.json({
    totalSearches: totals.total ?? 0,
    productSearches: totals.products ?? 0,
    flightSearches: totals.flights ?? 0,
    hotelSearches: totals.hotels ?? 0,
    topProductQueries: productRows.map((r) => ({ query: r.query, count: Number(r.cnt) })),
    topFlightRoutes: flightRows.map((r) => ({ route: r.query, count: Number(r.cnt) })),
    topHotelDestinations: hotelRows.map((r) => ({ destination: r.query, count: Number(r.cnt) })),
  });
});

export default router;
