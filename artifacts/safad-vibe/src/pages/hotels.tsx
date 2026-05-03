import { useState } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Star, MapPin, Wifi, Coffee, Waves, Clock, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useSearchHotels,
  useGetPopularDestinations,
  getGetPopularDestinationsQueryKey,
  useGetHotelDealSummary,
  getGetHotelDealSummaryQueryKey,
} from "@workspace/api-client-react";

const PROVIDERS = [
  { id: "booking", label: "Booking", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "expedia", label: "Expedia", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "agoda", label: "Agoda", color: "bg-red-100 text-red-700 border-red-200" },
];
const PROVIDER_BADGE: Record<string, string> = {
  booking: "bg-indigo-600",
  expedia: "bg-yellow-500",
  agoda: "bg-red-500",
};
const PROVIDER_LABELS: Record<string, string> = {
  booking: "Booking.com",
  expedia: "Expedia",
  agoda: "Agoda",
};
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  breakfast: <Coffee className="w-3 h-3" />,
  pool: <Waves className="w-3 h-3" />,
};

export default function Hotels() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  const [destination, setDestination] = useState(params.get("destination") ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [providers, setProviders] = useState<string[]>(["booking", "expedia", "agoda"]);
  const [sortBy, setSortBy] = useState("price");
  const [hasSearched, setHasSearched] = useState(false);

  const { mutate: searchHotels, data: hotelResults, isPending: searching, reset } = useSearchHotels();
  const { data: popularDests, isLoading: destsLoading } = useGetPopularDestinations(
    { region: "GLOBAL" },
    { query: { queryKey: getGetPopularDestinationsQueryKey({ region: "GLOBAL" }) } }
  );
  const { data: dealSummary } = useGetHotelDealSummary(
    { query: { queryKey: getGetHotelDealSummaryQueryKey() } }
  );

  function toggleProvider(id: string) {
    setProviders((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!destination || !checkIn || !checkOut) return;
    setHasSearched(true);
    searchHotels({
      destination,
      checkIn,
      checkOut,
      adults: parseInt(adults, 10),
      rooms: parseInt(rooms, 10),
      providers: providers as ("booking" | "expedia" | "agoda")[],
      sortBy: sortBy as "price" | "rating" | "distance",
    });
  }

  const results = hotelResults?.results ?? [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">Hotel Search</h1>
          <p className="text-white/70 mb-6">Compare hotels from Booking.com, Expedia, and Agoda — transparent pricing, real sources.</p>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City or destination"
              className="h-12 bg-white text-gray-900 border-0 rounded-xl"
            />
            <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="h-12 bg-white text-gray-900 border-0 rounded-xl" />
            <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="h-12 bg-white text-gray-900 border-0 rounded-xl" />
            <div className="flex gap-2">
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="h-12 bg-white border-0 rounded-xl flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="h-12 bg-white border-0 rounded-xl flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n} Room{n > 1 ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 bg-white border-0 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={!destination || !checkIn || !checkOut || searching}
              className="h-12 rounded-xl bg-white text-violet-700 hover:bg-white/90 font-bold border-0"
            >
              {searching ? "Searching..." : "Search Hotels"}
            </Button>
          </form>
        </div>
      </div>

      {/* Provider Filter */}
      <div className="border-b bg-background sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProvider(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                providers.includes(p.id) ? p.color : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {p.label}
            </button>
          ))}
          {results.length > 0 && (
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => { reset(); setHasSearched(false); }}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Deal Banner */}
        {!hasSearched && dealSummary && dealSummary.regions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {dealSummary.regions.slice(0, 4).map((r) => (
              <Card key={r.region} className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
                <p className="text-xs font-bold text-violet-700 mb-1">{r.region}</p>
                {r.topDeal && <p className="text-xs text-gray-600 line-clamp-2">{r.topDeal.name}</p>}
                {r.avgDiscount > 0 && <Badge className="mt-1 text-xs bg-pink-100 text-pink-700 border-0">-{r.avgDiscount.toFixed(0)}%</Badge>}
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {searching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <AnimatePresence>
              {results.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col group">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {hotel.imageUrl ? (
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Hotel className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white ${PROVIDER_BADGE[hotel.provider] ?? "bg-gray-500"}`}>
                        via {PROVIDER_LABELS[hotel.provider] ?? hotel.provider}
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-base mb-1 line-clamp-1">{hotel.name}</h3>
                      {hotel.address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> {hotel.address}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(hotel.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        {hotel.reviewScore != null && (
                          <span className="text-xs font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {hotel.reviewScore.toFixed(1)}
                          </span>
                        )}
                        {hotel.reviewCount != null && (
                          <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
                        )}
                      </div>
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                          {hotel.amenities.slice(0, 4).map((a) => (
                            <span key={a} className="flex items-center gap-0.5 text-xs bg-muted px-1.5 py-0.5 rounded capitalize">
                              {AMENITY_ICONS[a.toLowerCase()] ?? null} {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <p className="text-xl font-extrabold text-primary">{hotel.currency} {hotel.pricePerNight.toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          {hotel.lastUpdated && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(hotel.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <a
                          href={hotel.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
                        >
                          Book now <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : hasSearched ? (
          <div className="text-center py-20 text-muted-foreground">
            <Hotel className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No hotels found</p>
            <p className="text-sm">Try a different destination or adjust your filters</p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold mb-4">Popular Destinations</h3>
            {destsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(popularDests?.destinations ?? []).map((dest, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group"
                    onClick={() => setDestination(dest.city)}
                  >
                    {dest.imageUrl ? (
                      <img src={dest.imageUrl} alt={dest.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-300 to-indigo-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-bold text-sm">{dest.city}</p>
                      <p className="text-xs text-white/70">{dest.country}</p>
                      <p className="text-sm font-semibold">{dest.currency} {dest.avgPricePerNight.toFixed(0)}/night</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
