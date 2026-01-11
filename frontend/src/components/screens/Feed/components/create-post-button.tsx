import { Ionicons } from "@expo/vector-icons";
import { Button, XStack, Text, Theme } from "tamagui";

export function CreatePostButton() {
  return (
    <Theme name="accent">
      <Button
        backgroundColor="$background"
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
            Создать пост (+10 TIP)
          </Text>
        </XStack>
      </Button>
    </Theme>
  );
}
