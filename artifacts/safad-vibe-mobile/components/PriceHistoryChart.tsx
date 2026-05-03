import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGetProductPriceHistory } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#f97316",
  ebay: "#3b82f6",
  aliexpress: "#ef4444",
};

const DAYS_OPTIONS = [7, 30, 60, 90] as const;

interface Props {
  productTitle: string;
  currentPrice: number;
  currency: string;
}

function MiniLineChart({
  points,
  width,
  height,
  color,
}: {
  points: number[];
  width: number;
  height: number;
  color: string;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 6;

  const normalized = points.map((p) => ((p - min) / range) * (height - pad * 2) + pad);
  const xStep = (width - pad * 2) / (points.length - 1);

  return (
    <View style={{ width, height, position: "relative" }}>
      {points.map((_, i) => {
        if (i === 0) return null;
        const x1 = pad + (i - 1) * xStep;
        const y1 = height - normalized[i - 1];
        const x2 = pad + i * xStep;
        const y2 = height - normalized[i];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: x1,
              top: y1 - 1,
              width: len,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: "0 50%",
            }}
          />
        );
      })}
      {/* Last dot */}
      <View
        style={{
          position: "absolute",
          left: pad + (points.length - 1) * xStep - 4,
          top: height - normalized[normalized.length - 1] - 4,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />
    </View>
  );
}

