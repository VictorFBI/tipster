import React from "react";
import { CustomAlert } from "./custom-alert";
import { useAlertStore } from "@/src/core/utils/alertService";

export function AlertProvider() {
  const { visible, title, message, buttons, hide } = useAlertStore();

  return (
    <CustomAlert
      visible={visible}
      title={title}
      message={message}
      buttons={buttons}
      onDismiss={hide}
    />
  );
}
