import { Router } from "express";
import { SearchHotelsBody, GetPopularDestinationsQueryParams } from "@workspace/api-zod";
import { db, searchHistoryTable } from "@workspace/db";

const router = Router();

const PROVIDERS = ["booking", "expedia", "agoda"] as const;

function makeHotel(id: string, destination: string, index: number) {
  const provider = PROVIDERS[index % PROVIDERS.length];
  const names = [
    "Grand Palace Hotel", "The Royal Suites", "Azure Boutique Hotel",
    "Sunrise Resort & Spa", "City Central Hotel", "Harbor View Inn",
    "Desert Pearl Hotel", "Mountain Escape Lodge", "Infinity Rooftop Hotel",
    "Old Town Boutique", "Sunset Beach Resort", "Skyline Tower Hotel",
  ];
  const amenitiesList = ["wifi", "pool", "breakfast", "gym", "spa", "parking", "restaurant", "bar"];
  const amenities = amenitiesList.slice(0, 3 + (index % 4));
  const price = 60 + index * 30 + Math.floor(Math.random() * 50);

  return {
    id,
    name: `${names[index % names.length]} ${destination}`,
    rating: 3 + Math.floor(Math.random() * 3),
    reviewScore: Math.round((7 + Math.random() * 3) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 3000) + 200,
    pricePerNight: price,
    currency: "USD",
    imageUrl: `https://picsum.photos/seed/${id}/600/400`,
    amenities,
    address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${destination}`,
    latitude: 25 + Math.random() * 20,
    longitude: 35 + Math.random() * 20,
    provider,
    affiliateUrl: `https://www.${provider === "booking" ? "booking.com" : provider === "expedia" ? "expedia.com" : "agoda.com"}/search?city=${encodeURIComponent(destination)}`,
    lastUpdated: new Date().toISOString(),
  };
}

router.post("/hotels/search", async (req, res) => {
  const parsed = SearchHotelsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { destination, providers: requestedProviders } = parsed.data;

  await db.insert(searchHistoryTable).values({ type: "hotels", query: destination, resultCount: 12 }).catch(() => {});

  const results = Array.from({ length: 12 }, (_, i) => makeHotel(`h${i}`, destination, i))
    .filter((h) => !requestedProviders || requestedProviders.includes(h.provider));

  res.json({
    results,
    totalCount: results.length,
    destination,
    checkIn: parsed.data.checkIn,
    checkOut: parsed.data.checkOut,
  });
});

router.get("/hotels/popular-destinations", async (req, res) => {
  const destinations = [
    { city: "Dubai", country: "UAE", imageUrl: "https://picsum.photos/seed/dubai/400/600", avgPricePerNight: 120, currency: "USD", rating: 4.7 },
    { city: "Paris", country: "France", imageUrl: "https://picsum.photos/seed/paris2/400/600", avgPricePerNight: 180, currency: "USD", rating: 4.8 },
    { city: "Bangkok", country: "Thailand", imageUrl: "https://picsum.photos/seed/bangkok2/400/600", avgPricePerNight: 55, currency: "USD", rating: 4.5 },
    { city: "Istanbul", country: "Turkey", imageUrl: "https://picsum.photos/seed/istanbul2/400/600", avgPricePerNight: 70, currency: "USD", rating: 4.6 },
    { city: "Barcelona", country: "Spain", imageUrl: "https://picsum.photos/seed/barcelona/400/600", avgPricePerNight: 130, currency: "USD", rating: 4.7 },
    { city: "Tokyo", country: "Japan", imageUrl: "https://picsum.photos/seed/tokyo2/400/600", avgPricePerNight: 110, currency: "USD", rating: 4.8 },
    { city: "New York", country: "USA", imageUrl: "https://picsum.photos/seed/newyork/400/600", avgPricePerNight: 220, currency: "USD", rating: 4.5 },
    { city: "Bali", country: "Indonesia", imageUrl: "https://picsum.photos/seed/bali/400/600", avgPricePerNight: 65, currency: "USD", rating: 4.7 },
  ];
  res.json({ destinations });
});

router.get("/hotels/deal-summary", async (_req, res) => {
  res.json({
    regions: [
      { region: "EU", topDeal: makeHotel("eu1", "Paris", 0), avgDiscount: 23 },
      { region: "ARAB", topDeal: makeHotel("ar1", "Dubai", 1), avgDiscount: 18 },
      { region: "ASIA", topDeal: makeHotel("as1", "Bangkok", 2), avgDiscount: 31 },
      { region: "US", topDeal: makeHotel("us1", "New York", 3), avgDiscount: 15 },
    ],
    lastUpdated: new Date().toISOString(),
  });
});

export default router;
