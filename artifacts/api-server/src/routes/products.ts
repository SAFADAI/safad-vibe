import { Router } from "express";
import {
  SearchProductsBody,
  AnalyzeProductImageBody,
  GetTrendingProductsQueryParams,
} from "@workspace/api-zod";
import { db, searchHistoryTable, priceAlertsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function makeProduct(id: string, platform: "amazon" | "ebay" | "aliexpress", title: string, price: number) {
  return {
    id,
    title,
    price,
    currency: "USD",
    platform,
    imageUrl: `https://picsum.photos/seed/${id}/400/400`,
    affiliateUrl: `https://www.${platform === "aliexpress" ? "aliexpress.com" : platform === "ebay" ? "ebay.com" : "amazon.com"}/s?k=${encodeURIComponent(title)}`,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 5000) + 100,
    shippingInfo: price > 50 ? "Free shipping" : `$${(2.99 + Math.random() * 5).toFixed(2)} shipping`,
    availableRegions: ["US", "EU", "GLOBAL"],
    lastUpdated: new Date().toISOString(),
  };
}

router.post("/products/search", async (req, res) => {
  const parsed = SearchProductsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { query, platforms = ["amazon", "ebay", "aliexpress"], region } = parsed.data;

  await db.insert(searchHistoryTable).values({ type: "products", query, resultCount: 12 }).catch(() => {});

  const results = [
    makeProduct("p1", "amazon", `${query} - Premium Edition`, 49.99),
    makeProduct("p2", "ebay", `${query} - Used - Good Condition`, 24.99),
    makeProduct("p3", "aliexpress", `${query} - Wholesale Pack`, 12.99),
    makeProduct("p4", "amazon", `${query} - Pro Model 2024`, 89.99),
    makeProduct("p5", "ebay", `${query} - Brand New Sealed`, 55.00),
    makeProduct("p6", "aliexpress", `${query} - Budget Edition`, 8.50),
    makeProduct("p7", "amazon", `${query} - Bundle Set`, 129.99),
    makeProduct("p8", "ebay", `${query} - Limited Edition`, 75.00),
    makeProduct("p9", "aliexpress", `${query} - Value Pack 3x`, 19.99),
    makeProduct("p10", "amazon", `${query} - Smart Edition`, 199.99),
    makeProduct("p11", "ebay", `${query} - Vintage Style`, 35.00),
    makeProduct("p12", "aliexpress", `${query} - OEM Version`, 6.99),
  ].filter((p) => !platforms || platforms.includes(p.platform));

  res.json({ results, totalCount: results.length, query, platforms: platforms ?? ["amazon", "ebay", "aliexpress"] });
});

router.post("/products/analyze-image", async (req, res) => {
  AnalyzeProductImageBody.safeParse(req.body);
  res.json({
    productType: "Electronics",
    brand: "Unknown",
    attributes: ["portable", "wireless", "modern design"],
    suggestedQuery: "wireless electronics gadget",
    confidence: 0.85,
  });
});

router.get("/products/trending", async (req, res) => {
  const parsed = GetTrendingProductsQueryParams.safeParse(req.query);
  const region = parsed.data?.region ?? "GLOBAL";

  const trending = [
    { query: "AirPods Pro", platform: "amazon" as const, price: 199.99 },
    { query: "Samsung Galaxy Watch", platform: "ebay" as const, price: 149.00 },
    { query: "RGB Gaming Mouse", platform: "aliexpress" as const, price: 24.99 },
    { query: "Portable Charger 20000mAh", platform: "amazon" as const, price: 39.99 },
    { query: "Smart Fitness Band", platform: "aliexpress" as const, price: 18.99 },
    { query: "Mechanical Keyboard", platform: "ebay" as const, price: 79.00 },
    { query: "LED Desk Lamp", platform: "amazon" as const, price: 29.99 },
    { query: "Webcam 4K", platform: "ebay" as const, price: 89.99 },
  ];

  const results = trending.map((t, i) => makeProduct(`t${i}`, t.platform, t.query, t.price));
  res.json({ results, totalCount: results.length, query: "trending", platforms: ["amazon", "ebay", "aliexpress"] });
});

