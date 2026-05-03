import { useState } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Clock, ArrowRight, ExternalLink, Luggage, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useSearchFlights,
  useGetPopularRoutes,
  getGetPopularRoutesQueryKey,
  useGetFlightPriceCalendar,
  getGetFlightPriceCalendarQueryKey,
} from "@workspace/api-client-react";

const TRIP_TYPES = ["one-way", "round-trip", "multi-city"] as const;
const CABIN_CLASSES = ["economy", "premium_economy", "business", "first"] as const;
const CABIN_LABELS: Record<string, string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class",
};
const PROVIDER_COLORS: Record<string, string> = {
  amadeus: "bg-sky-500",
  skyscanner: "bg-cyan-500",
  kiwi: "bg-green-500",
};
const PROVIDER_LABELS: Record<string, string> = {
  amadeus: "Amadeus",
  skyscanner: "Skyscanner",
  kiwi: "Kiwi.com",
};

export default function Flights() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("one-way");
  const [origin, setOrigin] = useState(params.get("origin") ?? "");
  const [destination, setDestination] = useState(params.get("dest") ?? "");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [cabinClass, setCabinClass] = useState<"economy" | "premium_economy" | "business" | "first">("economy");
  const [hasSearched, setHasSearched] = useState(false);

  const { mutate: searchFlights, data: flightResults, isPending: searching, reset } = useSearchFlights();

  const { data: popularRoutes } = useGetPopularRoutes(
    { region: "GLOBAL" },
    { query: { queryKey: getGetPopularRoutesQueryKey({ region: "GLOBAL" }) } }
  );

  const calendarEnabled = !!(origin && destination && departureDate && hasSearched);
  const calendarMonth = departureDate ? departureDate.slice(0, 7) : "";
  const { data: priceCalendar } = useGetFlightPriceCalendar(
    { origin, destination, month: calendarMonth, tripType },
    {
      query: {
        enabled: calendarEnabled,
        queryKey: getGetFlightPriceCalendarQueryKey({ origin, destination, month: calendarMonth, tripType }),
      },
    }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;
    setHasSearched(true);
    searchFlights({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults: parseInt(adults, 10),
      cabinClass,
    });
  }

  const results = flightResults?.results ?? [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">Flight Search</h1>
          <p className="text-white/70 mb-6">Compare flights from Amadeus, Skyscanner, and Kiwi — all in one search.</p>

          {/* Trip Type Toggle */}
          <div className="flex gap-1 bg-white/10 rounded-xl p-1 mb-5 w-fit">
            {TRIP_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  tripType === t ? "bg-white text-blue-700 shadow" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              placeholder="From (e.g. DXB)"
              maxLength={3}
              className="h-12 bg-white text-gray-900 border-0 rounded-xl font-mono uppercase"
            />
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              placeholder="To (e.g. LHR)"
              maxLength={3}
              className="h-12 bg-white text-gray-900 border-0 rounded-xl font-mono uppercase"
            />
            <Input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="h-12 bg-white text-gray-900 border-0 rounded-xl"
            />
            {tripType === "round-trip" ? (
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                placeholder="Return date"
                className="h-12 bg-white text-gray-900 border-0 rounded-xl"
              />
            ) : (
              <div className="flex gap-2">
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger className="h-12 bg-white border-0 rounded-xl flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? "s" : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={cabinClass} onValueChange={(v) => setCabinClass(v as typeof cabinClass)}>
                  <SelectTrigger className="h-12 bg-white border-0 rounded-xl flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CABIN_CLASSES.map((c) => <SelectItem key={c} value={c}>{CABIN_LABELS[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="submit"
              disabled={!origin || !destination || !departureDate || searching}
              className="h-12 rounded-xl bg-white text-blue-700 hover:bg-white/90 font-bold border-0 lg:col-span-4"
            >
              {searching ? "Searching flights..." : "Search Flights"}
            </Button>
          </form>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Price Calendar */}
        {priceCalendar && priceCalendar.prices.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Price Calendar — {priceCalendar.origin} to {priceCalendar.destination}
            </h3>
            <div className="grid grid-cols-7 gap-1.5">
              {priceCalendar.prices.map((p) => (
                <div
                  key={p.date}
                  className={`rounded-lg p-2 text-center text-xs cursor-pointer transition-colors ${
                    !p.available ? "bg-muted opacity-50" : "bg-primary/10 hover:bg-primary/20"
                  } ${p.date === departureDate ? "ring-2 ring-primary" : ""}`}
                  onClick={() => p.available && setDepartureDate(p.date)}
                >
                  <p className="text-muted-foreground">{new Date(p.date).getDate()}</p>
                  {p.available && <p className="font-bold text-primary">{p.currency}{p.price.toFixed(0)}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searching ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <p className="text-sm text-muted-foreground mb-2">{results.length} flights found</p>
            <AnimatePresence>
              {results.map((flight) => (
                <motion.div
                  key={flight.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Card className="p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xl font-bold">{new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <div className="flex flex-col items-center">
                              <Plane className="w-4 h-4 text-primary" />
                              <span className="text-xs text-muted-foreground">{flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</span>
                            </div>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <span className="text-xl font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{flight.origin}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{flight.destination}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{flight.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-primary">{flight.currency} {flight.price.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">{CABIN_LABELS[flight.cabinClass] ?? flight.cabinClass}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs">{flight.airline}</Badge>
                          <span className={`px-2 py-0.5 rounded text-xs text-white font-semibold ${PROVIDER_COLORS[flight.provider] ?? "bg-gray-500"}`}>
                            via {PROVIDER_LABELS[flight.provider] ?? flight.provider}
                          </span>
                        </div>
                        {flight.baggageIncluded && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Luggage className="w-3 h-3" /> Baggage included
                          </span>
                        )}
                        {flight.lastUpdated && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(flight.lastUpdated).toLocaleString()}
                          </p>
                        )}
                        <a
                          href={flight.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
                        >
                          Book <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : hasSearched ? (
          <div className="text-center py-20 text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No flights found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold mb-4">Popular Routes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(popularRoutes?.routes ?? []).map((route, i) => (
                <Card
                  key={i}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => {
                    setOrigin(route.origin);
                    setDestination(route.destination);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        {route.originCity ?? route.origin}
                        <Plane className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        {route.destinationCity ?? route.destination}
                      </div>
                      <p className="text-xs text-muted-foreground">{route.origin} → {route.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{route.currency} {route.lowestPrice.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">from</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
