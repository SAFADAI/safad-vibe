import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ShoppingBag, Plane, Hotel, Search, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetSearchHistory,
  getGetSearchHistoryQueryKey,
  useGetSearchStats,
  getGetSearchStatsQueryKey,
} from "@workspace/api-client-react";

const TYPE_CONFIG = {
  products: { icon: ShoppingBag, label: "Products", color: "bg-orange-100 text-orange-700 border-orange-200" },
  flights: { icon: Plane, label: "Flights", color: "bg-blue-100 text-blue-700 border-blue-200" },
  hotels: { icon: Hotel, label: "Hotels", color: "bg-violet-100 text-violet-700 border-violet-200" },
  all: { icon: Search, label: "All", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function SearchHistory() {
  const [typeFilter, setTypeFilter] = useState<"all" | "products" | "flights" | "hotels">("all");

  const { data: history, isLoading: historyLoading } = useGetSearchHistory(
    { type: typeFilter, limit: 20 },
    { query: { queryKey: getGetSearchHistoryQueryKey({ type: typeFilter, limit: 20 }) } }
  );

  const { data: stats, isLoading: statsLoading } = useGetSearchStats(
    { query: { queryKey: getGetSearchStatsQueryKey() } }
  );

  return (
    <div className="flex-1 bg-background">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">Search History</h1>
          <p className="text-white/60">Your recent searches and activity summary.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />))}
          </div>
        ) : stats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {[
              { label: "Total Searches", value: stats.totalSearches, icon: Search, color: "text-primary" },
              { label: "Product Searches", value: stats.productSearches, icon: ShoppingBag, color: "text-orange-600" },
              { label: "Flight Searches", value: stats.flightSearches, icon: Plane, color: "text-blue-600" },
              { label: "Hotel Searches", value: stats.hotelSearches, icon: Hotel, color: "text-violet-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <Card className="p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                  <p className="text-3xl font-extrabold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Recent Searches</h2>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="flights">Flights</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {historyLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />))}
              </div>
            ) : (history?.items ?? []).length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No search history yet</p>
                <p className="text-sm">Your searches will appear here</p>
              </div>
            ) : (
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              >
                {(history?.items ?? []).map((item) => {
                  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.all;
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={item.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                    >
                      <Card className="p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.query}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs border ${config.color} bg-transparent`}>
                            {config.label}
                          </Badge>
                          {item.resultCount != null && (
                            <span className="text-xs text-muted-foreground">{item.resultCount} results</span>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Top Stats Sidebar */}
          <div className="space-y-4">
            {stats && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" /> Top Product Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(stats.topProductQueries ?? []).slice(0, 5).map((q) => (
                      <div key={q.query} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{q.query}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">{q.count}</Badge>
                      </div>
                    ))}
                    {(stats.topProductQueries ?? []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No data yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Plane className="w-4 h-4 text-blue-600" /> Top Flight Routes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(stats.topFlightRoutes ?? []).slice(0, 5).map((r) => (
                      <div key={r.route} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1 font-mono text-xs">{r.route}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">{r.count}</Badge>
                      </div>
                    ))}
                    {(stats.topFlightRoutes ?? []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No data yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-violet-600" /> Top Hotel Destinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(stats.topHotelDestinations ?? []).slice(0, 5).map((d) => (
                      <div key={d.destination} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{d.destination}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">{d.count}</Badge>
                      </div>
                    ))}
                    {(stats.topHotelDestinations ?? []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
