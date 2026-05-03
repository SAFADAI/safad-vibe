import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAnalyzeProductImage } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  onQuerySuggested: (query: string) => void;
}

export function ImageSearchButton({ onQuerySuggested }: Props) {
  const colors = useColors();
  const { tr, isRTL } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [pickedBase64, setPickedBase64] = useState<string | null>(null);

  const { mutate: analyze, data: result, isPending, reset } = useAnalyzeProductImage();

  const openPicker = async (useCamera: boolean) => {
    try {
      let permResult;
      if (useCamera) {
        permResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permResult.granted) {
        if (!permResult.canAskAgain && Platform.OS !== "web") {
          Alert.alert(tr.camera.permissionDenied, "", [{ text: "OK" }]);
        }
        return;
      }

      const pickerResult = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            quality: 0.7,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.7,
            base64: true,
          });

      if (!pickerResult.canceled && pickerResult.assets[0]) {
        const asset = pickerResult.assets[0];
        setPickedUri(asset.uri);
        setPickedBase64(asset.base64 ?? null);
        setModalVisible(true);
        if (asset.base64) {
          analyze(
            { data: { imageBase64: asset.base64 } },
            {
              onError: () => {
                // result card will show noResult state
              },
            }
          );
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // silently ignore picker errors
    }
  };

  const handlePress = () => {
    if (Platform.OS === "web") {
      openPicker(false);
      return;
    }
    Alert.alert(tr.camera.selectSource, "", [
      { text: tr.camera.takePhoto, onPress: () => openPicker(true) },
      { text: tr.camera.chooseGallery, onPress: () => openPicker(false) },
      { text: tr.camera.cancel, style: "cancel" },
    ]);
  };

  const handleClose = () => {
    setModalVisible(false);
    setPickedUri(null);
    setPickedBase64(null);
    reset();
  };

  const handleUseQuery = (query: string) => {
    onQuerySuggested(query);
    handleClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const styles = makeStyles(colors, isRTL);

  return (
    <>
      <Pressable
        style={[styles.cameraBtn, { backgroundColor: colors.primary }]}
        onPress={handlePress}
        hitSlop={8}
      >
        <Feather name="camera" size={17} color="#fff" />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{tr.camera.title}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Image preview */}
          {pickedUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: pickedUri }} style={styles.previewImage} resizeMode="cover" />
              {isPending && (
                <View style={styles.analyzingOverlay}>
                  <View style={[styles.analyzingPill, { backgroundColor: "rgba(0,0,0,0.75)" }]}>
                    <Text style={styles.analyzingText}>{tr.camera.analyzing}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Result card */}
          {!isPending && result && (
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              {/* Confidence bar */}
              <View style={[styles.confidenceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Text style={[styles.confidenceLabel, { color: colors.mutedForeground }]}>{tr.camera.confidence}</Text>
                <View style={[styles.confidenceTrack, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${Math.round((result.confidence ?? 0) * 100)}%` as `${number}%`,
                        backgroundColor:
                          (result.confidence ?? 0) > 0.7
                            ? "#22c55e"
                            : (result.confidence ?? 0) > 0.4
                            ? "#f59e0b"
                            : "#ef4444",
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.confidencePct, { color: colors.foreground }]}>
                  {Math.round((result.confidence ?? 0) * 100)}%
                </Text>
              </View>

              {/* Product type + brand */}
              {result.productType && (
                <View style={[styles.detectedRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <View style={[styles.detectedBadge, { backgroundColor: colors.primary + "22" }]}>
                    <Text style={[styles.detectedLabel, { color: colors.primary }]}>{tr.camera.detected}</Text>
                  </View>
                  <Text style={[styles.productType, { color: colors.foreground }]}>{result.productType}</Text>
                  {result.brand && (
                    <Text style={[styles.brand, { color: colors.mutedForeground }]}>· {result.brand}</Text>
                  )}
                </View>
              )}

              {/* Attributes chips */}
              {result.attributes && result.attributes.length > 0 && (
                <View style={[styles.attributesRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  {result.attributes.slice(0, 5).map((attr, i) => (
                    <View key={i} style={[styles.attrChip, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.attrText, { color: colors.mutedForeground }]}>{attr}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Suggested query — action button */}
              {result.suggestedQuery ? (
                <Pressable
                  style={[styles.searchWithBtn, { backgroundColor: colors.secondary }]}
                  onPress={() => handleUseQuery(result.suggestedQuery ?? "")}
                >
                  <Feather name="search" size={15} color="#fff" />
                  <Text style={styles.searchWithText}>{tr.camera.searchWith}</Text>
                  <Text style={styles.searchWithQuery} numberOfLines={1}>
                    "{result.suggestedQuery}"
                  </Text>
                </Pressable>
              ) : (
                <Text style={[styles.noResult, { color: colors.mutedForeground }]}>{tr.camera.noResult}</Text>
              )}
            </View>
          )}

          {/* No result fallback */}
          {!isPending && !result && pickedUri && (
            <View style={styles.noResultContainer}>
              <Feather name="alert-circle" size={32} color={colors.mutedForeground} />
              <Text style={[styles.noResult, { color: colors.mutedForeground }]}>{tr.camera.noResult}</Text>
              <Pressable
                style={[styles.retryBtn, { backgroundColor: colors.muted }]}
                onPress={() => {
                  if (pickedBase64) {
                    analyze({ data: { imageBase64: pickedBase64 } });
                  }
                }}
              >
                <Feather name="refresh-cw" size={14} color={colors.foreground} />
                <Text style={[styles.retryText, { color: colors.foreground }]}>Retry</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>, isRTL: boolean) {
  return StyleSheet.create({
    cameraBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    modal: { flex: 1 },
    modalHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 20,
    },
    imageContainer: {
      margin: 16,
      borderRadius: 16,
      overflow: "hidden",
      height: 280,
    },
    previewImage: { width: "100%", height: "100%" },
    analyzingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
    },
    analyzingPill: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 24,
    },
    analyzingText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
      color: "#fff",
    },
    resultCard: {
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    confidenceRow: {
      alignItems: "center",
      gap: 8,
    },
    confidenceLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      width: 65,
      textAlign: isRTL ? "right" : "left",
    },
    confidenceTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
    },
    confidenceFill: {
      height: "100%",
      borderRadius: 3,
    },
    confidencePct: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      width: 38,
      textAlign: isRTL ? "left" : "right",
    },
    detectedRow: {
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    detectedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    detectedLabel: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 11,
    },
    productType: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 16,
    },
    brand: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
    },
    attributesRow: {
      flexWrap: "wrap",
      gap: 6,
    },
    attrChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    attrText: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
    },
    searchWithBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 13,
      borderRadius: 12,
      marginTop: 4,
    },
    searchWithText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      color: "#fff",
    },
    searchWithQuery: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      flexShrink: 1,
    },
    noResult: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      textAlign: "center",
    },
    noResultContainer: {
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 32,
    },
    retryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
    },
    retryText: {
      fontFamily: "Inter_500Medium",
      fontSize: 13,
    },
  });
}
