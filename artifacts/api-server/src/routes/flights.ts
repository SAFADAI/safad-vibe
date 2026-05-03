import { Router } from "express";
import { SearchFlightsBody, GetFlightPriceCalendarQueryParams, GetPopularRoutesQueryParams } from "@workspace/api-zod";
import { db, searchHistoryTable } from "@workspace/db";

const router = Router();

const AIRLINES = [
  { name: "Emirates", code: "EK" },
  { name: "Qatar Airways", code: "QR" },
  { name: "British Airways", code: "BA" },
  { name: "Lufthansa", code: "LH" },
  { name: "Air France", code: "AF" },
  { name: "Turkish Airlines", code: "TK" },
];
const PROVIDERS = ["amadeus", "skyscanner", "kiwi"] as const;

function makeFlight(
  id: string,
  origin: string,
  destination: string,
  departureDate: string,
  cabinClass: string
) {
  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
  const depHour = 6 + Math.floor(Math.random() * 16);
  const durationHours = 2 + Math.floor(Math.random() * 12);
  const arrHour = (depHour + durationHours) % 24;
  const basePrice = cabinClass === "business" ? 1200 : cabinClass === "first" ? 3500 : 180;
  const price = basePrice + Math.floor(Math.random() * 400);

  return {
    id,
    airline: airline.name,
    airlineCode: airline.code,
    flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
    origin,
    destination,
    departureTime: `${departureDate}T${String(depHour).padStart(2, "0")}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}:00Z`,
    arrivalTime: `${departureDate}T${String(arrHour).padStart(2, "0")}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}:00Z`,
    duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
    stops: Math.floor(Math.random() * 2),
    price,
    currency: "USD",
    cabinClass,
    baggageIncluded: price > 300,
    affiliateUrl: `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/`,
    provider,
    lastUpdated: new Date().toISOString(),
  };
}

router.post("/flights/search", async (req, res) => {
  const parsed = SearchFlightsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { origin, destination, departureDate, cabinClass = "economy" } = parsed.data;

  await db.insert(searchHistoryTable).values({
    type: "flights",
    query: `${origin} → ${destination}`,
    resultCount: 10,
  }).catch(() => {});

  const results = Array.from({ length: 10 }, (_, i) =>
    makeFlight(`f${i}`, origin, destination, departureDate, cabinClass)
  ).sort((a, b) => a.price - b.price);

  res.json({ results, totalCount: results.length, origin, destination });
});

router.get("/flights/price-calendar", async (req, res) => {
  const parsed = GetFlightPriceCalendarQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { origin, destination, month } = parsed.data;

  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const basePrice = 150 + Math.floor(Math.random() * 200);

  const prices = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const fluctuation = Math.floor(Math.random() * 100) - 50;
    const available = Math.random() > 0.1;
    return { date, price: Math.max(80, basePrice + fluctuation), currency: "USD", available };
  });

  res.json({ origin, destination, month, prices });
});

router.get("/flights/popular-routes", async (req, res) => {
  const routes = [
    { origin: "DXB", originCity: "Dubai", destination: "LHR", destinationCity: "London", lowestPrice: 350, currency: "USD", imageUrl: "https://picsum.photos/seed/london/400/300" },
    { origin: "JFK", originCity: "New York", destination: "CDG", destinationCity: "Paris", lowestPrice: 420, currency: "USD", imageUrl: "https://picsum.photos/seed/paris/400/300" },
    { origin: "SIN", originCity: "Singapore", destination: "SYD", destinationCity: "Sydney", lowestPrice: 280, currency: "USD", imageUrl: "https://picsum.photos/seed/sydney/400/300" },
    { origin: "AMS", originCity: "Amsterdam", destination: "BKK", destinationCity: "Bangkok", lowestPrice: 320, currency: "USD", imageUrl: "https://picsum.photos/seed/bangkok/400/300" },
    { origin: "CAI", originCity: "Cairo", destination: "IST", destinationCity: "Istanbul", lowestPrice: 180, currency: "USD", imageUrl: "https://picsum.photos/seed/istanbul/400/300" },
    { origin: "LAX", originCity: "Los Angeles", destination: "NRT", destinationCity: "Tokyo", lowestPrice: 550, currency: "USD", imageUrl: "https://picsum.photos/seed/tokyo/400/300" },
  ];
  res.json({ routes });
});

export default router;
