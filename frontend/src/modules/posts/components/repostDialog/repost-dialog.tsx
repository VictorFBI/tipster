import { useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { YStack, XStack, Text, Button, Input } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface RepostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (content?: string) => void;
}

export function RepostDialog({
  open,
  onOpenChange,
  onConfirm,
}: RepostDialogProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [content, setContent] = useState("");

  const handleConfirm = () => {
    onConfirm(content.trim() || undefined);
    setContent("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setContent("");
    onOpenChange(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <YStack
            backgroundColor="$surface"
            padding="$5"
            borderRadius="$6"
            gap="$4"
            maxWidth={400}
            width="90%"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={5}
          >
            <Text
              fontSize={20}
              fontWeight="600"
              color="$text"
              marginBottom="$2"
            >
              {t("repost.title")}
            </Text>

            <Text fontSize={16} color="$textSecondary" lineHeight={22}>
              {t("repost.description")}
            </Text>

            <Input
              placeholder={t("repost.addComment")}
              value={content}
              onChangeText={setContent}
              backgroundColor="$background"
              fontSize={14}
              borderColor="$borderColor"
              borderWidth={1}
              borderRadius={8}
              paddingHorizontal="$3"
              paddingVertical="$2"
              color="$text"
              placeholderTextColor="$placeholder"
            />

            <XStack gap="$3" marginTop="$3" justifyContent="flex-end">
              <Button
                onPress={handleCancel}
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="$border"
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderRadius="$3"
                pressStyle={{
                  opacity: 0.7,
                  backgroundColor: "$backgroundHover",
                }}
              >
                <Text fontSize={16} fontWeight="500" color="$text">
                  {t("repost.cancel")}
                </Text>
              </Button>

              <Button
                onPress={handleConfirm}
                backgroundColor="$accent"
                borderWidth={0}
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderRadius="$3"
                pressStyle={{
                  opacity: 0.8,
                }}
              >
                <Text fontSize={16} fontWeight="600" color="white">
                  {t("repost.confirm")}
                </Text>
              </Button>
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
