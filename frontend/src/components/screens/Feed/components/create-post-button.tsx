import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Button, XStack, Text, Theme } from "tamagui";

export function CreatePostButton() {
  const { t } = useTranslation();
  return (
    <Button
      backgroundColor="$accentColor"
      marginHorizontal="$4"
      marginTop="$4"
      borderRadius="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={() => {
        // TODO: Navigate to create post screen
        console.log("Create post");
      }}
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="add" size={20} color="white" />
        <Text fontSize={16} fontWeight="600" color="white">
          {t("feed.createPost")}
        </Text>
      </XStack>
    </Button>
  );
}
