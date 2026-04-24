export const styles = {
  anchor: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    width: 0,
    height: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menuPopover: {
    position: "absolute" as const,
    right: 16,
    zIndex: 1000,
  },
};
