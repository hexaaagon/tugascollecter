import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;

  try {
    // Set button style based on theme
    await NavigationBar.setButtonStyleAsync(
      theme === "dark" ? "light" : "dark",
    );

    // In edge-to-edge mode, we can't set background color
    // Instead, we'll rely on the system to handle the translucent navigation bar
    // and add our own overlay component in the app if needed

    // Ensure navigation bar is visible
    await NavigationBar.setVisibilityAsync("visible");

    console.log(`Android navigation bar updated for ${theme} theme`);
  } catch (error) {
    console.warn("Failed to set Android navigation bar style:", error);
  }
}
