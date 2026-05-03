import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { LANGUAGES, LanguageCode } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguagePicker() {
  const colors = useColors();
  const { language, setLanguage, tr } = useLanguage();
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const current = LANGUAGES.find((l) => l.code === language);

  const handleSelect = async (code: LanguageCode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(code);
    setVisible(false);
  };

  const styles = makeStyles(colors);

  return (
    <>
      <Pressable
        style={[styles.trigger, { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.25)" }]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.flagText}>{current?.flag}</Text>
        <Text style={styles.langCode}>{language.toUpperCase()}</Text>
        <Feather name="chevron-down" size={12} color="rgba(255,255,255,0.8)" />
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.handle} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{tr.language.select}</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.code === language;
                return (
                  <Pressable
                    style={[
                      styles.langItem,
                      {
                        backgroundColor: isSelected ? colors.muted : "transparent",
                        borderColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                    onPress={() => handleSelect(item.code)}
                  >
                    <Text style={styles.langFlag}>{item.flag}</Text>
                    <View style={styles.langTexts}>
                      <Text style={[styles.langNative, { color: colors.foreground }]}>{item.nativeName}</Text>
                      <Text style={[styles.langEnglish, { color: colors.mutedForeground }]}>{item.name}</Text>
                    </View>
                    {isSelected && (
                      <Feather name="check" size={16} color={colors.primary} />
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors")["useColors"]>) {
  return StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
    flagText: { fontSize: 14 },
    langCode: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 11,
      color: "rgba(255,255,255,0.9)",
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    sheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingHorizontal: 16,
      maxHeight: "80%",
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    sheetTitle: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 18,
      marginBottom: 12,
    },
    langItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      gap: 12,
      marginBottom: 4,
    },
    langFlag: { fontSize: 22 },
    langTexts: { flex: 1 },
    langNative: {
      fontFamily: "Inter_500Medium",
      fontSize: 15,
    },
    langEnglish: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      marginTop: 1,
    },
  });
}
