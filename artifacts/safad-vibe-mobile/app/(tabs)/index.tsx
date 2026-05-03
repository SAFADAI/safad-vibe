import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetTrendingProducts,
  useGetPopularRoutes,
  useGetPopularDestinations,
  useGetSearchHistory,
} from "@workspace/api-client-react";

import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguagePicker } from "@/components/LanguagePicker";

const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#f97316",
  ebay: "#3b82f6",
  aliexpress: "#ef4444",
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tr, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trending, isLoading: trendingLoading } = useGetTrendingProducts({ region: "GLOBAL" });
  const { data: routes, isLoading: routesLoading } = useGetPopularRoutes({ region: "GLOBAL" });
  const { data: destinations, isLoading: destLoading } = useGetPopularDestinations({ region: "GLOBAL" });
  const { data: history } = useGetSearchHistory({ limit: 5 });

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = Platform.OS === "web" ? 84 : 68;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push({ pathname: "/(tabs)/products", params: { q: searchQuery.trim() } } as never);
  };

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Header */}
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.heroGradient}>
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{tr.home.title}</Text>
              <Text style={styles.heroSubtitle}>{tr.home.subtitle}</Text>
            </View>
            <LanguagePicker />
          </View>
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="search" size={18} color="rgba(255,255,255,0.7)" />
              <TextInput
                style={[styles.searchInput, isRTL && { textAlign: "right" }]}
                placeholder={tr.home.searchPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                textAlign={isRTL ? "right" : "left"}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={16} color="rgba(255,255,255,0.7)" />
                </Pressable>
              )}
            </View>
          </View>
          {/* Quick Nav Pills */}
          <View style={styles.pillRow}>
            <Pressable style={styles.pill} onPress={() => router.push("/(tabs)/flights" as never)}>
              <Feather name="navigation" size={14} color="#fff" />
              <Text style={styles.pillText}>{tr.tabs.flights}</Text>
            </Pressable>
            <Pressable style={styles.pill} onPress={() => router.push("/(tabs)/hotels" as never)}>
              <Feather name="map-pin" size={14} color="#fff" />
              <Text style={styles.pillText}>{tr.tabs.hotels}</Text>
            </Pressable>
            <Pressable style={styles.pill} onPress={() => router.push("/(tabs)/products" as never)}>
              <Feather name="shopping-bag" size={14} color="#fff" />
              <Text style={styles.pillText}>{tr.tabs.products}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Searches */}
        {history && history.items.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{tr.home.recentSearches}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyRow}>
              {history.items.map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.historyChip, { backgroundColor: colors.muted }]}
                  onPress={() => {
                    if (item.type === "flights") router.push("/(tabs)/flights" as never);
                    else if (item.type === "hotels") router.push("/(tabs)/hotels" as never);
                    else router.push({ pathname: "/(tabs)/products", params: { q: item.query } } as never);
                  }}
                >
                  <Feather
                    name={item.type === "flights" ? "navigation" : item.type === "hotels" ? "map-pin" : "shopping-bag"}
                    size={12}
                    color={colors.primary}
                  />
                  <Text style={[styles.historyChipText, { color: colors.foreground }]} numberOfLines={1}>
                    {item.query}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trending Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{tr.home.trendingProducts}</Text>
            <Pressable onPress={() => router.push("/(tabs)/products" as never)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{tr.home.seeAll}</Text>
            </Pressable>
          </View>
          {trendingLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              horizontal
              data={trending?.results?.slice(0, 8) ?? []}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <Pressable style={[styles.productCard, { backgroundColor: colors.card }]}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.productImagePlaceholder, { backgroundColor: colors.muted }]}>
                      <Feather name="image" size={28} color={colors.mutedForeground} />
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={[styles.productTitle, { color: colors.foreground }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.productMeta}>
                      <Text style={[styles.productPrice, { color: colors.primary }]}>
                        {item.currency} {item.price.toFixed(2)}
                      </Text>
                      <View style={[styles.platformBadge, { backgroundColor: PLATFORM_COLORS[item.platform] ?? colors.accent }]}>
                        <Text style={styles.platformBadgeText}>{item.platform}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Feather name="shopping-bag" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{tr.products.noTrending}</Text>
                </View>
              }
              scrollEnabled={!!(trending?.results?.length)}
            />
          )}
        </View>

        {/* Popular Routes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{tr.home.popularFlights}</Text>
            <Pressable onPress={() => router.push("/(tabs)/flights" as never)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{tr.home.seeAll}</Text>
            </Pressable>
          </View>
          {routesLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              horizontal
              data={routes?.routes?.slice(0, 6) ?? []}
              keyExtractor={(r) => `${r.origin}-${r.destination}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.routeCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push("/(tabs)/flights" as never)}
                >
                  <View style={styles.routeTop}>
                    <Text style={[styles.routeCode, { color: colors.foreground }]}>{item.origin}</Text>
                    <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.routeCode, { color: colors.foreground }]}>{item.destination}</Text>
                  </View>
                  {(item.originCity || item.destinationCity) && (
                    <Text style={[styles.routeCities, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.originCity} → {item.destinationCity}
                    </Text>
                  )}
                  <Text style={[styles.routePrice, { color: colors.secondary }]}>
                    {tr.flights.from} {item.currency} {item.lowestPrice}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Feather name="navigation" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{tr.flights.noResults}</Text>
                </View>
              }
              scrollEnabled={!!(routes?.routes?.length)}
            />
          )}
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{tr.home.hotelDestinations}</Text>
            <Pressable onPress={() => router.push("/(tabs)/hotels" as never)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{tr.home.seeAll}</Text>
            </Pressable>
          </View>
          {destLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              horizontal
              data={destinations?.destinations?.slice(0, 6) ?? []}
              keyExtractor={(d) => d.city}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.destCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push("/(tabs)/hotels" as never)}
                >
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.destImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.destImage, { backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }]}>
                      <Feather name="map-pin" size={28} color={colors.mutedForeground} />
                    </View>
                  )}
                  <View style={styles.destOverlay}>
                    <Text style={styles.destCity}>{item.city}</Text>
                    <Text style={styles.destCountry}>{item.country}</Text>
                    <Text style={styles.destPrice}>
                      {item.currency} {item.avgPricePerNight}/{tr.hotels.perNight}
                    </Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Feather name="map-pin" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{tr.hotels.noResults}</Text>
                </View>
              }
              scrollEnabled={!!(destinations?.destinations?.length)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { backgroundColor: "transparent" },
    heroGradient: {
      backgroundColor: "#312e81",
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    heroTop: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    heroText: { flex: 1 },
    heroTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 32,
      color: "#ffffff",
      letterSpacing: -0.5,
      textAlign: isRTL ? "right" : "left",
    },
    heroSubtitle: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      color: "rgba(255,255,255,0.65)",
      marginTop: 2,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    searchRow: { flexDirection: "row", gap: 10 },
    searchBar: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    searchInput: {
      flex: 1,
      fontFamily: "Inter_400Regular",
      fontSize: 15,
      color: "#ffffff",
    },
    pillRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
      marginTop: 14,
    },
    pill: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    pillText: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      color: "#ffffff",
    },
    section: { paddingTop: 24, paddingLeft: isRTL ? 0 : 20, paddingRight: isRTL ? 20 : 0 },
    sectionHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: isRTL ? 0 : 20,
      paddingLeft: isRTL ? 20 : 0,
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 18,
    },
    seeAll: {
      fontFamily: "Inter_500Medium",
      fontSize: 13,
    },
    horizontalList: { paddingRight: isRTL ? 0 : 20, paddingLeft: isRTL ? 20 : 0, gap: 12 },
    historyRow: { gap: 8, paddingRight: isRTL ? 0 : 20, paddingLeft: isRTL ? 20 : 0, paddingTop: 4 },
    historyChip: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      maxWidth: 140,
    },
    historyChipText: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
    },
    productCard: {
      width: 160,
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    productImage: { width: "100%", height: 140 },
    productImagePlaceholder: {
      width: "100%",
      height: 140,
      justifyContent: "center",
      alignItems: "center",
    },
    productInfo: { padding: 10 },
    productTitle: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      lineHeight: 16,
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
    },
    productMeta: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productPrice: {
      fontFamily: "Inter_700Bold",
      fontSize: 13,
    },
    platformBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    platformBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 9,
      color: "#fff",
      textTransform: "capitalize",
    },
    routeCard: {
      width: 150,
      padding: 14,
      borderRadius: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    routeTop: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    routeCode: {
      fontFamily: "Inter_700Bold",
      fontSize: 16,
    },
    routeCities: {
      fontFamily: "Inter_400Regular",
      fontSize: 11,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    routePrice: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      textAlign: isRTL ? "right" : "left",
    },
    destCard: {
      width: 160,
      height: 180,
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    destImage: { width: "100%", height: "100%" },
    destOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    destCity: {
      fontFamily: "Inter_700Bold",
      fontSize: 14,
      color: "#fff",
      textAlign: isRTL ? "right" : "left",
    },
    destCountry: {
      fontFamily: "Inter_400Regular",
      fontSize: 11,
      color: "rgba(255,255,255,0.75)",
      textAlign: isRTL ? "right" : "left",
    },
    destPrice: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      color: "#f0abfc",
      marginTop: 2,
      textAlign: isRTL ? "right" : "left",
    },
    emptyState: {
      width: 200,
      alignItems: "center",
      gap: 8,
      paddingVertical: 24,
    },
    emptyText: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      textAlign: "center",
    },
  });
}