// Price history endpoint
router.get("/products/price-history", async (req, res) => {
  const query = String(req.query.query ?? "product");
  const platform = req.query.platform as string | undefined;
  const days = Math.min(90, Math.max(7, Number(req.query.days ?? 30)));

  const basePrice = 40 + Math.random() * 100;
  const now = Date.now();

  const platforms = platform ? [platform] : ["amazon", "ebay", "aliexpress"];
  const points: Array<{ date: string; price: number; platform: string; currency: string }> = [];

  for (const p of platforms) {
    let price = basePrice * (p === "amazon" ? 1 : p === "ebay" ? 0.85 : 0.7);
    for (let i = days; i >= 0; i -= Math.ceil(days / 20)) {
      const date = new Date(now - i * 86400000).toISOString().slice(0, 10);
      // Simulate realistic price fluctuations
      price = Math.max(price * 0.85, price + (Math.random() - 0.48) * price * 0.08);
      points.push({ date, price: Math.round(price * 100) / 100, platform: p, currency: "USD" });
    }
  }

  points.sort((a, b) => a.date.localeCompare(b.date));

  const prices = points.map((p) => p.price);
  res.json({
    query,
    points,
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    currentPrice: points[points.length - 1]?.price ?? basePrice,
    currency: "USD",
  });
});

