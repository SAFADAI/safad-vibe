import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGetLocalPlatforms } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  searchQuery: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  general: "shopping-bag",
  electronics: "cpu",
  fashion: "star",
  secondhand: "refresh-cw",
};

export function LocalStoresSection({ searchQuery }: Props) {
  const colors = useColors();
  const { language, tr, isRTL } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading } = useGetLocalPlatforms({
    lang: language,
  });

  if (!data?.platforms?.length && !isLoading) return null;

  const styles = makeStyles(colors, isRTL);

  const handleOpenStore = (platform: (typeof data.platforms)[0]) => {
    const url = platform.searchUrlTemplate.replace("{query}", encodeURIComponent(searchQuery || "trending"));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={[styles.headerLeft, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <View style={[styles.localBadge, { backgroundColor: colors.primary + "18" }]}>
            <Text style={styles.localBadgeText}>{data?.platforms?.[0]?.flag ?? "🏪"}</Text>
          </View>
          <View style={[{ flex: 1 }, isRTL && { alignItems: "flex-end" }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {tr.localStores?.title ?? "Local Stores"}
            </Text>
            {data?.country && (
              <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
                {data.country}
              </Text>
            )}
          </View>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>

      {expanded && (
        <>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              horizontal={false}
              data={data?.platforms ?? []}
              keyExtractor={(p) => p.id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={{ gap: 10 }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.platformCard, { backgroundColor: colors.card, borderColor: item.color + "44" }]}
                  onPress={() => handleOpenStore(item)}
                >
                  <View style={[styles.cardTop, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <View style={[styles.logoBox, { backgroundColor: item.color }]}>
                      <Text style={styles.logoText} numberOfLines={1}>
                        {item.logoText ?? item.name.slice(0, 3)}
                      </Text>
                    </View>
                    <View style={[styles.flagBadge]}>
                      <Text style={styles.flagText}>{item.flag}</Text>
                    </View>
                  </View>
                  <Text style={[styles.platformName, { color: colors.foreground }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={[styles.categoryRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Feather
                      name={(CATEGORY_ICONS[item.category ?? "general"] ?? "shopping-bag") as never}
                      size={10}
                      color={colors.mutedForeground}
                    />
                    <Text style={[styles.categoryText, { color: colors.mutedForeground }]}>
                      {item.category ?? "general"}
                    </Text>
                  </View>
                  {searchQuery ? (
                    <View style={[styles.searchBadge, { backgroundColor: item.color + "22" }]}>
                      <Text style={[styles.searchBadgeText, { color: item.color }]} numberOfLines={1}>
                        🔍 {searchQuery}
                      </Text>
                    </View>
                  ) : null}
                  <View style={[styles.openRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Text style={[styles.openText, { color: item.color }]}>
                      {tr.localStores?.open ?? "Open"}
                    </Text>
                    <Feather
                      name={isRTL ? "arrow-left" : "external-link"}
                      size={11}
                      color={item.color}
                    />
                  </View>
                </Pressable>
              )}
            />
          )}

          {data?.platforms && data.platforms.length > 0 && (
            <Text style={[styles.disclaimer, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
              {tr.localStores?.disclaimer ?? "Tap a store to search on their website"}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      backgroundColor: colors.card,
    },
    headerLeft: { alignItems: "center", gap: 10, flex: 1 },
    localBadge: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    localBadgeText: { fontSize: 20 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    sectionSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 1 },
    loading: { paddingVertical: 20, alignItems: "center" },
    grid: { padding: 10, gap: 10 },
    platformCard: {
      flex: 1,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1.5,
      gap: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTop: { alignItems: "center", justifyContent: "space-between" },
    logoBox: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      maxWidth: 80,
    },
    logoText: {
      fontFamily: "Inter_700Bold",
      fontSize: 11,
      color: "#fff",
      textTransform: "lowercase",
    },
    flagBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f1f5f9",
    },
    flagText: { fontSize: 14 },
    platformName: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
    categoryRow: { alignItems: "center", gap: 4 },
    categoryText: { fontFamily: "Inter_400Regular", fontSize: 10, textTransform: "capitalize" },
    searchBadge: {
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
    },
    searchBadgeText: { fontFamily: "Inter_400Regular", fontSize: 10 },
    openRow: { alignItems: "center", gap: 4, marginTop: 2 },
    openText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
    disclaimer: {
      fontFamily: "Inter_400Regular",
      fontSize: 11,
      paddingHorizontal: 14,
      paddingBottom: 12,
      backgroundColor: colors.card,
    },
  });
}
