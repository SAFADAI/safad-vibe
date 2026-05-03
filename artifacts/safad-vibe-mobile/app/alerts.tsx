import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetPriceAlerts,
  useDeletePriceAlert,
  useCreatePriceAlert,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/contexts/AlertsContext";

type AlertItem = {
  id: number;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  currency: string;
  platform?: string | null;
  isTriggered: boolean;
  createdAt: string;
};

function EditAlertModal({
  alert,
  onClose,
  colors,
  tr,
  isRTL,
}: {
  alert: AlertItem;
  onClose: () => void;
  colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>;
  tr: ReturnType<typeof import("@/contexts/LanguageContext")["useLanguage"]>["tr"];
  isRTL: boolean;
}) {
  const [targetInput, setTargetInput] = useState(String(alert.targetPrice));
  const { refetch: refetchGlobal } = useAlerts();

  const { mutate: deleteAlert, isPending: deleting } = useDeletePriceAlert({
    mutation: {
      onSuccess: () => {
        refetchGlobal();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onClose();
      },
    },
  });

  const { mutate: createAlert, isPending: creating } = useCreatePriceAlert({
    mutation: {
      onSuccess: () => {
        refetchGlobal();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onClose();
      },
    },
  });

  const handleUpdate = () => {
    const newTarget = parseFloat(targetInput.replace(",", "."));
    if (isNaN(newTarget) || newTarget <= 0) {
      Alert.alert(tr.priceAlert.invalidPrice);
      return;
    }
    deleteAlert({ id: alert.id });
    createAlert({
      data: {
        productTitle: alert.productTitle,
        targetPrice: newTarget,
        currentPrice: alert.currentPrice,
        currency: alert.currency,
        platform: alert.platform ?? undefined,
      },
    });
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      gap: 20,
    },
    title: { fontFamily: "Inter_700Bold", fontSize: 18, color: colors.foreground },
    productName: { fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
    label: { fontFamily: "Inter_500Medium", fontSize: 14, color: colors.foreground },
    inputRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 8,
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    currencyLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.mutedForeground },
    input: { flex: 1, fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground },
    quickRow: { flexDirection: isRTL ? "row-reverse" : "row", gap: 8 },
    quickBtn: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, gap: 3 },
    quickBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: colors.foreground },
    quickBtnPrice: { fontFamily: "Inter_400Regular", fontSize: 10, color: colors.primary },
    updateBtn: { flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 16, backgroundColor: colors.primary },
    updateBtnText: { fontFamily: "Inter_700Bold", fontSize: 17, color: "#fff" },
    deleteBtn: { flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderRadius: 14, paddingVertical: 13, borderColor: "#ef444460" },
    deleteBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#ef4444" },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 4 },
  });

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={[{ alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                <Text style={styles.title}>{tr.myAlerts?.editAlert ?? "Edit Alert"}</Text>
                <Text style={styles.productName} numberOfLines={2}>{alert.productTitle}</Text>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
                  {tr.priceAlert.targetPrice} ({alert.currency})
                </Text>
                <View style={styles.inputRow}>
                  <Text style={styles.currencyLabel}>{alert.currency}</Text>
                  <TextInput
                    style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                    value={targetInput}
                    onChangeText={setTargetInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
                <View style={styles.quickRow}>
                  {[5, 10, 15, 20].map((pct) => (
                    <Pressable
                      key={pct}
                      style={styles.quickBtn}
                      onPress={() => setTargetInput((alert.currentPrice * (1 - pct / 100)).toFixed(2))}
                    >
                      <Text style={styles.quickBtnText}>-{pct}%</Text>
                      <Text style={styles.quickBtnPrice}>
                        {alert.currency}{(alert.currentPrice * (1 - pct / 100)).toFixed(0)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable style={styles.updateBtn} onPress={handleUpdate} disabled={creating || deleting}>
                {creating || deleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="check" size={18} color="#fff" />
                    <Text style={styles.updateBtnText}>{tr.myAlerts?.saveBtn ?? "Save Changes"}</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={styles.deleteBtn}
                onPress={() => {
                  Alert.alert(
                    tr.myAlerts?.confirmDelete ?? "Remove alert?",
                    tr.myAlerts?.confirmDeleteMsg ?? "This alert will be permanently removed.",
                    [
                      { text: tr.priceAlert.deleteBtn, style: "destructive", onPress: () => deleteAlert({ id: alert.id }) },
                      { text: tr.camera.cancel, style: "cancel" },
                    ]
                  );
                }}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <>
                    <Feather name="trash-2" size={16} color="#ef4444" />
                    <Text style={styles.deleteBtnText}>{tr.priceAlert.deleteBtn}</Text>
                  </>
                )}
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function AlertCard({
  item,
  colors,
  tr,
  isRTL,
  onEdit,
}: {
  item: AlertItem;
  colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>;
  tr: ReturnType<typeof import("@/contexts/LanguageContext")["useLanguage"]>["tr"];
  isRTL: boolean;
  onEdit: (item: AlertItem) => void;
}) {
  const savings = item.currentPrice - item.targetPrice;
  const savingsPct = ((savings / item.currentPrice) * 100).toFixed(0);

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: item.isTriggered ? "#f0fdf4" : colors.card,
          borderColor: item.isTriggered ? "#22c55e" : colors.border,
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEdit(item);
      }}
    >
      {/* Status strip */}
      <View style={[styles.statusStrip, { backgroundColor: item.isTriggered ? "#22c55e" : colors.primary }]} />

      <View style={{ flex: 1, gap: 8 }}>
        {/* Title row */}
        <View style={[styles.row, { flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between" }]}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.productTitle, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}
              numberOfLines={2}
            >
              {item.productTitle}
            </Text>
            {item.platform && (
              <Text style={[styles.platform, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
                {item.platform}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.isTriggered ? "#dcfce7" : colors.primary + "18" },
            ]}
          >
            <Feather
              name={item.isTriggered ? "check-circle" : "bell"}
              size={12}
              color={item.isTriggered ? "#16a34a" : colors.primary}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.isTriggered ? "#16a34a" : colors.primary },
              ]}
            >
              {item.isTriggered ? (tr.priceAlert.triggered) : (tr.priceAlert.activeTitle)}
            </Text>
          </View>
        </View>

        {/* Price info */}
        <View style={[styles.priceGrid, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <View style={[styles.priceBox, { backgroundColor: colors.muted }]}>
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>{tr.priceAlert.currentPrice}</Text>
            <Text style={[styles.priceValue, { color: colors.foreground }]}>
              {item.currency} {item.currentPrice.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.arrow]}>
            <Feather name="arrow-right" size={16} color={colors.mutedForeground} />
          </View>
          <View
            style={[
              styles.priceBox,
              {
                backgroundColor: item.isTriggered ? "#dcfce7" : colors.primary + "12",
              },
            ]}
          >
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>{tr.priceAlert.targetPrice}</Text>
            <Text
              style={[
                styles.priceValue,
                { color: item.isTriggered ? "#16a34a" : colors.primary },
              ]}
            >
              {item.currency} {item.targetPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Savings banner */}
        {savings > 0 && (
          <View style={[styles.savingsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Feather name="trending-down" size={13} color={item.isTriggered ? "#16a34a" : colors.primary} />
            <Text style={[styles.savingsText, { color: item.isTriggered ? "#16a34a" : colors.primary }]}>
              {tr.priceAlert.savingsOf} {item.currency} {savings.toFixed(2)} ({savingsPct}%)
            </Text>
          </View>
        )}

        {/* Triggered banner */}
        {item.isTriggered && (
          <View style={styles.triggeredBanner}>
            <Text style={styles.triggeredBannerText}>
              🎉 {tr.priceAlert.triggeredTitle}
            </Text>
          </View>
        )}

        {/* Edit hint */}
        <View style={[styles.editHint, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Feather name="edit-2" size={11} color={colors.mutedForeground} />
          <Text style={[styles.editHintText, { color: colors.mutedForeground }]}>
            {tr.myAlerts?.tapToEdit ?? "Tap to edit target price"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tr, isRTL } = useLanguage();
  const { refetch: refetchGlobal } = useAlerts();
  const [editingAlert, setEditingAlert] = useState<AlertItem | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "triggered" | "active">("all");

  const { data, isLoading, refetch, isRefetching } = useGetPriceAlerts({
    refetchInterval: 15000,
  });

  const allAlerts: AlertItem[] = (data?.alerts ?? []) as AlertItem[];
  const triggered = allAlerts.filter((a) => a.isTriggered);
  const active = allAlerts.filter((a) => !a.isTriggered);

  const displayed =
    activeTab === "triggered" ? triggered : activeTab === "active" ? active : allAlerts;

  const { mutate: deleteAll, isPending: deletingAll } = useDeletePriceAlert({
    mutation: {
      onSuccess: () => {
        refetch();
        refetchGlobal();
      },
    },
  });

  const handleClearTriggered = () => {
    Alert.alert(
      tr.myAlerts?.clearTriggered ?? "Clear triggered alerts?",
      tr.myAlerts?.clearTriggeredMsg ?? "All triggered alerts will be removed.",
      [
        {
          text: tr.myAlerts?.clearBtn ?? "Clear all",
          style: "destructive",
          onPress: () => {
            triggered.forEach((a) => deleteAll({ id: a.id }));
          },
        },
        { text: tr.camera.cancel, style: "cancel" },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          headerStyles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={22}
            color={colors.foreground}
          />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[headerStyles.title, { color: colors.foreground }]}>
            {tr.myAlerts?.title ?? "My Alerts"}
          </Text>
          {allAlerts.length > 0 && (
            <Text style={[headerStyles.subtitle, { color: colors.mutedForeground }]}>
              {allAlerts.length} {tr.priceAlert.badge}
              {triggered.length > 0 && ` · ${triggered.length} ${tr.myAlerts?.triggered ?? "triggered"}`}
            </Text>
          )}
        </View>
        {triggered.length > 0 && (
          <Pressable onPress={handleClearTriggered} hitSlop={8} disabled={deletingAll}>
            {deletingAll ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Feather name="trash-2" size={20} color="#ef4444" />
            )}
          </Pressable>
        )}
        {triggered.length === 0 && <View style={{ width: 22 }} />}
      </View>

      {/* Tab filter */}
      {allAlerts.length > 0 && (
        <View
          style={[
            headerStyles.tabRow,
            {
              backgroundColor: colors.card,
              borderBottomColor: colors.border,
              flexDirection: isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          {(["all", "triggered", "active"] as const).map((tab) => {
            const count =
              tab === "all" ? allAlerts.length : tab === "triggered" ? triggered.length : active.length;
            const label =
              tab === "all"
                ? (tr.myAlerts?.tabAll ?? "All")
                : tab === "triggered"
                ? (tr.myAlerts?.tabTriggered ?? "Triggered")
                : (tr.myAlerts?.tabActive ?? "Active");
            return (
              <Pressable
                key={tab}
                style={[
                  headerStyles.tabBtn,
                  activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    headerStyles.tabLabel,
                    {
                      color: activeTab === tab ? colors.primary : colors.mutedForeground,
                      fontFamily: activeTab === tab ? "Inter_700Bold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {label}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      headerStyles.tabBadge,
                      {
                        backgroundColor:
                          tab === "triggered" ? "#22c55e" : activeTab === tab ? colors.primary : colors.muted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        headerStyles.tabBadgeText,
                        {
                          color:
                            tab === "triggered" || activeTab === tab
                              ? "#fff"
                              : colors.mutedForeground,
                        },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : displayed.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
        >
          <View style={[emptyStyles.iconCircle, { backgroundColor: colors.muted }]}>
            <Feather name="bell-off" size={40} color={colors.mutedForeground} />
          </View>
          <Text style={[emptyStyles.title, { color: colors.foreground }]}>
            {tr.myAlerts?.noAlerts ?? "No alerts yet"}
          </Text>
          <Text style={[emptyStyles.sub, { color: colors.mutedForeground }]}>
            {tr.myAlerts?.noAlertsMsg ?? "Set alerts on product cards to get notified when prices drop."}
          </Text>
          <Pressable
            style={[emptyStyles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Feather name="shopping-bag" size={16} color="#fff" />
            <Text style={emptyStyles.backBtnText}>{tr.myAlerts?.browseProducts ?? "Browse Products"}</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <AlertCard
              item={item}
              colors={colors}
              tr={tr}
              isRTL={isRTL}
              onEdit={setEditingAlert}
            />
          )}
        />
      )}

      {editingAlert && (
        <EditAlertModal
          alert={editingAlert}
          onClose={() => setEditingAlert(null)}
          colors={colors}
          tr={tr}
          isRTL={isRTL}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statusStrip: { width: 4 },
  row: { alignItems: "flex-start", gap: 8 },
  productTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, lineHeight: 20, flex: 1 },
  platform: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
    flexShrink: 0,
  },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  priceGrid: { gap: 8, alignItems: "center" },
  priceBox: { flex: 1, padding: 10, borderRadius: 10, gap: 3 },
  priceLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  priceValue: { fontFamily: "Inter_700Bold", fontSize: 16 },
  arrow: { alignItems: "center" },
  savingsRow: { alignItems: "center", gap: 6 },
  savingsText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  triggeredBanner: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  triggeredBannerText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#fff" },
  editHint: { alignItems: "center", gap: 5 },
  editHintText: { fontFamily: "Inter_400Regular", fontSize: 11 },
});

// inner padding for the card content
const cardContentStyle = { flex: 1, padding: 14, gap: 8 };

const headerStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 18 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  tabLabel: { fontSize: 13 },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  tabBadgeText: { fontFamily: "Inter_700Bold", fontSize: 10 },
});

const emptyStyles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, textAlign: "center" },
  sub: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", lineHeight: 20, maxWidth: 280 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  backBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
});
