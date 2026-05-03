import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  useSearchFlights,
  useGetPopularRoutes,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

type CabinClass = "economy" | "premium_economy" | "business" | "first";

const PROVIDER_COLORS: Record<string, string> = {
  amadeus: "#0ea5e9",
  skyscanner: "#06b6d4",
  kiwi: "#22c55e",
};

function formatDuration(d: string) {
  return d.replace("PT", "").replace("H", "h ").replace("M", "m");
}

function formatTime(dt: string) {
  try {
    const date = new Date(dt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return dt;
  }
}

export default function FlightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tr, isRTL } = useLanguage();
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = Platform.OS === "web" ? 84 : 68;

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [adults, setAdults] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [searching, setSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<null | {
    origin: string;
    destination: string;
    departureDate: string;
    adults: number;
    cabinClass: CabinClass;
  }>(null);

  const CABIN_CLASSES: { key: CabinClass; label: string }[] = [
    { key: "economy", label: tr.cabin.economy },
    { key: "premium_economy", label: tr.cabin.premium },
    { key: "business", label: tr.cabin.business },
    { key: "first", label: tr.cabin.first },
  ];

  const { data: popularRoutes } = useGetPopularRoutes({ region: "GLOBAL" });

  const { data: flightResults, isLoading: flightsLoading } = useSearchFlights(
    {
      origin: searchParams?.origin ?? "",
      destination: searchParams?.destination ?? "",
      departureDate: searchParams?.departureDate ?? "",
      adults: searchParams?.adults ?? 1,
      cabinClass: searchParams?.cabinClass ?? "economy",
    },
    { enabled: !!searchParams }
  );

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearchParams({ origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, adults, cabinClass });
    setSearching(true);
  };

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{tr.flights.title}</Text>

        <View style={styles.routeRow}>
          <View style={[styles.inputBox, { backgroundColor: colors.muted, flex: 1 }]}>
            <Feather name="map-pin" size={14} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputText, { color: colors.foreground }]}
              placeholder={tr.flights.from}
              placeholderTextColor={colors.mutedForeground}
              value={origin}
              onChangeText={(t) => setOrigin(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={3}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>
          <Pressable
            style={[styles.swapBtn, { backgroundColor: colors.muted }]}
            onPress={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
              Haptics.selectionAsync();
            }}
          >
            <Feather name="repeat" size={16} color={colors.primary} />
          </Pressable>
          <View style={[styles.inputBox, { backgroundColor: colors.muted, flex: 1 }]}>
            <Feather name="flag" size={14} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputText, { color: colors.foreground }]}
              placeholder={tr.flights.to}
              placeholderTextColor={colors.mutedForeground}
              value={destination}
              onChangeText={(t) => setDestination(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={3}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={[styles.inputBox, { backgroundColor: colors.muted, flex: 1 }]}>
            <Feather name="calendar" size={14} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputText, { color: colors.foreground }]}
              placeholder={tr.flights.date}
              placeholderTextColor={colors.mutedForeground}
              value={departureDate}
              onChangeText={setDepartureDate}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>
          <View style={[styles.counterBox, { backgroundColor: colors.muted }]}>
            <Pressable onPress={() => setAdults(Math.max(1, adults - 1))}>
              <Feather name="minus" size={14} color={colors.primary} />
            </Pressable>
            <Text style={[styles.counterText, { color: colors.foreground }]}>{adults}</Text>
            <Pressable onPress={() => setAdults(Math.min(9, adults + 1))}>
              <Feather name="plus" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        <FlatList
          horizontal
          data={CABIN_CLASSES}
          keyExtractor={(c) => c.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterChip,
                {
                  backgroundColor: cabinClass === item.key ? colors.primary : colors.muted,
                  borderColor: cabinClass === item.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => { setCabinClass(item.key); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.filterChipText, { color: cabinClass === item.key ? "#fff" : colors.mutedForeground }]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />

        <Pressable
          style={[styles.searchBtn, { backgroundColor: colors.primary, opacity: (!origin || !destination) ? 0.5 : 1 }]}
          onPress={handleSearch}
          disabled={!origin.trim() || !destination.trim()}
        >
          <Feather name="search" size={16} color="#fff" />
          <Text style={styles.searchBtnText}>{tr.flights.searchBtn}</Text>
        </Pressable>
      </View>

      {searching && flightsLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>{tr.flights.searchingFlights}</Text>
        </View>
      ) : searching && flightResults ? (
        <FlatList
          data={flightResults.results}
          keyExtractor={(f) => f.id}
          contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.flightCard, { backgroundColor: colors.card }]}>
              <View style={styles.flightHeader}>
                <Text style={[styles.airline, { color: colors.foreground }]}>{item.airline}</Text>
                {item.flightNumber && (
                  <Text style={[styles.flightNum, { color: colors.mutedForeground }]}>{item.flightNumber}</Text>
                )}
                <View style={[styles.providerBadge, { backgroundColor: PROVIDER_COLORS[item.provider] ?? colors.accent }]}>
                  <Text style={styles.providerBadgeText}>{item.provider}</Text>
                </View>
              </View>
              <View style={styles.flightTimes}>
                <View style={[styles.timeBlock, isRTL && { alignItems: "flex-end" }]}>
                  <Text style={[styles.time, { color: colors.foreground }]}>{formatTime(item.departureTime)}</Text>
                  <Text style={[styles.airport, { color: colors.mutedForeground }]}>{item.origin}</Text>
                </View>
                <View style={styles.durationBlock}>
                  <Text style={[styles.duration, { color: colors.mutedForeground }]}>{formatDuration(item.duration)}</Text>
                  <View style={styles.durationLine}>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                    <Feather name="navigation" size={12} color={colors.primary} />
                  </View>
                  <Text style={[styles.stopsText, { color: item.stops === 0 ? colors.primary : colors.secondary }]}>
                    {item.stops === 0 ? tr.flights.direct : `${item.stops} ${item.stops === 1 ? tr.flights.stop : tr.flights.stops}`}
                  </Text>
                </View>
                <View style={[styles.timeBlock, { alignItems: isRTL ? "flex-start" : "flex-end" }]}>
                  <Text style={[styles.time, { color: colors.foreground }]}>{formatTime(item.arrivalTime)}</Text>
                  <Text style={[styles.airport, { color: colors.mutedForeground }]}>{item.destination}</Text>
                </View>
              </View>
              <View style={[styles.flightFooter, isRTL && { flexDirection: "row-reverse" }]}>
                <View>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {item.currency} {item.price.toFixed(2)}
                  </Text>
                  {item.baggageIncluded && (
                    <Text style={[styles.baggage, { color: colors.mutedForeground }]}>{tr.flights.baggageIncluded}</Text>
                  )}
                </View>
                <Pressable
                  style={[styles.bookBtn, { backgroundColor: colors.secondary }]}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                >
                  <Text style={styles.bookBtnText}>{tr.flights.book}</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="navigation" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{tr.flights.noResults}</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{tr.flights.tryDifferent}</Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>
            {tr.flights.popularRoutes}
          </Text>
          {popularRoutes?.routes.map((route) => (
            <Pressable
              key={`${route.origin}-${route.destination}`}
              style={[styles.popularCard, { backgroundColor: colors.card, flexDirection: isRTL ? "row-reverse" : "row" }]}
              onPress={() => {
                setOrigin(route.origin);
                setDestination(route.destination);
                Haptics.selectionAsync();
              }}
            >
              <View style={[styles.popularLeft, isRTL && { alignItems: "flex-end" }]}>
                <View style={[styles.popularRoute, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Text style={[styles.popularCode, { color: colors.foreground }]}>{route.origin}</Text>
                  <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={14} color={colors.mutedForeground} />
                  <Text style={[styles.popularCode, { color: colors.foreground }]}>{route.destination}</Text>
                </View>
                {(route.originCity || route.destinationCity) && (
                  <Text style={[styles.popularCities, { color: colors.mutedForeground }]}>
                    {route.originCity} → {route.destinationCity}
                  </Text>
                )}
              </View>
              <View style={[styles.popularRight, isRTL && { alignItems: "flex-start" }]}>
                <Text style={[styles.popularPrice, { color: colors.primary }]}>
                  {route.currency} {route.lowestPrice}
                </Text>
                <Text style={[styles.popularPriceLabel, { color: colors.mutedForeground }]}>{tr.flights.from}</Text>
              </View>
            </Pressable>
          ))}
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
    routeRow: { flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "center" },
    detailRow: { flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "center" },
    inputBox: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 6,
    },
    inputText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
    swapBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
    counterBox: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 10,
    },
    counterText: { fontFamily: "Inter_600SemiBold", fontSize: 14, minWidth: 16, textAlign: "center" },
    filterRow: { gap: 8, paddingBottom: 10 },
    filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    filterChipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
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
    flightCard: {
      borderRadius: 14,
      padding: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    flightHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    airline: { fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 },
    flightNum: { fontFamily: "Inter_400Regular", fontSize: 12 },
    providerBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
    providerBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 9,
      color: "#fff",
      textTransform: "capitalize",
    },
    flightTimes: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    timeBlock: { flex: 1 },
    time: { fontFamily: "Inter_700Bold", fontSize: 20 },
    airport: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    durationBlock: { flex: 1, alignItems: "center" },
    duration: { fontFamily: "Inter_400Regular", fontSize: 11, marginBottom: 4 },
    durationLine: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
    line: { flex: 1, height: 1 },
    stopsText: { fontFamily: "Inter_500Medium", fontSize: 11 },
    flightFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    price: { fontFamily: "Inter_700Bold", fontSize: 20 },
    baggage: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
    bookBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    bookBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
    emptyState: { alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 60 },
    emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
    emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, marginBottom: 14 },
    popularCard: {
      alignItems: "center",
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    popularLeft: { flex: 1 },
    popularRoute: { alignItems: "center", gap: 8 },
    popularCode: { fontFamily: "Inter_700Bold", fontSize: 18 },
    popularCities: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 3 },
    popularRight: { alignItems: "flex-end" },
    popularPrice: { fontFamily: "Inter_700Bold", fontSize: 16 },
    popularPriceLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  });
}
