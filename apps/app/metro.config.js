const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(wrapWithReanimatedMetroConfig(config), {
  input: "./src/styles/global.css",
});
