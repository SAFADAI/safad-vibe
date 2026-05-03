import { useState, useRef } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Upload, ShoppingBag, Star, Clock, ExternalLink, Filter, SlidersHorizontal, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  useSearchProducts, useAnalyzeProductImage, useGetTrendingProducts, getGetTrendingProductsQueryKey
} from "@workspace/api-client-react";

const PLATFORMS = [
  { id: "amazon", label: "Amazon", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "ebay", label: "eBay", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "aliexpress", label: "AliExpress", color: "bg-red-100 text-red-700 border-red-200" },
];

const REGIONS = ["GLOBAL", "EU", "US", "ARAB", "ASIA"] as const;

const platformBadge: Record<string, string> = {
  amazon: "bg-orange-500",
  ebay: "bg-blue-600",
  aliexpress: "bg-red-500",
};

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [platforms, setPlatforms] = useState<string[]>(["amazon", "ebay", "aliexpress"]);
  const [region, setRegion] = useState<string>("GLOBAL");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: searchProducts, data: searchResults, isPending: searching, reset } = useSearchProducts();
  const { mutate: analyzeImage, isPending: analyzing } = useAnalyzeProductImage();
  const { data: trending, isLoading: trendingLoading } = useGetTrendingProducts(
    { region: region as "GLOBAL" },
    { query: { queryKey: getGetTrendingProductsQueryKey({ region: region as "GLOBAL" }) } }
  );

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    searchProducts({ query, platforms, region: region as "GLOBAL", sortBy: sortBy as "relevance" });
  }

  function togglePlatform(id: string) {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      analyzeImage(
        { imageBase64: base64 },
        {
          onSuccess: (result) => {
            setQuery(result.suggestedQuery ?? "");
            searchProducts({ query: result.suggestedQuery ?? "", platforms, region: region as "GLOBAL", sortBy: sortBy as "relevance" });
          },
        }
      );
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  const results = searchResults?.results ?? [];
  const displayResults = results.length > 0 ? results : (trending?.results ?? []);
  const isLoading = searching || analyzing || trendingLoading;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-2">Product Search</h1>
          <p className="text-white/70 mb-6">Search by text or upload an image — we compare across platforms instantly.</p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any product..."
                className="pl-10 h-12 bg-white text-gray-900 border-0 rounded-xl"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="h-12 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5" />
            </Button>
            <Button type="submit" className="h-12 px-6 rounded-xl bg-white text-fuchsia-700 hover:bg-white/90 font-bold border-0" disabled={!query.trim() || searching}>
              {searching ? "Searching..." : "Search"}
            </Button>
          </form>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${dragOver ? "border-white bg-white/20" : "border-white/30 hover:border-white/60"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 mx-auto mb-1 text-white/70" />
            <p className="text-sm text-white/70">{analyzing ? "Analyzing image..." : "Drop an image here to search visually"}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b bg-background sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                platforms.includes(p.id) ? p.color : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {p.label}
            </button>
          ))}
          <div className="flex-1" />
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="delivery_time">Delivery Time</SelectItem>
            </SelectContent>
          </Select>
          {results.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { reset(); setQuery(""); }}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {results.length > 0
              ? `${results.length} results for "${searchResults?.query}"`
              : "Trending products"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            <AnimatePresence>
              {displayResults.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                  layout
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="aspect-square bg-muted overflow-hidden relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white ${platformBadge[product.platform] ?? "bg-gray-600"}`}>
                        {product.platform}
                      </div>
                    </div>
                    <CardContent className="p-3 flex flex-col flex-1">
                      <p className="text-sm font-medium line-clamp-2 flex-1 mb-2">{product.title}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {product.currency} {product.price.toFixed(2)}
                          </span>
                          {product.rating != null && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {product.rating.toFixed(1)}
                              {product.reviewCount != null && ` (${product.reviewCount})`}
                            </span>
                          )}
                        </div>
                        {product.shippingInfo && (
                          <p className="text-xs text-muted-foreground">{product.shippingInfo}</p>
                        )}
                        {product.lastUpdated && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated {new Date(product.lastUpdated).toLocaleDateString()}
                          </p>
                        )}
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold transition-colors"
                        >
                          View on {product.platform} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && displayResults.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No products found</p>
            <p className="text-sm">Try a different search query or select different platforms</p>
          </div>
        )}
      </div>
    </div>
  );
}
