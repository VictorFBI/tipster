// module.exports = function (api) {
//   api.cache(true);
//   return {
//      presets: [
//       ['babel-preset-expo', {
//         unstable_transformImportMeta: true
//       }]
//     ],
//     plugins: [
//       [
//         '@tamagui/babel-plugin',
//         {
//           components: ['tamagui'],
//           config: './tamagui.config.ts',
//           logTimings: true,
//         },
//       ],
//       'react-native-reanimated/plugin',
//     ],
//   };
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true,
          jsxRuntime: "automatic",
          jsxImportSource: "react",
        },
      ],
    ],
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: true,
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
