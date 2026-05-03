import { Feather } from "@expo/vector-icons";
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
import * as Haptics from "expo-haptics";
import {
  useSearchHotels,
  useGetPopularDestinations,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

const PROVIDER_COLORS: Record<string, string> = {
  booking: "#6366f1",
  expedia: "#eab308",
  agoda: "#f43f5e",
};

function StarRating({ rating }: { rating: number }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather key={i} name="star" size={11} color={i <= Math.round(rating) ? "#f59e0b" : colors.border} />
      ))}
    </View>
  );
}

export default function HotelsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tr, isRTL } = useLanguage();
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = Platform.OS === "web" ? 84 : 68;

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [adults, setAdults] = useState(2);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price");
  const [searching, setSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<null | {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    sortBy: "price" | "rating" | "distance";
  }>(null);

  const SORT_OPTIONS: { key: "price" | "rating" | "distance"; label: string }[] = [
    { key: "price", label: tr.sort.price },
    { key: "rating", label: tr.sort.rating },
    { key: "distance", label: tr.sort.distance },
  ];

  const { data: popularDest } = useGetPopularDestinations({ region: "GLOBAL" });

  const { data: hotelResults, isLoading: hotelsLoading } = useSearchHotels(
    {
      destination: searchParams?.destination ?? "",
      checkIn: searchParams?.checkIn ?? "",
      checkOut: searchParams?.checkOut ?? "",
      adults: searchParams?.adults ?? 2,
      sortBy: searchParams?.sortBy ?? "price",
    },
    { enabled: !!searchParams }
  );

  const handleSearch = () => {
    if (!destination.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearchParams({ destination: destination.trim(), checkIn, checkOut, adults, sortBy });
    setSearching(true);
  };

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{tr.hotels.title}</Text>

        <View style={[styles.inputBox, { backgroundColor: colors.muted, marginBottom: 10 }]}>
          <Feather name="map-pin" size={14} color={colors.mutedForeground} />
          <TextInput
            style={[styles.inputText, { color: colors.foreground }]}
            placeholder={tr.hotels.destination}
            placeholderTextColor={colors.mutedForeground}
            value={destination}
            onChangeText={setDestination}
            returnKeyType="search"
            textAlign={isRTL ? "right" : "left"}
          />
        </View>

        <View style={styles.datesRow}>
          <View style={[styles.inputBox, { backgroundColor: colors.muted, flex: 1 }]}>
            <Feather name="log-in" size={13} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputText, { color: colors.foreground }]}
              placeholder={tr.hotels.checkin}
              placeholderTextColor={colors.mutedForeground}
              value={checkIn}
              onChangeText={setCheckIn}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>
          <View style={[styles.inputBox, { backgroundColor: colors.muted, flex: 1 }]}>
            <Feather name="log-out" size={13} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputText, { color: colors.foreground }]}
              placeholder={tr.hotels.checkout}
              placeholderTextColor={colors.mutedForeground}
              value={checkOut}
              onChangeText={setCheckOut}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>
          <View style={[styles.counterBox, { backgroundColor: colors.muted }]}>
            <Pressable onPress={() => setAdults(Math.max(1, adults - 1))}>
              <Feather name="minus" size={14} color={colors.primary} />
            </Pressable>
            <Text style={[styles.counterText, { color: colors.foreground }]}>{adults}</Text>
            <Pressable onPress={() => setAdults(Math.min(10, adults + 1))}>
              <Feather name="plus" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={(s) => s.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortRow}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.sortChip,
                {
                  backgroundColor: sortBy === item.key ? colors.primary : colors.muted,
                  borderColor: sortBy === item.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => { setSortBy(item.key); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.sortChipText, { color: sortBy === item.key ? "#fff" : colors.mutedForeground }]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />

        <Pressable
          style={[styles.searchBtn, { backgroundColor: colors.primary, opacity: !destination ? 0.5 : 1 }]}
          onPress={handleSearch}
          disabled={!destination.trim()}
        >
          <Feather name="search" size={16} color="#fff" />
          <Text style={styles.searchBtnText}>{tr.hotels.searchBtn}</Text>
        </Pressable>
      </View>

      {searching && hotelsLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>{tr.hotels.findingHotels}</Text>
        </View>
      ) : searching && hotelResults ? (
        <FlatList
          data={hotelResults.results}
          keyExtractor={(h) => h.id}
          contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.hotelCard, { backgroundColor: colors.card }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.hotelImage} resizeMode="cover" />
              ) : (
                <View style={[styles.hotelImage, { backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }]}>
                  <Feather name="home" size={36} color={colors.mutedForeground} />
                </View>
              )}
              <View style={styles.hotelInfo}>
                <View style={[styles.hotelHeaderRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Text style={[styles.hotelName, { color: colors.foreground }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={[styles.providerBadge, { backgroundColor: PROVIDER_COLORS[item.provider] ?? colors.accent }]}>
                    <Text style={styles.providerBadgeText}>{item.provider}</Text>
                  </View>
                </View>
                <StarRating rating={item.rating} />
                {item.reviewScore != null && (
                  <View style={[styles.reviewRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <View style={[styles.reviewScore, { backgroundColor: colors.primary }]}>
                      <Text style={styles.reviewScoreText}>{item.reviewScore.toFixed(1)}</Text>
                    </View>
                    {item.reviewCount != null && (
                      <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                        {item.reviewCount.toLocaleString()}
                      </Text>
                    )}
                  </View>
                )}
                {item.address && (
                  <Text style={[styles.address, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                )}
                {item.amenities && item.amenities.length > 0 && (
                  <View style={[styles.amenitiesRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    {item.amenities.slice(0, 3).map((a) => (
                      <View key={a} style={[styles.amenityChip, { backgroundColor: colors.muted }]}>
                        <Text style={[styles.amenityText, { color: colors.mutedForeground }]}>{a}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={[styles.priceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <View>
                    <Text style={[styles.price, { color: colors.primary }]}>
                      {item.currency} {item.pricePerNight.toFixed(0)}
                    </Text>
                    <Text style={[styles.perNight, { color: colors.mutedForeground }]}>{tr.hotels.perNight}</Text>
                  </View>
                  <Pressable
                    style={[styles.bookBtn, { backgroundColor: colors.secondary }]}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                  >
                    <Text style={styles.bookBtnText}>{tr.hotels.book}</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="home" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{tr.hotels.noResults}</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{tr.hotels.tryDifferent}</Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>
            {tr.hotels.popularDestinations}
          </Text>
          <View style={styles.destGrid}>
            {popularDest?.destinations?.map((dest) => (
              <Pressable
                key={dest.city}
                style={[styles.destCard, { backgroundColor: colors.card }]}
                onPress={() => {
                  setDestination(dest.city);
                  Haptics.selectionAsync();
                }}
              >
                {dest.imageUrl ? (
                  <Image source={{ uri: dest.imageUrl }} style={styles.destImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.destImage, { backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }]}>
                    <Feather name="map-pin" size={28} color={colors.mutedForeground} />
                  </View>
                )}
                <View style={styles.destOverlay}>
                  <Text style={[styles.destCity, { textAlign: isRTL ? "right" : "left" }]}>{dest.city}</Text>
                  <Text style={[styles.destCountry, { textAlign: isRTL ? "right" : "left" }]}>{dest.country}</Text>
                  <Text style={[styles.destPrice, { textAlign: isRTL ? "right" : "left" }]}>
                    {dest.currency} {dest.avgPricePerNight}/{tr.hotels.perNight}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    headerTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 28,
      marginBottom: 14,
      textAlign: isRTL ? "right" : "left",
    },
    inputBox: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 6,
    },
    inputText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
    datesRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    counterBox: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 8,
    },
    counterText: { fontFamily: "Inter_600SemiBold", fontSize: 14, minWidth: 14, textAlign: "center" },
    sortRow: { gap: 8, paddingBottom: 10 },
    sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    sortChipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
    searchBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingVertical: 13,
      gap: 8,
    },
    searchBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { fontFamily: "Inter_400Regular", fontSize: 14 },
    hotelCard: {
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    hotelImage: { width: "100%", height: 180 },
    hotelInfo: { padding: 14, gap: 6 },
    hotelHeaderRow: { alignItems: "center", gap: 8 },
    hotelName: { fontFamily: "Inter_600SemiBold", fontSize: 16, flex: 1 },
    providerBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
    providerBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 9,
      color: "#fff",
      textTransform: "capitalize",
    },
    reviewRow: { alignItems: "center", gap: 6, marginTop: 2 },
    reviewScore: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
    reviewScoreText: { fontFamily: "Inter_700Bold", fontSize: 12, color: "#fff" },
    reviewCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
    address: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    amenitiesRow: { flexWrap: "wrap", gap: 6, marginTop: 2 },
    amenityChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    amenityText: { fontFamily: "Inter_400Regular", fontSize: 11 },
    priceRow: { alignItems: "center", justifyContent: "space-between", marginTop: 4 },
    price: { fontFamily: "Inter_700Bold", fontSize: 22 },
    perNight: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 1 },
    bookBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    bookBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
    emptyState: { alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 60 },
    emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
    emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, marginBottom: 14 },
    destGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    destCard: {
      width: "47%",
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
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    destCity: { fontFamily: "Inter_700Bold", fontSize: 14, color: "#fff" },
    destCountry: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.75)" },
    destPrice: { fontFamily: "Inter_500Medium", fontSize: 11, color: "#f0abfc", marginTop: 2 },
  });
}
