import { Modal, TouchableOpacity } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { styles } from "./custom-alert.styles";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
}

export function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
}: CustomAlertProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onDismiss();
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case "cancel":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "$border",
          textColor: "$text",
        };
      case "destructive":
        return {
          backgroundColor: "$danger",
          borderWidth: 0,
          textColor: "white",
        };
      default:
        return {
          backgroundColor: "$accent",
          borderWidth: 0,
          textColor: "white",
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
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
            width="85%"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.25}
            shadowRadius={16}
            elevation={8}
          >
            Icon
            <YStack alignItems="center" marginBottom="$2">
              <YStack
                width={56}
                height={56}
                borderRadius={28}
                backgroundColor="$accent"
                // opacity={0.15}
                alignItems="center"
                justifyContent="center"
              >
                <YStack
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="$accent"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={20}>ℹ️</Text>
                </YStack>
              </YStack>
            </YStack>
            {/* Title */}
            <Text
              fontSize={20}
              fontWeight="700"
              color="$text"
              textAlign="center"
              lineHeight={26}
            >
              {title}
            </Text>
            {/* Message */}
            {message && (
              <Text
                fontSize={15}
                color="$textSecondary"
                textAlign="center"
                lineHeight={21}
              >
                {message}
              </Text>
            )}
            {/* Buttons */}
            <XStack
              gap="$3"
              marginTop="$3"
              justifyContent={buttons.length === 1 ? "center" : "space-between"}
              flexWrap="wrap"
            >
              {buttons.map((button, index) => {
                const buttonStyle = getButtonStyle(button.style);
                return (
                  <Button
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    backgroundColor={buttonStyle.backgroundColor}
                    borderWidth={buttonStyle.borderWidth}
                    borderColor={buttonStyle.borderColor}
                    paddingHorizontal="$5"
                    paddingVertical="$3"
                    borderRadius="$4"
                    flex={buttons.length === 1 ? 0 : 1}
                    minWidth={buttons.length === 1 ? 200 : undefined}
                    pressStyle={{
                      opacity: 0.7,
                      scale: 0.98,
                    }}
                  >
                    <Text
                      fontSize={16}
                      fontWeight="600"
                      color={buttonStyle.textColor}
                    >
                      {button.text}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
