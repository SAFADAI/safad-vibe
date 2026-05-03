import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useGetPriceAlerts,
  useCreatePriceAlert,
  useDeletePriceAlert,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlerts } from "@/contexts/AlertsContext";

interface Props {
  productTitle: string;
  currentPrice: number;
  currency: string;
  platform?: string;
}

export function PriceAlertButton({ productTitle, currentPrice, currency, platform }: Props) {
  const colors = useColors();
  const { tr, isRTL } = useLanguage();
  const { refetch: refetchGlobal } = useAlerts();
  const [visible, setVisible] = useState(false);
  const [targetInput, setTargetInput] = useState(String((currentPrice * 0.9).toFixed(2)));

  const { data: alertsData, refetch } = useGetPriceAlerts({ enabled: visible });
  const { mutate: createAlert, isPending: creating } = useCreatePriceAlert({
    mutation: {
      onSuccess: () => {
        refetch();
        refetchGlobal();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    },
  });
  const { mutate: deleteAlert, isPending: deleting } = useDeletePriceAlert({
    mutation: {
      onSuccess: () => {
        refetch();
        refetchGlobal();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      },
    },
  });

  const existingAlert = alertsData?.alerts.find(
    (a) => a.productTitle.toLowerCase() === productTitle.toLowerCase()
  );

  const isTriggered = existingAlert?.isTriggered;
  const hasAlert = !!existingAlert;

  const styles = makeStyles(colors, isRTL);

  const handleCreate = () => {
    const targetPrice = parseFloat(targetInput.replace(",", "."));
    if (isNaN(targetPrice) || targetPrice <= 0) {
      Alert.alert(tr.priceAlert.invalidPrice ?? "Invalid price");
      return;
    }
    createAlert({
      data: { productTitle, targetPrice, currentPrice, currency, platform },
    });
  };

  const handleDelete = () => {
    if (!existingAlert) return;
    deleteAlert({ id: existingAlert.id });
  };

  return (
    <>
      <Pressable
        style={[
          styles.triggerBtn,
          {
            borderColor: isTriggered
              ? "#22c55e"
              : hasAlert
              ? colors.primary
              : colors.border,
            backgroundColor: isTriggered
              ? "#dcfce7"
              : hasAlert
              ? colors.primary + "18"
              : "transparent",
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setVisible(true);
        }}
      >
        <Feather
          name={isTriggered ? "bell" : hasAlert ? "bell" : "bell-off"}
          size={11}
          color={isTriggered ? "#16a34a" : hasAlert ? colors.primary : colors.mutedForeground}
        />
        {isTriggered && (
          <View style={styles.triggeredDot} />
        )}
        <Text
          style={[
            styles.triggerText,
            {
              color: isTriggered
                ? "#16a34a"
                : hasAlert
                ? colors.primary
                : colors.mutedForeground,
            },
          ]}
        >
          {isTriggered
            ? (tr.priceAlert?.triggered ?? "Price Dropped!")
            : hasAlert
            ? `${currency} ${existingAlert.targetPrice}`
            : (tr.priceAlert?.setAlert ?? "Set Alert")}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={[{ flex: 1 }, isRTL && { alignItems: "flex-end" }]}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {tr.priceAlert?.title ?? "Price Alert"}
                </Text>
                <Text style={[styles.modalSub, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {productTitle}
                </Text>
              </View>
              <Pressable onPress={() => setVisible(false)} hitSlop={14}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
              {/* Current price display */}
              <View style={[styles.currentPriceCard, { backgroundColor: colors.card }]}>
                <View style={[{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between" }]}>
                  <Text style={[styles.currentLabel, { color: colors.mutedForeground }]}>
                    {tr.priceAlert?.currentPrice ?? "Current Price"}
                  </Text>
                  <Text style={[styles.currentValue, { color: colors.primary }]}>
                    {currency} {currentPrice.toFixed(2)}
                  </Text>
                </View>
                {platform && (
                  <View style={[{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4, marginTop: 6 }]}>
                    <Feather name="tag" size={11} color={colors.mutedForeground} />
                    <Text style={[{ color: colors.mutedForeground, fontSize: 12, fontFamily: "Inter_400Regular" }]}>
                      {platform}
                    </Text>
                  </View>
                )}
              </View>

              {hasAlert ? (
                <>
                  {/* Existing alert card */}
                  <View style={[styles.existingAlertCard, {
                    backgroundColor: isTriggered ? "#dcfce7" : colors.primary + "12",
                    borderColor: isTriggered ? "#22c55e" : colors.primary + "44",
                  }]}>
                    <View style={[{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }]}>
                      <View style={[styles.alertIconCircle, { backgroundColor: isTriggered ? "#16a34a" : colors.primary }]}>
                        <Feather name="bell" size={18} color="#fff" />
                      </View>
                      <View style={[{ flex: 1 }, isRTL && { alignItems: "flex-end" }]}>
                        <Text style={[styles.alertStatusTitle, { color: isTriggered ? "#16a34a" : colors.foreground }]}>
                          {isTriggered
                            ? (tr.priceAlert?.triggeredTitle ?? "Price Dropped! 🎉")
                            : (tr.priceAlert?.activeTitle ?? "Alert Active")}
                        </Text>
                        <Text style={[styles.alertStatusSub, { color: colors.mutedForeground }]}>
                          {tr.priceAlert?.alertWhen ?? "Alert when below"}{" "}
                          <Text style={{ fontFamily: "Inter_700Bold", color: isTriggered ? "#16a34a" : colors.primary }}>
                            {currency} {existingAlert?.targetPrice.toFixed(2)}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {isTriggered && (
                      <View style={[styles.savingsBanner, { backgroundColor: "#16a34a" }]}>
                        <Text style={styles.savingsText}>
                          🎯 {tr.priceAlert?.nowBelow ?? "Current price is now at or below your target!"}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Delete button */}
                  <Pressable
                    style={[styles.deleteBtn, { borderColor: "#ef444460" }]}
                    onPress={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <ActivityIndicator size="small" color="#ef4444" />
                    ) : (
                      <>
                        <Feather name="trash-2" size={16} color="#ef4444" />
                        <Text style={[styles.deleteBtnText, { color: "#ef4444" }]}>
                          {tr.priceAlert?.deleteBtn ?? "Remove Alert"}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </>
              ) : (
                <>
                  {/* How it works */}
                  <View style={[styles.howItWorks, { backgroundColor: colors.muted }]}>
                    <Feather name="info" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.howItWorksText, { color: colors.mutedForeground }]}>
                      {tr.priceAlert?.howItWorks ?? "We'll mark this alert when the price reaches your target."}
                    </Text>
                  </View>

                  {/* Target price input */}
                  <View style={{ gap: 8 }}>
                    <Text style={[styles.inputLabel, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>
                      {tr.priceAlert?.targetPrice ?? "Target Price"} ({currency})
                    </Text>
                    <View style={[styles.inputRow, { flexDirection: isRTL ? "row-reverse" : "row", borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.currencyLabel, { color: colors.mutedForeground }]}>
                        {currency}
                      </Text>
                      <TextInput
                        style={[styles.priceInput, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}
                        value={targetInput}
                        onChangeText={setTargetInput}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor={colors.mutedForeground}
                      />
                    </View>

                    {/* Savings preview */}
                    {targetInput && !isNaN(parseFloat(targetInput)) && (
                      <Text style={[styles.savingsPreview, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
                        {parseFloat(targetInput) < currentPrice
                          ? `💰 ${tr.priceAlert?.savingsOf ?? "You'll save"} ${currency} ${(currentPrice - parseFloat(targetInput)).toFixed(2)} (${(((currentPrice - parseFloat(targetInput)) / currentPrice) * 100).toFixed(0)}%)`
                          : `⚠️ ${tr.priceAlert?.alreadyBelow ?? "Target is above current price — alert will trigger immediately"}`}
                      </Text>
                    )}
                  </View>

                  {/* Quick target buttons */}
                  <View style={{ gap: 8 }}>
                    <Text style={[styles.inputLabel, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
                      {tr.priceAlert?.quickTargets ?? "Quick targets"}
                    </Text>
                    <View style={[styles.quickTargetsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      {[5, 10, 15, 20].map((pct) => (
                        <Pressable
                          key={pct}
                          style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                          onPress={() => setTargetInput((currentPrice * (1 - pct / 100)).toFixed(2))}
                        >
                          <Text style={[styles.quickBtnText, { color: colors.foreground }]}>-{pct}%</Text>
                          <Text style={[styles.quickBtnPrice, { color: colors.primary }]}>
                            {currency}{(currentPrice * (1 - pct / 100)).toFixed(0)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Create button */}
                  <Pressable
                    style={[styles.createBtn, { backgroundColor: colors.primary }]}
                    onPress={handleCreate}
                    disabled={creating}
                  >
                    {creating ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Feather name="bell" size={18} color="#fff" />
                        <Text style={styles.createBtnText}>
                          {tr.priceAlert?.setBtn ?? "Set Price Alert"}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
      position: "relative",
    },
    triggeredDot: {
      position: "absolute",
      top: -3,
      right: -3,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#22c55e",
      borderWidth: 1.5,
      borderColor: "#fff",
    },
    triggerText: { fontFamily: "Inter_500Medium", fontSize: 11 },
    modal: { flex: 1 },
    modalHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      gap: 12,
    },
    modalTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
    modalSub: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
    currentPriceCard: {
      borderRadius: 14,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    currentLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
    currentValue: { fontFamily: "Inter_700Bold", fontSize: 22 },
    existingAlertCard: {
      borderRadius: 14,
      padding: 16,
      borderWidth: 1.5,
      gap: 12,
    },
    alertIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    alertStatusTitle: { fontFamily: "Inter_700Bold", fontSize: 16 },
    alertStatusSub: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 3 },
    savingsBanner: {
      borderRadius: 10,
      padding: 12,
    },
    savingsText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      color: "#fff",
      textAlign: "center",
    },
    deleteBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1.5,
      borderRadius: 14,
      paddingVertical: 14,
    },
    deleteBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    howItWorks: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 12,
    },
    howItWorksText: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      flex: 1,
      lineHeight: 18,
    },
    inputLabel: { fontFamily: "Inter_500Medium", fontSize: 14 },
    inputRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 8,
    },
    currencyLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
    priceInput: {
      flex: 1,
      fontFamily: "Inter_700Bold",
      fontSize: 22,
    },
    savingsPreview: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      lineHeight: 18,
    },
    quickTargetsRow: { gap: 8 },
    quickBtn: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      gap: 3,
    },
    quickBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
    quickBtnPrice: { fontFamily: "Inter_400Regular", fontSize: 10 },
    createBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderRadius: 16,
      paddingVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    createBtnText: {
      fontFamily: "Inter_700Bold",
      fontSize: 17,
      color: "#fff",
    },
  });
}
