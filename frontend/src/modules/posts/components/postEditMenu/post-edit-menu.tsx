import { View, TouchableOpacity } from "react-native";
import { YStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { styles } from "./post-edit-menu.styles";

interface PostEditMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostEditMenu({
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PostEditMenuProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const handleEdit = () => {
    onEdit();
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View style={styles.menuContainer}>
        <YStack
          backgroundColor="$surface"
          borderRadius="$4"
          overflow="hidden"
          width={200}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
          elevation={5}
        >
          <Button
            unstyled
            onPress={handleEdit}
            backgroundColor="transparent"
            borderWidth={0}
            paddingHorizontal="$4"
            paddingVertical="$3"
            flexDirection="row"
            alignItems="center"
            gap="$3"
            pressStyle={{
              backgroundColor: "$backgroundHover",
            }}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={currentTheme.text}
            />
            <Text fontSize={16} color="$text">
              Редактировать
            </Text>
          </Button>

          <YStack height={1} backgroundColor="$border" />

          <Button
            unstyled
            onPress={handleDelete}
            backgroundColor="transparent"
            borderWidth={0}
            paddingHorizontal="$4"
            paddingVertical="$3"
            flexDirection="row"
            alignItems="center"
            gap="$3"
            pressStyle={{
              backgroundColor: "$backgroundHover",
            }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={currentTheme.error}
            />
            <Text fontSize={16} color={currentTheme.error}>
              Удалить
            </Text>
          </Button>
        </YStack>
      </View>
    </>
  );
}
