import { Modal, TouchableOpacity } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { styles } from "./confirm-dialog.styles";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
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
        style={styles.overlay}
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
              {title}
            </Text>

            <Text fontSize={16} color="$textSecondary" lineHeight={22}>
              {description}
            </Text>

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
                  {cancelText}
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
                  {confirmText}
                </Text>
              </Button>
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
