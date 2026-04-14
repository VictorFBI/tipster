// Jest setup file

// Mock axios before anything else to prevent fetch adapter issues
jest.mock("axios", () => {
  const mockAxiosInstance = {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  };

  const mockAxios = {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
    isAxiosError: jest.fn((val) => val && val.isAxiosError === true),
    AxiosError: class AxiosError extends Error {
      constructor(message, code, config, request, response) {
        super(message);
        this.isAxiosError = true;
        this.code = code;
        this.config = config;
        this.request = request;
        this.response = response;
        this.name = "AxiosError";
      }
    },
    AxiosHeaders: class AxiosHeaders {
      constructor() {
        this.headers = {};
      }
    },
  };

  // Make AxiosError available as named export
  mockAxios.default = mockAxios;
  return mockAxios;
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  requestCameraPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  MediaTypeOptions: {
    All: "All",
    Videos: "Videos",
    Images: "Images",
  },
}));

// Mock expo-clipboard
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "Light", Medium: "Medium", Heavy: "Heavy" },
  NotificationFeedbackType: {
    Success: "Success",
    Warning: "Warning",
    Error: "Error",
  },
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: "Link",
  Stack: {
    Screen: "Screen",
  },
  Tabs: {
    Screen: "Screen",
  },
}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {},
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }) => children,
  Swipeable: "Swipeable",
  DrawerLayout: "DrawerLayout",
  State: {},
  ScrollView: "ScrollView",
  Slider: "Slider",
  Switch: "Switch",
  TextInput: "TextInput",
  ToolbarAndroid: "ToolbarAndroid",
  ViewPagerAndroid: "ViewPagerAndroid",
  DrawerLayoutAndroid: "DrawerLayoutAndroid",
  WebView: "WebView",
  NativeViewGestureHandler: "NativeViewGestureHandler",
  TapGestureHandler: "TapGestureHandler",
  FlingGestureHandler: "FlingGestureHandler",
  ForceTouchGestureHandler: "ForceTouchGestureHandler",
  LongPressGestureHandler: "LongPressGestureHandler",
  PanGestureHandler: "PanGestureHandler",
  PinchGestureHandler: "PinchGestureHandler",
  RotationGestureHandler: "RotationGestureHandler",
  RawButton: "RawButton",
  BaseButton: "BaseButton",
  RectButton: "RectButton",
  BorderlessButton: "BorderlessButton",
  FlatList: "FlatList",
  gestureHandlerRootHOC: jest.fn(),
  Directions: {},
}));

// Mock tamagui
jest.mock("tamagui", () => {
  const React = require("react");
  const RN = require("react-native");

  const createMockComponent = (name) => {
    const component = React.forwardRef((props, ref) =>
      React.createElement(
        RN.View,
        { ...props, ref, testID: props.testID || name },
        props.children,
      ),
    );
    component.displayName = name;
    return component;
  };

  const createMockTextComponent = (name) => {
    const component = React.forwardRef((props, ref) =>
      React.createElement(
        RN.Text,
        { ...props, ref, testID: props.testID || name },
        props.children,
      ),
    );
    component.displayName = name;
    return component;
  };

  return {
    Button: createMockComponent("Button"),
    Input: React.forwardRef((props, ref) =>
      React.createElement(RN.TextInput, {
        ...props,
        ref,
        testID: props.testID || "Input",
      }),
    ),
    Text: createMockTextComponent("Text"),
    View: createMockComponent("View"),
    XStack: createMockComponent("XStack"),
    YStack: createMockComponent("YStack"),
    Stack: createMockComponent("Stack"),
    Theme: createMockComponent("Theme"),
    TamaguiProvider: createMockComponent("TamaguiProvider"),
    styled: (component) => component,
    useTheme: () => ({
      background: { val: "#000" },
      color: { val: "#fff" },
    }),
    createTamagui: jest.fn(),
    getTokens: () => ({}),
  };
});

// Mock @walletconnect/modal-react-native
jest.mock("@walletconnect/modal-react-native", () => ({
  WalletConnectModal: "WalletConnectModal",
  useWalletConnectModal: () => ({
    open: jest.fn(),
    close: jest.fn(),
    isOpen: false,
    address: null,
    provider: null,
  }),
}));

// Mock @walletconnect/react-native-compat
jest.mock("@walletconnect/react-native-compat", () => ({}));

// Mock @gorhom/bottom-sheet
jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const RN = require("react-native");
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) =>
      React.createElement(RN.View, { ...props, ref }, props.children),
    ),
    BottomSheetModal: React.forwardRef((props, ref) =>
      React.createElement(RN.View, { ...props, ref }, props.children),
    ),
    BottomSheetModalProvider: ({ children }) => children,
    BottomSheetBackdrop: "BottomSheetBackdrop",
    BottomSheetScrollView: React.forwardRef((props, ref) =>
      React.createElement(RN.ScrollView, { ...props, ref }, props.children),
    ),
    BottomSheetTextInput: React.forwardRef((props, ref) =>
      React.createElement(RN.TextInput, { ...props, ref }),
    ),
    useBottomSheetModal: () => ({
      dismiss: jest.fn(),
      dismissAll: jest.fn(),
    }),
  };
});

// Mock react-native-worklets
jest.mock("react-native-worklets/plugin", () => ({}));

// Silence console.warn in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Require cycle") ||
      args[0].includes("react-native-compat"))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};