// Local platforms endpoint
const LOCAL_PLATFORMS = [
  // Arab region
  { id: "noon", name: "Noon", country: "UAE/SA", region: "ARAB", lang: ["ar"], color: "#f59e0b", flag: "🇦🇪", searchUrlTemplate: "https://www.noon.com/uae-en/search/?q={query}", logoText: "noon", category: "general" },
  { id: "amazon_sa", name: "Amazon.sa", country: "Saudi Arabia", region: "ARAB", lang: ["ar"], color: "#f97316", flag: "🇸🇦", searchUrlTemplate: "https://www.amazon.sa/s?k={query}", logoText: "amazon", category: "general" },
  { id: "jarir", name: "Jarir", country: "Saudi Arabia", region: "ARAB", lang: ["ar"], color: "#16a34a", flag: "🇸🇦", searchUrlTemplate: "https://www.jarir.com/sa-en/catalogsearch/result/?q={query}", logoText: "jarir", category: "electronics" },
  { id: "extra", name: "Extra", country: "Saudi Arabia", region: "ARAB", lang: ["ar"], color: "#2563eb", flag: "🇸🇦", searchUrlTemplate: "https://www.extra.com/en-sa/search?q={query}", logoText: "extra", category: "electronics" },
  { id: "namshi", name: "Namshi", country: "UAE", region: "ARAB", lang: ["ar"], color: "#7c3aed", flag: "🇦🇪", searchUrlTemplate: "https://en-ae.namshi.com/search?q={query}", logoText: "namshi", category: "fashion" },
  { id: "shein_ar", name: "Shein", country: "Arab", region: "ARAB", lang: ["ar"], color: "#ec4899", flag: "🌍", searchUrlTemplate: "https://www.shein.com/search?q={query}", logoText: "shein", category: "fashion" },
  // Turkey
  { id: "trendyol", name: "Trendyol", country: "Turkey", region: "EU", lang: ["tr"], color: "#f97316", flag: "🇹🇷", searchUrlTemplate: "https://www.trendyol.com/sr?q={query}", logoText: "trendyol", category: "general" },
  { id: "hepsiburada", name: "Hepsiburada", country: "Turkey", region: "EU", lang: ["tr"], color: "#f97316", flag: "🇹🇷", searchUrlTemplate: "https://www.hepsiburada.com/ara?q={query}", logoText: "hepsib.", category: "general" },
  { id: "n11", name: "n11", country: "Turkey", region: "EU", lang: ["tr"], color: "#7c3aed", flag: "🇹🇷", searchUrlTemplate: "https://www.n11.com/arama?q={query}", logoText: "n11", category: "general" },
  // Russia
  { id: "ozon", name: "Ozon", country: "Russia", region: "EU", lang: ["ru"], color: "#2563eb", flag: "🇷🇺", searchUrlTemplate: "https://www.ozon.ru/search/?text={query}", logoText: "ozon", category: "general" },
  { id: "wildberries", name: "Wildberries", country: "Russia", region: "EU", lang: ["ru"], color: "#7c3aed", flag: "🇷🇺", searchUrlTemplate: "https://www.wildberries.ru/catalog/0/search.aspx?search={query}", logoText: "WB", category: "fashion" },
  { id: "yandex_market", name: "Яндекс Маркет", country: "Russia", region: "EU", lang: ["ru"], color: "#f59e0b", flag: "🇷🇺", searchUrlTemplate: "https://market.yandex.ru/search?text={query}", logoText: "я.маркет", category: "electronics" },
  // Japan
  { id: "rakuten", name: "Rakuten", country: "Japan", region: "ASIA", lang: ["ja"], color: "#ef4444", flag: "🇯🇵", searchUrlTemplate: "https://search.rakuten.co.jp/search/mall/{query}/", logoText: "楽天", category: "general" },
  { id: "yahoo_jp", name: "Yahoo!ショッピング", country: "Japan", region: "ASIA", lang: ["ja"], color: "#7c3aed", flag: "🇯🇵", searchUrlTemplate: "https://shopping.yahoo.co.jp/search?p={query}", logoText: "yahoo!", category: "general" },
  { id: "mercari_jp", name: "メルカリ", country: "Japan", region: "ASIA", lang: ["ja"], color: "#ef4444", flag: "🇯🇵", searchUrlTemplate: "https://jp.mercari.com/search?keyword={query}", logoText: "メルカリ", category: "secondhand" },
  // Korea
  { id: "coupang", name: "쿠팡", country: "Korea", region: "ASIA", lang: ["ko"], color: "#2563eb", flag: "🇰🇷", searchUrlTemplate: "https://www.coupang.com/np/search?q={query}", logoText: "coupang", category: "general" },
  { id: "gmarket", name: "Gmarket", country: "Korea", region: "ASIA", lang: ["ko"], color: "#f97316", flag: "🇰🇷", searchUrlTemplate: "https://browse.gmarket.co.kr/search?keyword={query}", logoText: "G마켓", category: "general" },
  // China
  { id: "jd", name: "京东 JD.com", country: "China", region: "ASIA", lang: ["zh"], color: "#ef4444", flag: "🇨🇳", searchUrlTemplate: "https://search.jd.com/Search?keyword={query}", logoText: "JD", category: "general" },
  { id: "taobao", name: "淘宝 Taobao", country: "China", region: "ASIA", lang: ["zh"], color: "#f97316", flag: "🇨🇳", searchUrlTemplate: "https://s.taobao.com/search?q={query}", logoText: "淘宝", category: "general" },
  { id: "pinduoduo", name: "拼多多", country: "China", region: "ASIA", lang: ["zh"], color: "#ef4444", flag: "🇨🇳", searchUrlTemplate: "https://mobile.yangkeduo.com/search_result.html?search_key={query}", logoText: "PDD", category: "general" },
  // Indonesia
  { id: "tokopedia", name: "Tokopedia", country: "Indonesia", region: "ASIA", lang: ["id"], color: "#16a34a", flag: "🇮🇩", searchUrlTemplate: "https://www.tokopedia.com/search?st=product&q={query}", logoText: "tokopedia", category: "general" },
  { id: "shopee_id", name: "Shopee ID", country: "Indonesia", region: "ASIA", lang: ["id"], color: "#f97316", flag: "🇮🇩", searchUrlTemplate: "https://shopee.co.id/search?keyword={query}", logoText: "shopee", category: "general" },
  { id: "bukalapak", name: "Bukalapak", country: "Indonesia", region: "ASIA", lang: ["id"], color: "#ef4444", flag: "🇮🇩", searchUrlTemplate: "https://www.bukalapak.com/products?search[keywords]={query}", logoText: "BL", category: "general" },
  // India
  { id: "flipkart", name: "Flipkart", country: "India", region: "ASIA", lang: ["hi"], color: "#f97316", flag: "🇮🇳", searchUrlTemplate: "https://www.flipkart.com/search?q={query}", logoText: "flipkart", category: "general" },
  { id: "meesho", name: "Meesho", country: "India", region: "ASIA", lang: ["hi"], color: "#7c3aed", flag: "🇮🇳", searchUrlTemplate: "https://meesho.com/search?q={query}", logoText: "meesho", category: "fashion" },
  { id: "myntra", name: "Myntra", country: "India", region: "ASIA", lang: ["hi"], color: "#f97316", flag: "🇮🇳", searchUrlTemplate: "https://www.myntra.com/{query}", logoText: "myntra", category: "fashion" },
  // Pakistan
  { id: "daraz_pk", name: "Daraz", country: "Pakistan", region: "ASIA", lang: ["ur"], color: "#f97316", flag: "🇵🇰", searchUrlTemplate: "https://www.daraz.pk/catalog/?q={query}", logoText: "daraz", category: "general" },
  { id: "olx_pk", name: "OLX Pakistan", country: "Pakistan", region: "ASIA", lang: ["ur"], color: "#7c3aed", flag: "🇵🇰", searchUrlTemplate: "https://www.olx.com.pk/items/q-{query}", logoText: "OLX", category: "secondhand" },
  // Iran (Persian)
  { id: "digikala", name: "دیجیکالا", country: "Iran", region: "ASIA", lang: ["fa"], color: "#ef4444", flag: "🇮🇷", searchUrlTemplate: "https://www.digikala.com/search/?q={query}", logoText: "دیجیکالا", category: "general" },
  { id: "torob", name: "ترب", country: "Iran", region: "ASIA", lang: ["fa"], color: "#16a34a", flag: "🇮🇷", searchUrlTemplate: "https://torob.com/search/?query={query}", logoText: "ترب", category: "general" },
  // Germany / EU German
  { id: "otto", name: "Otto", country: "Germany", region: "EU", lang: ["de"], color: "#ef4444", flag: "🇩🇪", searchUrlTemplate: "https://www.otto.de/suche/{query}", logoText: "otto", category: "general" },
  { id: "mediamarkt", name: "MediaMarkt", country: "Germany", region: "EU", lang: ["de", "nl", "pl"], color: "#ef4444", flag: "🇩🇪", searchUrlTemplate: "https://www.mediamarkt.de/de/search.html?query={query}", logoText: "MM", category: "electronics" },
  { id: "zalando", name: "Zalando", country: "Europe", region: "EU", lang: ["de", "nl", "fr", "it", "pl", "sv", "no"], color: "#f97316", flag: "🇪🇺", searchUrlTemplate: "https://www.zalando.com/catalog/?q={query}", logoText: "zalando", category: "fashion" },
  // France
  { id: "fnac", name: "Fnac", country: "France", region: "EU", lang: ["fr"], color: "#f59e0b", flag: "🇫🇷", searchUrlTemplate: "https://www.fnac.com/SearchResult/ResultSet.aspx?SCat=0&Search={query}", logoText: "fnac", category: "electronics" },
  { id: "cdiscount", name: "Cdiscount", country: "France", region: "EU", lang: ["fr"], color: "#2563eb", flag: "🇫🇷", searchUrlTemplate: "https://www.cdiscount.com/search/10/{query}.html", logoText: "cdiscount", category: "general" },
  // Italy
  { id: "eprice", name: "ePrice", country: "Italy", region: "EU", lang: ["it"], color: "#2563eb", flag: "🇮🇹", searchUrlTemplate: "https://www.eprice.it/Informatica/s/?keyword={query}", logoText: "ePrice", category: "electronics" },
  { id: "subito", name: "Subito.it", country: "Italy", region: "EU", lang: ["it"], color: "#f97316", flag: "🇮🇹", searchUrlTemplate: "https://www.subito.it/annunci-italia/vendita/usato/?q={query}", logoText: "subito", category: "secondhand" },
  // Portugal/Brazil
  { id: "mercado_livre", name: "Mercado Livre", country: "Brazil", region: "US", lang: ["pt"], color: "#f59e0b", flag: "🇧🇷", searchUrlTemplate: "https://lista.mercadolivre.com.br/{query}", logoText: "mercado", category: "general" },
  { id: "magazine_luiza", name: "Magazine Luiza", country: "Brazil", region: "US", lang: ["pt"], color: "#2563eb", flag: "🇧🇷", searchUrlTemplate: "https://www.magazineluiza.com.br/busca/{query}/", logoText: "magalu", category: "general" },
  // Spain
  { id: "pccomponentes", name: "PcComponentes", country: "Spain", region: "EU", lang: ["es"], color: "#f97316", flag: "🇪🇸", searchUrlTemplate: "https://www.pccomponentes.com/buscar/?query={query}", logoText: "PCComp.", category: "electronics" },
  { id: "el_corte", name: "El Corte Inglés", country: "Spain", region: "EU", lang: ["es"], color: "#16a34a", flag: "🇪🇸", searchUrlTemplate: "https://www.elcorteingles.es/buscar/?s={query}", logoText: "ECI", category: "general" },
  // Norway/Sweden
  { id: "komplett", name: "Komplett", country: "Norway", region: "EU", lang: ["no", "sv"], color: "#ef4444", flag: "🇳🇴", searchUrlTemplate: "https://www.komplett.no/search?q={query}", logoText: "Komplett", category: "electronics" },
  { id: "elkjop", name: "Elkjøp", country: "Norway", region: "EU", lang: ["no"], color: "#2563eb", flag: "🇳🇴", searchUrlTemplate: "https://www.elkjop.no/search/{query}", logoText: "Elkjøp", category: "electronics" },
  // US specific
  { id: "walmart", name: "Walmart", country: "USA", region: "US", lang: ["en"], color: "#2563eb", flag: "🇺🇸", searchUrlTemplate: "https://www.walmart.com/search?q={query}", logoText: "walmart", category: "general" },
  { id: "bestbuy", name: "Best Buy", country: "USA", region: "US", lang: ["en"], color: "#2563eb", flag: "🇺🇸", searchUrlTemplate: "https://www.bestbuy.com/site/searchpage.jsp?st={query}", logoText: "bestbuy", category: "electronics" },
  { id: "target", name: "Target", country: "USA", region: "US", lang: ["en"], color: "#ef4444", flag: "🇺🇸", searchUrlTemplate: "https://www.target.com/s?searchTerm={query}", logoText: "target", category: "general" },
];

