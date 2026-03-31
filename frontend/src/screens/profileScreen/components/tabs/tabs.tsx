import { Button, XStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

type TabType = "posts" | "liked";

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
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
          color={
            activeTab === "posts" ? currentTheme.tabActive : currentTheme.muted
          }
        >
          {t("profile.posts")}
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
          color={
            activeTab === "liked" ? currentTheme.tabActive : currentTheme.muted
          }
        >
          {t("profile.liked")}
        </Text>
      </Button>
    </XStack>
  );
}
