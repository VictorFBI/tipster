import { Button, XStack, Text } from "tamagui";

export function Tabs({ activeTab, setActiveTab }) {
  return (
    <XStack
      marginTop="$4"
      marginHorizontal="$4"
      backgroundColor="$surface"
      borderRadius="$10"
      padding="$1"
      gap="$2"
    >
      <Button
        flex={1}
        backgroundColor={activeTab === "posts" ? "white" : "transparent"}
        borderRadius="$8"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => setActiveTab("posts")}
        height={44}
      >
        <Text
          fontSize={15}
          fontWeight="600"
          color={activeTab === "posts" ? "#0A0A0F" : "#8E8E93"}
        >
          Посты
        </Text>
      </Button>
      <Button
        flex={1}
        backgroundColor={activeTab === "liked" ? "white" : "transparent"}
        borderRadius="$8"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => setActiveTab("liked")}
        height={44}
      >
        <Text
          fontSize={15}
          fontWeight="600"
          color={activeTab === "liked" ? "#0A0A0F" : "#8E8E93"}
        >
          Понравилось
        </Text>
      </Button>
    </XStack>
  );
}