router.get("/products/local-platforms", async (req, res) => {
  const lang = String(req.query.lang ?? "").toLowerCase();
  const region = String(req.query.region ?? "GLOBAL");

  let filtered = LOCAL_PLATFORMS;

  if (lang) {
    const byLang = LOCAL_PLATFORMS.filter((p) => p.lang.includes(lang));
    filtered = byLang.length > 0 ? byLang : LOCAL_PLATFORMS.filter((p) => p.region === region || region === "GLOBAL");
  } else if (region !== "GLOBAL") {
    filtered = LOCAL_PLATFORMS.filter((p) => p.region === region);
  }

  const country = filtered[0]?.country ?? region;
  res.json({ platforms: filtered.slice(0, 8), region, country });
});

// Price alerts
router.get("/products/price-alerts", async (req, res) => {
  const alerts = await db
    .select()
    .from(priceAlertsTable)
    .orderBy(priceAlertsTable.createdAt);

  const mapped = alerts.map((a) => ({
    id: a.id,
    productTitle: a.productTitle,
    targetPrice: Number(a.targetPrice),
    currentPrice: Number(a.currentPrice),
    currency: a.currency,
    platform: a.platform,
    isTriggered: a.isTriggered,
    createdAt: a.createdAt.toISOString(),
  }));

  res.json({
    alerts: mapped,
    total: mapped.length,
    triggeredCount: mapped.filter((a) => a.isTriggered).length,
  });
});

router.post("/products/price-alerts", async (req, res) => {
  const { productTitle, targetPrice, currentPrice, currency = "USD", platform } = req.body as {
    productTitle: string;
    targetPrice: number;
    currentPrice: number;
    currency?: string;
    platform?: string;
  };

  if (!productTitle || targetPrice == null || currentPrice == null) {
    res.status(400).json({ error: "productTitle, targetPrice and currentPrice are required" });
    return;
  }

  const isTriggered = currentPrice <= targetPrice;

  const [created] = await db
    .insert(priceAlertsTable)
    .values({ productTitle, targetPrice: String(targetPrice), currentPrice: String(currentPrice), currency, platform: platform ?? null, isTriggered })
    .returning();

  res.status(201).json({
    id: created.id,
    productTitle: created.productTitle,
    targetPrice: Number(created.targetPrice),
    currentPrice: Number(created.currentPrice),
    currency: created.currency,
    platform: created.platform,
    isTriggered: created.isTriggered,
    createdAt: created.createdAt.toISOString(),
  });
});

router.delete("/products/price-alerts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(priceAlertsTable).where(eq(priceAlertsTable.id, id));
  res.json({ success: true });
});

export default router;
