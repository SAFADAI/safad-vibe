import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  useSearchProducts,
  useGetTrendingProducts,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageSearchButton } from "@/components/ImageSearchButton";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { PriceAlertButton } from "@/components/PriceAlertButton";
import { LocalStoresSection } from "@/components/LocalStoresSection";
import { useAlerts } from "@/contexts/AlertsContext";

type Region = "EU" | "US" | "ARAB" | "ASIA" | "GLOBAL";
type SortBy = "relevance" | "price_asc" | "price_desc" | "delivery_time";

const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#f97316",
  ebay: "#3b82f6",
  aliexpress: "#ef4444",
};

const REGION_KEYS: Region[] = ["GLOBAL", "US", "EU", "ARAB", "ASIA"];

export default function ProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tr, isRTL } = useLanguage();
  const { triggeredCount } = useAlerts();
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = Platform.OS === "web" ? 84 : 68;

  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<Region>("GLOBAL");
  const [sortBy, setSortBy] = useState<SortBy>("relevance");

  const SORTS: { key: SortBy; label: string }[] = [
    { key: "relevance", label: tr.sort.bestMatch },
    { key: "price_asc", label: tr.sort.priceAsc },
    { key: "price_desc", label: tr.sort.priceDesc },
    { key: "delivery_time", label: tr.sort.fastest },
  ];

  const REGION_LABELS: Record<Region, string> = {
    GLOBAL: tr.region.global,
    US: tr.region.us,
    EU: tr.region.eu,
    ARAB: tr.region.arab,
    ASIA: tr.region.asia,
  };

  const { data: trending, isLoading: trendingLoading } = useGetTrendingProducts({ region });
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(
    { query: searchQuery, region, sortBy },
    { enabled: searchQuery.length > 0 }
  );

  const handleSearch = (q?: string) => {
    const finalQ = (q ?? query).trim();
    if (!finalQ) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuery(finalQ);
    setSearchQuery(finalQ);
  };

  const displayData = searchQuery ? searchResults?.results : trending?.results;
  const isLoading = searchQuery ? searchLoading : trendingLoading;

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.card }]}>
        <View style={[{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{tr.products.title}</Text>
          <Pressable
            onPress={() => router.push("/alerts")}
            hitSlop={12}
            style={[{ position: "relative", padding: 4 }]}
          >
            <Feather name="bell" size={22} color={colors.foreground} />
            {triggeredCount > 0 && (
              <View style={{
                position: "absolute",
                top: 0,
                right: isRTL ? undefined : 0,
                left: isRTL ? 0 : undefined,
                backgroundColor: "#ef4444",
                borderRadius: 8,
                minWidth: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 3,
              }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 10, color: "#fff" }}>
                  {triggeredCount > 9 ? "9+" : triggeredCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search bar + camera */}
        <View style={[styles.searchRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.muted, flex: 1, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder={tr.products.searchPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              textAlign={isRTL ? "right" : "left"}
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(""); setSearchQuery(""); }}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <ImageSearchButton
            onQuerySuggested={(q) => {
              setQuery(q);
              handleSearch(q);
            }}
          />
        </View>

        {/* Region filter */}
        <FlatList
          horizontal
          data={REGION_KEYS}
          keyExtractor={(r) => r}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.filterChip, { backgroundColor: region === item ? colors.primary : colors.muted, borderColor: region === item ? colors.primary : colors.border }]}
              onPress={() => { setRegion(item); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.filterChipText, { color: region === item ? "#fff" : colors.mutedForeground }]}>
                {REGION_LABELS[item]}
              </Text>
            </Pressable>
          )}
        />

        {/* Sort filter */}
        <FlatList
          horizontal
          data={SORTS}
          keyExtractor={(s) => s.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filterRow, { paddingBottom: 4 }]}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.filterChip, { backgroundColor: sortBy === item.key ? colors.accent : colors.muted, borderColor: sortBy === item.key ? colors.accent : colors.border }]}
              onPress={() => { setSortBy(item.key); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.filterChipText, { color: sortBy === item.key ? "#fff" : colors.mutedForeground }]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            {searchQuery ? tr.products.searching : tr.products.loadingTrending}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayData ?? []}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 12, paddingBottom: tabBarHeight + 16, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          ListHeaderComponent={
            <LocalStoresSection searchQuery={searchQuery} />
          }
          ListHeaderComponentStyle={{ marginBottom: 8, marginHorizontal: -12 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.productCard, { backgroundColor: colors.card, flex: 1 }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
              ) : (
                <View style={[styles.productImagePlaceholder, { backgroundColor: colors.muted }]}>
                  <Feather name="image" size={32} color={colors.mutedForeground} />
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, { color: colors.foreground }]} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.rating != null && (
                  <View style={[styles.ratingRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Feather name="star" size={10} color="#f59e0b" />
                    <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
                      {item.rating.toFixed(1)} {item.reviewCount != null ? `(${item.reviewCount})` : ""}
                    </Text>
                  </View>
                )}
                <View style={[styles.priceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {item.currency} {item.price.toFixed(2)}
                  </Text>
                  <View style={[styles.platformBadge, { backgroundColor: PLATFORM_COLORS[item.platform] ?? colors.accent }]}>
                    <Text style={styles.platformBadgeText}>{item.platform}</Text>
                  </View>
                </View>
                {item.shippingInfo && (
                  <Text style={[styles.shipping, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {item.shippingInfo}
                  </Text>
                )}
                {/* Price history trigger */}
                <PriceHistoryChart
                  productTitle={item.title}
                  currentPrice={item.price}
                  currency={item.currency}
                />
                {/* Price alert button */}
                <PriceAlertButton
                  productTitle={item.title}
                  currentPrice={item.price}
                  currency={item.currency}
                  platform={item.platform}
                />
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                {searchQuery ? tr.products.noResults : tr.products.noTrending}
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {searchQuery ? tr.products.tryDifferent : tr.products.checkBack}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 16,
      paddingBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    headerTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 28,
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    searchRow: {
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    searchBar: {
      alignItems: "center",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: "Inter_400Regular",
      fontSize: 15,
    },
    filterRow: { paddingVertical: 4, gap: 8 },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterChipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { fontFamily: "Inter_400Regular", fontSize: 14 },
    productCard: {
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    productImage: { width: "100%", height: 150 },
    productImagePlaceholder: {
      width: "100%",
      height: 150,
      justifyContent: "center",
      alignItems: "center",
    },
    productInfo: { padding: 10, gap: 4 },
    productTitle: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      lineHeight: 16,
      textAlign: isRTL ? "right" : "left",
    },
    ratingRow: { alignItems: "center", gap: 3 },
    ratingText: { fontFamily: "Inter_400Regular", fontSize: 11 },
    priceRow: { alignItems: "center", justifyContent: "space-between", marginTop: 2 },
    price: { fontFamily: "Inter_700Bold", fontSize: 14 },
    platformBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    platformBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 9,
      color: "#fff",
      textTransform: "capitalize",
    },
    shipping: { fontFamily: "Inter_400Regular", fontSize: 10, textAlign: isRTL ? "right" : "left" },
    emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 60 },
    emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
    emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
  });
}
