import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Button, XStack, Text } from "tamagui";

export function CreatePostButton() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  return (
    <Button
      backgroundColor="$accent"
      marginHorizontal="$4"
      marginTop="$4"
      borderRadius="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={handleCreatePost}
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
