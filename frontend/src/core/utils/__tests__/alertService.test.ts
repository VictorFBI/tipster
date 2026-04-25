import { useAlertStore, showAlert } from "../alertService";

beforeEach(() => {
  // Reset store to initial state
  useAlertStore.setState({
    visible: false,
    title: "",
    message: undefined,
    buttons: undefined,
  });
});

describe("useAlertStore", () => {
  it("initializes with default state", () => {
    const state = useAlertStore.getState();

    expect(state.visible).toBe(false);
    expect(state.title).toBe("");
    expect(state.message).toBeUndefined();
    expect(state.buttons).toBeUndefined();
  });

  describe("show", () => {
    it("sets visible to true with title and message", () => {
      useAlertStore.getState().show("Error", "Something went wrong");

      const state = useAlertStore.getState();
      expect(state.visible).toBe(true);
      expect(state.title).toBe("Error");
      expect(state.message).toBe("Something went wrong");
    });

    it("provides default OK button when no buttons specified", () => {
      useAlertStore.getState().show("Info", "Hello");

      const state = useAlertStore.getState();
      expect(state.buttons).toEqual([{ text: "OK", style: "default" }]);
    });

    it("uses custom buttons when provided", () => {
      const customButtons = [
        { text: "Cancel", style: "cancel" as const },
        { text: "Delete", style: "destructive" as const },
      ];

      useAlertStore.getState().show("Confirm", "Are you sure?", customButtons);

      const state = useAlertStore.getState();
      expect(state.buttons).toEqual(customButtons);
    });

    it("handles show with only title (no message)", () => {
      useAlertStore.getState().show("Notice");

      const state = useAlertStore.getState();
      expect(state.visible).toBe(true);
      expect(state.title).toBe("Notice");
      expect(state.message).toBeUndefined();
    });
  });

  describe("hide", () => {
    it("resets all state to defaults", () => {
      // First show an alert
      useAlertStore
        .getState()
        .show("Error", "Something went wrong", [
          { text: "OK", style: "default" },
        ]);

      // Then hide it
      useAlertStore.getState().hide();

      const state = useAlertStore.getState();
      expect(state.visible).toBe(false);
      expect(state.title).toBe("");
      expect(state.message).toBeUndefined();
      expect(state.buttons).toBeUndefined();
    });
  });
});

describe("showAlert", () => {
  it("calls store.show with the provided arguments", () => {
    showAlert("Test Title", "Test Message");

    const state = useAlertStore.getState();
    expect(state.visible).toBe(true);
    expect(state.title).toBe("Test Title");
    expect(state.message).toBe("Test Message");
  });

  it("passes custom buttons through", () => {
    const buttons = [{ text: "Got it", style: "default" as const }];
    showAlert("Title", "Message", buttons);

    const state = useAlertStore.getState();
    expect(state.buttons).toEqual(buttons);
  });
});
