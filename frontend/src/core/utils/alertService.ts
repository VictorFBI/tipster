import { create } from "zustand";
import { AlertButton } from "@/src/shared/ui/customAlert/custom-alert";

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  show: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: "",
  message: undefined,
  buttons: undefined,
  show: (title: string, message?: string, buttons?: AlertButton[]) =>
    set({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: "OK", style: "default" }],
    }),
  hide: () =>
    set({
      visible: false,
      title: "",
      message: undefined,
      buttons: undefined,
    }),
}));

// Helper function to mimic Alert.alert API
export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
) => {
  useAlertStore.getState().show(title, message, buttons);
};
