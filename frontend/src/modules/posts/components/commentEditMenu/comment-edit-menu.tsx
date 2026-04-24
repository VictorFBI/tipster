import { useRef, useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  UIManager,
  findNodeHandle,
} from "react-native";
import { YStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { styles } from "./comment-edit-menu.styles";

interface CommentEditMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommentEditMenu({
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CommentEditMenuProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const anchorRef = useRef<View>(null);
  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const measure = useCallback(() => {
    const node = findNodeHandle(anchorRef.current);
    if (node) {
      UIManager.measureInWindow(node, (x, y, width) => {
        setPosition({ top: y, right: x + width });
      });
    }
  }, []);

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

  return (
    <>
      <View ref={anchorRef} style={styles.anchor} onLayout={measure} />
      {open && (
        <Modal
          visible={open}
          transparent
          animationType="none"
          onRequestClose={handleClose}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleClose}
          >
            <View
              style={[styles.menuPopover, { top: position.top }]}
              onStartShouldSetResponder={() => true}
            >
              <YStack
                backgroundColor="$surface"
                borderRadius="$4"
                overflow="hidden"
                width={180}
                borderWidth={2}
                borderColor="$border"
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
                    size={18}
                    color={currentTheme.text}
                  />
                  <Text fontSize={14} color="$text">
                    {t("comments.edit")}
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
                    size={18}
                    color={currentTheme.error}
                  />
                  <Text fontSize={14} color={currentTheme.error}>
                    {t("comments.delete")}
                  </Text>
                </Button>
              </YStack>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}
