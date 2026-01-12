import { XStack, YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { changeLanguage } from "../../../../utils/i18n";
import { tokens } from "../../../../theme/tokens";
import { useState } from "react";
import { Modal, TouchableOpacity, StyleSheet, Pressable } from "react-native";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "en", name: "English", nativeName: "English" },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    setOpen(false);
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={{ flex: 1 }}>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$3" alignItems="center" flex={1}>
            <Ionicons name="globe-outline" size={24} color="#8E8E93" />
            <YStack flex={1}>
              <Text color="$text" fontSize={16}>
                {t("settings.language")}
              </Text>
              <Text color={tokens.color.darkSecondary} fontSize={13}>
                {currentLanguage?.nativeName || "Русский"}
              </Text>
            </YStack>
          </XStack>
          <Text color={"$accent"} fontSize={15} fontWeight="500">
            {t("settings.changeLanguage")}
          </Text>
        </XStack>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <YStack
              backgroundColor="$surface"
              borderTopLeftRadius="$6"
              borderTopRightRadius="$6"
              padding="$4"
            >
              <YStack
                width={40}
                height={4}
                backgroundColor="#3C3C43"
                borderRadius="$2"
                alignSelf="center"
                marginBottom="$4"
              />
              <Text
                color="$text"
                fontSize={20}
                fontWeight="bold"
                marginBottom="$4"
              >
                {t("settings.language")}
              </Text>
              <YStack gap="$3">
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageChange(lang.code)}
                    activeOpacity={0.8}
                  >
                    <XStack
                      padding="$4"
                      backgroundColor={
                        i18n.language === lang.code
                          ? "$accent"
                          : "$surfaceSecondary"
                      }
                      borderRadius="$3"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text
                        fontSize={16}
                        fontWeight="600"
                        color={
                          i18n.language === lang.code ? "white" : "#E5E5E7"
                        }
                      >
                        {lang.nativeName}
                      </Text>
                      {i18n.language === lang.code && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="white"
                        />
                      )}
                    </XStack>
                  </TouchableOpacity>
                ))}
              </YStack>
            </YStack>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
  },
});
