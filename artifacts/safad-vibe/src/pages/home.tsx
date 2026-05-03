import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Plane, Hotel, ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetTrendingProducts,
  getGetTrendingProductsQueryKey,
  useGetPopularRoutes,
  getGetPopularRoutesQueryKey,
  useGetPopularDestinations,
  getGetPopularDestinationsQueryKey,
  useGetHotelDealSummary,
  getGetHotelDealSummaryQueryKey,
} from "@workspace/api-client-react";

const tabs = [
  { id: "products", label: "Products", icon: ShoppingBag, href: "/products" },
  { id: "flights", label: "Flights", icon: Plane, href: "/flights" },
  { id: "hotels", label: "Hotels", icon: Hotel, href: "/hotels" },
];

const platformColors: Record<string, string> = {
  amazon: "from-orange-500 to-orange-600",
  ebay: "from-blue-500 to-blue-600",
  aliexpress: "from-red-500 to-red-600",
  amadeus: "from-sky-500 to-sky-600",
  skyscanner: "from-cyan-500 to-teal-600",
  kiwi: "from-green-500 to-green-600",
  booking: "from-indigo-500 to-blue-600",
  expedia: "from-yellow-500 to-orange-500",
  agoda: "from-red-500 to-pink-600",
};

function ProviderBadge({ provider }: { provider: string }) {
  const gradient = platformColors[provider] ?? "from-gray-500 to-gray-600";
  const labels: Record<string, string> = {
    amazon: "Amazon", ebay: "eBay", aliexpress: "AliExpress",
    amadeus: "Amadeus", skyscanner: "Skyscanner", kiwi: "Kiwi",
    booking: "Booking", expedia: "Expedia", agoda: "Agoda",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-gradient-to-r ${gradient}`}>
      via {labels[provider] ?? provider}
    </span>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("products");
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: trending, isLoading: trendingLoading } = useGetTrendingProducts(
    { region: "GLOBAL" },
    { query: { queryKey: getGetTrendingProductsQueryKey({ region: "GLOBAL" }) } }
  );

  const { data: popularRoutes, isLoading: routesLoading } = useGetPopularRoutes(
    { region: "GLOBAL" },
    { query: { queryKey: getGetPopularRoutesQueryKey({ region: "GLOBAL" }) } }
  );

  const { data: destinations, isLoading: destinationsLoading } = useGetPopularDestinations(
    { region: "GLOBAL" },
    { query: { queryKey: getGetPopularDestinationsQueryKey({ region: "GLOBAL" }) } }
  );

  const { data: dealSummary } = useGetHotelDealSummary(
    { query: { queryKey: getGetHotelDealSummaryQueryKey() } }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const tab = tabs.find((t) => t.id === activeTab);
    if (tab) navigate(`${tab.href}${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,113,133,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.2),_transparent_60%)]" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
              Search Everything.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-fuchsia-200 to-cyan-300">
                Compare Freely.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12">
              Products, flights, hotels — all from official sources, all in one place.
            </p>
          </motion.div>

          {/* Search Hub */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-1 bg-white/10 rounded-xl p-1 mb-4 backdrop-blur">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-indigo-700 shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    activeTab === "products"
                      ? "Search for any product..."
                      : activeTab === "flights"
                      ? "Where do you want to fly?"
                      : "Which city are you visiting?"
                  }
                  className="pl-10 h-12 bg-white text-gray-900 border-0 rounded-xl text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 border-0 text-white font-bold">
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Trending Products</h2>
            <Button variant="ghost" className="gap-1 text-primary" onClick={() => navigate("/products")}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {trendingLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {(trending?.results ?? []).slice(0, 4).map((product) => (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                          <ShoppingBag className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2 mb-2">{product.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{product.currency} {product.price.toFixed(2)}</span>
                        <ProviderBadge provider={product.platform} />
                      </div>
                      {product.lastUpdated && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(product.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Flight Routes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Routes</h2>
            <Button variant="ghost" className="gap-1 text-primary" onClick={() => navigate("/flights")}>
              Search flights <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {routesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {(popularRoutes?.routes ?? []).slice(0, 6).map((route, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-primary/30 group"
                    onClick={() => navigate(`/flights?origin=${route.origin}&dest=${route.destination}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          <span>{route.originCity ?? route.origin}</span>
                          <Plane className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                          <span>{route.destinationCity ?? route.destination}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{route.origin} → {route.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          {route.currency} {route.lowestPrice.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">from</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Destinations</h2>
            <Button variant="ghost" className="gap-1 text-primary" onClick={() => navigate("/hotels")}>
              Find hotels <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {destinationsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {(destinations?.destinations ?? []).slice(0, 4).map((dest, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  className="relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer group"
                  onClick={() => navigate(`/hotels?destination=${encodeURIComponent(dest.city)}`)}
                >
                  {dest.imageUrl ? (
                    <img src={dest.imageUrl} alt={dest.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-fuchsia-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      <p className="text-sm font-bold">{dest.city}</p>
                    </div>
                    <p className="text-xs text-white/70">{dest.country}</p>
                    <p className="text-sm font-semibold mt-1">
                      from {dest.currency} {dest.avgPricePerNight.toFixed(0)}/night
                    </p>
                    {dest.rating != null && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{dest.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Deal Summary Banner */}
      {dealSummary && dealSummary.regions.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Current Best Deals by Region</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealSummary.regions.map((r) => (
                <Card key={r.region} className="bg-white/10 border-white/20 text-white p-4 text-center">
                  <p className="font-bold text-lg">{r.region}</p>
                  {r.topDeal && <p className="text-sm text-white/80 line-clamp-2 mt-1">{r.topDeal.name}</p>}
                  {r.avgDiscount > 0 && (
                    <Badge className="mt-2 bg-pink-500 border-0 text-white">
                      Avg {r.avgDiscount.toFixed(0)}% off
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
            <p className="text-center text-white/50 text-xs mt-4">
              Data updated: {new Date(dealSummary.lastUpdated).toLocaleString()}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
