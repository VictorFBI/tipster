import { useCallback, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  UIManager,
  findNodeHandle,
  Dimensions,
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
  /** Ref to the anchor element (the three-dot button) used for positioning */
  anchorRef?: React.RefObject<View | null>;
}

const MENU_HEIGHT = 100; // approximate height of the popover menu

export function CommentEditMenu({
  open,
  onOpenChange,
  onEdit,
  onDelete,
  anchorRef,
}: CommentEditMenuProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const [measured, setMeasured] = useState(false);

  // Measure anchor position every time the menu opens so the popover
  // appears at the correct location even after the user has scrolled.
  useEffect(() => {
    if (open && anchorRef?.current) {
      const node = findNodeHandle(anchorRef.current);
      if (node) {
        UIManager.measureInWindow(node, (x, y, width, height) => {
          const screenHeight = Dimensions.get("window").height;
          // If the menu would overflow the bottom of the screen, show it above the anchor
          const wouldOverflow = y + height + MENU_HEIGHT > screenHeight;
          const top = wouldOverflow ? y - MENU_HEIGHT : y + height;

          setPosition({ top, right: x + width });
          setMeasured(true);
        });
      } else {
        // No anchor node — fall back to showing near the top-right
        setMeasured(true);
      }
    } else if (!open) {
      setMeasured(false);
    }
  }, [open, anchorRef]);

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
      {open && measured && (
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