export function PriceHistoryChart({ productTitle, currentPrice, currency }: Props) {
  const colors = useColors();
  const { tr, isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [days, setDays] = useState<7 | 30 | 60 | 90>(30);
  const [activePlatform, setActivePlatform] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetProductPriceHistory(
    { query: productTitle, days, ...(activePlatform ? { platform: activePlatform as "amazon" | "ebay" | "aliexpress" } : {}) },
    { enabled: visible }
  );

  const styles = makeStyles(colors, isRTL);

  const priceSavings = data ? ((data.highestPrice - data.currentPrice) / data.highestPrice) * 100 : 0;

  // Group points by platform for separate mini-charts
  const byPlatform: Record<string, number[]> = {};
  (data?.points ?? []).forEach((p) => {
    if (!byPlatform[p.platform]) byPlatform[p.platform] = [];
    byPlatform[p.platform].push(p.price);
  });

  return (
    <>
      <Pressable
        style={[styles.triggerBtn, { borderColor: colors.border }]}
        onPress={() => setVisible(true)}
      >
        <Feather name="trending-down" size={13} color={colors.primary} />
        <Text style={[styles.triggerText, { color: colors.primary }]}>
          {tr.priceHistory?.chart ?? "Price History"}
        </Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setVisible(false)}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={[{ flex: 1 }, isRTL && { alignItems: "flex-end" }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]} numberOfLines={1}>
                {productTitle}
              </Text>
              <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                {tr.priceHistory?.title ?? "Price History"}
              </Text>
            </View>
            <Pressable onPress={() => setVisible(false)} hitSlop={12}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            {/* Day selector */}
            <View style={[styles.daysRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              {DAYS_OPTIONS.map((d) => (
                <Pressable
                  key={d}
                  style={[styles.dayChip, { backgroundColor: days === d ? colors.primary : colors.muted, borderColor: days === d ? colors.primary : colors.border }]}
                  onPress={() => setDays(d)}
                >
                  <Text style={[styles.dayChipText, { color: days === d ? "#fff" : colors.mutedForeground }]}>
                    {d}{tr.priceHistory?.days ?? "d"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Platform selector */}
            <View style={[styles.daysRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Pressable
                style={[styles.dayChip, { backgroundColor: !activePlatform ? colors.accent : colors.muted, borderColor: !activePlatform ? colors.accent : colors.border }]}
                onPress={() => setActivePlatform(undefined)}
              >
                <Text style={[styles.dayChipText, { color: !activePlatform ? "#fff" : colors.mutedForeground }]}>
                  {tr.priceHistory?.allPlatforms ?? "All"}
                </Text>
              </Pressable>
              {["amazon", "ebay", "aliexpress"].map((p) => (
                <Pressable
                  key={p}
                  style={[styles.dayChip, { backgroundColor: activePlatform === p ? PLATFORM_COLORS[p] : colors.muted, borderColor: activePlatform === p ? PLATFORM_COLORS[p] : colors.border }]}
                  onPress={() => setActivePlatform(p)}
                >
                  <Text style={[styles.dayChipText, { color: activePlatform === p ? "#fff" : colors.mutedForeground }]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            {isLoading ? (
              <View style={styles.centered}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[{ color: colors.mutedForeground, fontSize: 13, fontFamily: "Inter_400Regular" }]}>
                  {tr.priceHistory?.loading ?? "Loading price history..."}
                </Text>
              </View>
            ) : data ? (
              <>
                {/* Stats row */}
                <View style={[styles.statsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{tr.priceHistory?.current ?? "Current"}</Text>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                      {currency} {data.currentPrice.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{tr.priceHistory?.lowest ?? "Lowest"}</Text>
                    <Text style={[styles.statValue, { color: "#22c55e" }]}>
                      {currency} {data.lowestPrice.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{tr.priceHistory?.highest ?? "Highest"}</Text>
                    <Text style={[styles.statValue, { color: "#ef4444" }]}>
                      {currency} {data.highestPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Savings badge */}
                {priceSavings > 1 && (
                  <View style={[styles.savingsBadge, { backgroundColor: "#dcfce7" }]}>
                    <Feather name="trending-down" size={14} color="#16a34a" />
                    <Text style={[styles.savingsText, { color: "#16a34a" }]}>
                      {tr.priceHistory?.savings ?? "You could save"} {priceSavings.toFixed(0)}% {tr.priceHistory?.fromPeak ?? "from peak price"}
                    </Text>
                  </View>
                )}

                {/* Charts per platform */}
                {Object.entries(byPlatform).map(([platform, pricePoints]) => (
                  <View key={platform} style={[styles.chartCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.chartHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <View style={[styles.platformDot, { backgroundColor: PLATFORM_COLORS[platform] ?? colors.accent }]} />
                      <Text style={[styles.chartPlatformName, { color: colors.foreground }]}>{platform}</Text>
                      <Text style={[styles.chartCurrentPrice, { color: PLATFORM_COLORS[platform] ?? colors.primary }]}>
                        {currency} {pricePoints[pricePoints.length - 1]?.toFixed(2)}
                      </Text>
                    </View>
                    <MiniLineChart
                      points={pricePoints}
                      width={340}
                      height={80}
                      color={PLATFORM_COLORS[platform] ?? colors.primary}
                    />
                    <View style={[styles.chartFooter, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <Text style={[styles.chartMinMax, { color: "#22c55e" }]}>
                        ↓ {currency}{Math.min(...pricePoints).toFixed(2)}
                      </Text>
                      <Text style={[styles.chartMinMax, { color: "#ef4444" }]}>
                        ↑ {currency}{Math.max(...pricePoints).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Recommendation */}
                <View style={[styles.recommendationCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "33" }]}>
                  <Feather name="info" size={16} color={colors.primary} />
                  <Text style={[styles.recommendationText, { color: colors.foreground }]}>
                    {data.currentPrice <= data.lowestPrice * 1.05
                      ? (tr.priceHistory?.greatTime ?? "Great time to buy — price is near its lowest!")
                      : data.currentPrice >= data.highestPrice * 0.95
                      ? (tr.priceHistory?.waitTime ?? "Price is near its peak, consider waiting.")
                      : (tr.priceHistory?.avgTime ?? "Price is in the average range.")}
                  </Text>
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    triggerBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      alignSelf: "flex-start",
      marginTop: 4,
    },
    triggerText: { fontFamily: "Inter_500Medium", fontSize: 11 },
    modal: { flex: 1 },
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
    modalSub: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
    daysRow: { flexWrap: "wrap", gap: 8 },
    dayChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
    dayChipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
    centered: { alignItems: "center", gap: 10, paddingVertical: 40 },
    statsRow: { gap: 10 },
    statCard: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, marginBottom: 4 },
    statValue: { fontFamily: "Inter_700Bold", fontSize: 15 },
    savingsBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 10,
    },
    savingsText: { fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 },
    chartCard: {
      borderRadius: 14,
      padding: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
      overflow: "hidden",
    },
    chartHeader: { alignItems: "center", gap: 8, marginBottom: 10 },
    platformDot: { width: 10, height: 10, borderRadius: 5 },
    chartPlatformName: { fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1, textTransform: "capitalize" },
    chartCurrentPrice: { fontFamily: "Inter_700Bold", fontSize: 15 },
    chartFooter: { justifyContent: "space-between", marginTop: 8 },
    chartMinMax: { fontFamily: "Inter_500Medium", fontSize: 11 },
    recommendationCard: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
    },
    recommendationText: { fontFamily: "Inter_400Regular", fontSize: 13, flex: 1, lineHeight: 18 },
  });
}
