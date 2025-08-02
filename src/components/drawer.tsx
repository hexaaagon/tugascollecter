import * as React from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Info,
  Cloud,
  CloudOff,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { iconWithClassName } from "@/lib/icons/iconWithClassName";
import { Image } from "expo-image";
import { toast } from "sonner-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

// Types and Interfaces
export interface DrawerMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
  route?: string;
}

export interface DrawerSection {
  id: string;
  title?: string;
  items: DrawerMenuItem[];
}

interface DrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

interface DrawerProviderProps {
  children: React.ReactNode;
}

interface DrawerOverlayProps {
  translateX: Animated.Value;
  backdropOpacity: Animated.Value;
}

interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

interface DrawerItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  className?: string;
  style?: any;
  disabled?: boolean;
}

interface DrawerTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

interface DrawerSeparatorProps {
  className?: string;
  style?: any;
}

interface CustomDrawerContentProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  onItemPress?: (item: DrawerMenuItem) => void;
}

interface DrawerFooterProps {
  isSignedIn?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignIn?: () => void;
  onTurnOnCloudChanges?: () => void;
}

iconWithClassName(Home);
iconWithClassName(CheckSquare);
iconWithClassName(Calendar);
iconWithClassName(BarChart3);
iconWithClassName(Settings);
iconWithClassName(Info);
iconWithClassName(Cloud);
iconWithClassName(CloudOff);
iconWithClassName(User);

// Default drawer configuration
export const defaultDrawerConfig: DrawerSection[] = [
  {
    id: "main",
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
        route: "/(main)/",
        active: true,
        onPress: () => router.push("/"),
      },
      {
        id: "tasks",
        label: "Tasks",
        icon: CheckSquare,
        onPress: () => Alert.alert("Tasks", "Navigate to tasks screen"),
      },
      {
        id: "calendar",
        label: "Calendar",
        icon: Calendar,
        onPress: () => Alert.alert("Calendar", "Navigate to calendar screen"),
      },
      {
        id: "statistics",
        label: "Statistics",
        icon: BarChart3,
        onPress: () =>
          Alert.alert("Statistics", "Navigate to statistics screen"),
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        route: "/(main)/settings",
        onPress: () => router.push("/(main)/settings"),
      },
      {
        id: "about",
        label: "About",
        icon: Info,
        onPress: () => Alert.alert("About", "Navigate to about screen"),
      },
    ],
  },
];

// Context
const DrawerContext = React.createContext<DrawerContextType | undefined>(
  undefined,
);

// Hooks
export const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

// Hook for managing drawer configuration
export function useDrawerConfig() {
  const [config, setConfig] = React.useState(defaultDrawerConfig);

  const updateItemStatus = React.useCallback(
    (itemId: string, updates: Partial<DrawerMenuItem>) => {
      setConfig((prevConfig) =>
        prevConfig.map((section) => ({
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item,
          ),
        })),
      );
    },
    [],
  );

  const addItem = React.useCallback(
    (sectionId: string, item: DrawerMenuItem) => {
      setConfig((prevConfig) =>
        prevConfig.map((section) =>
          section.id === sectionId
            ? { ...section, items: [...section.items, item] }
            : section,
        ),
      );
    },
    [],
  );

  const removeItem = React.useCallback((itemId: string) => {
    setConfig((prevConfig) =>
      prevConfig.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.id !== itemId),
      })),
    );
  }, []);

  const setActiveItem = React.useCallback((itemId: string) => {
    setConfig((prevConfig) =>
      prevConfig.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          active: item.id === itemId,
        })),
      })),
    );
  }, []);

  return {
    config,
    setConfig,
    updateItemStatus,
    addItem,
    removeItem,
    setActiveItem,
  };
}

// Slot for drawer content - will be filled by DrawerContent component
let DrawerContentSlot: React.ComponentType = () => null;

// Components
export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const isAnimating = React.useRef(false);

  const openDrawer = React.useCallback(() => {
    if (isAnimating.current || isOpen) return;

    isAnimating.current = true;
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAnimating.current = false;
    });
  }, [translateX, backdropOpacity, isOpen]);

  const closeDrawer = React.useCallback(() => {
    if (isAnimating.current || !isOpen) return;

    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
      isAnimating.current = false;
    });
  }, [translateX, backdropOpacity, isOpen]);

  const toggleDrawer = React.useCallback(() => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [isOpen, openDrawer, closeDrawer]);

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [isOpen, openDrawer, closeDrawer, toggleDrawer],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
      <DrawerOverlay
        translateX={translateX}
        backdropOpacity={backdropOpacity}
      />
    </DrawerContext.Provider>
  );
}

function DrawerOverlay({ translateX, backdropOpacity }: DrawerOverlayProps) {
  const { isOpen, closeDrawer } = useDrawer();
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  if (!isOpen) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <Animated.View
        className="absolute inset-0 z-10"
        style={[
          styles.drawer,
          {
            backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
            transform: [{ translateX }],
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <DrawerContentSlot />
      </Animated.View>
      <Animated.View
        className="absolute inset-0 z-0"
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={closeDrawer}
        />
      </Animated.View>
    </View>
  );
}

export function DrawerContent({
  children,
  className,
  style,
}: DrawerContentProps) {
  React.useEffect(() => {
    DrawerContentSlot = () => (
      <View style={[styles.content, style]} className={cn("", className)}>
        {children}
      </View>
    );
  }, [children, className, style]);

  return null;
}

export function DrawerHeader({
  children,
  className,
  style,
}: DrawerHeaderProps) {
  return (
    <View style={[styles.header, style]} className={cn("", className)}>
      {children}
    </View>
  );
}

export function DrawerItem({
  children,
  onPress,
  active = false,
  className,
  style,
  disabled = false,
}: DrawerItemProps) {
  const { closeDrawer } = useDrawer();

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
      closeDrawer();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        active && styles.itemActive,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      className={cn("", className)}
    >
      {children}
    </TouchableOpacity>
  );
}

export function DrawerTrigger({
  children,
  className,
  style,
}: DrawerTriggerProps) {
  const { toggleDrawer } = useDrawer();

  return (
    <TouchableOpacity
      onPress={toggleDrawer}
      style={style}
      className={cn("", className)}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

export function DrawerSeparator({ className, style }: DrawerSeparatorProps) {
  return (
    <View style={[styles.separator, style]} className={cn("", className)} />
  );
}

export function DrawerFooter({
  isSignedIn = false,
  user,
  onSignIn,
  onTurnOnCloudChanges,
}: DrawerFooterProps) {
  const { isDarkColorScheme } = useColorScheme();

  const handleCloudSync = () => {
    if (isSignedIn) {
      toast.info("Cloud Sync Not Ready - Coming soon in a future update");
    } else {
      toast.warning("Cloud Sync Coming Soon", {
        description: "Sync features will be available in a future update",
      });
      if (onTurnOnCloudChanges) {
        onTurnOnCloudChanges();
      }
    }
  };

  if (isSignedIn && user) {
    // Signed in state - show user info and cloud sync status
    return (
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: isDarkColorScheme ? "#333333" : "#e5e7eb",
          backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
        }}
      >
        <TouchableOpacity
          onPress={handleCloudSync}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            backgroundColor: isDarkColorScheme ? "#1f2937" : "#f3f4f6",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Avatar alt={user.name} className="mr-3 h-10 w-10">
            <AvatarImage source={{ uri: user.avatar }} />
            <AvatarFallback>
              <Text
                className="font-semibold"
                style={{ color: isDarkColorScheme ? "#ffffff" : "#000000" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1">
            <Text
              className="text-sm font-medium"
              style={{ color: isDarkColorScheme ? "#ffffff" : "#000000" }}
            >
              {user.name}
            </Text>
            <Text
              className="text-xs"
              style={{ color: isDarkColorScheme ? "#9ca3af" : "#6b7280" }}
            >
              {user.email}
            </Text>
          </View>
          <Cloud size={20} color="#22c55e" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#22c55e",
              marginRight: 8,
            }}
          />
          <Text className="text-xs font-medium text-green-400">
            Cloud sync enabled
          </Text>
        </View>
      </View>
    );
  }

  // Not signed in state - show turn on cloud changes
  return (
    <View
      style={{
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: isDarkColorScheme ? "#333333" : "#e5e7eb",
        backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
      }}
    >
      <TouchableOpacity
        onPress={handleCloudSync}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: isDarkColorScheme ? "#1f2937" : "#f3f4f6",
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#3b82f6",
          borderStyle: "dashed",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDarkColorScheme ? "#374151" : "#d1d5db",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <CloudOff
            size={20}
            color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
          />
        </View>
        <View className="flex-1">
          <Text
            className="text-sm font-medium"
            style={{ color: isDarkColorScheme ? "#ffffff" : "#000000" }}
          >
            Turn on Cloud Changes
          </Text>
          <Text
            className="text-xs"
            style={{ color: isDarkColorScheme ? "#9ca3af" : "#6b7280" }}
          >
            Sync tasks across devices
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function CustomDrawerContent({
  footer,
  onItemPress,
}: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();
  const { config, setActiveItem } = useDrawerConfig();
  const pathname = usePathname();

  // Update active item based on current pathname
  React.useEffect(() => {
    let activeItemId = "home"; // default

    if (pathname === "/" || pathname === "/(main)" || pathname === "/(main)/") {
      activeItemId = "home";
    } else if (pathname === "/settings" || pathname === "/(main)/settings") {
      activeItemId = "settings";
    }
    // Add more routes as needed

    setActiveItem(activeItemId);
  }, [pathname, setActiveItem]);

  const handleItemPress = (item: DrawerMenuItem) => {
    // Set the item as active
    setActiveItem(item.id);

    // Call custom onItemPress if provided
    if (onItemPress) {
      onItemPress(item);
    }

    // Call the item's onPress if it exists
    if (item.onPress) {
      item.onPress();
    }
  };

  const renderSection = (section: DrawerSection, index: number) => (
    <React.Fragment key={section.id}>
      {section.title && index > 0 && (
        <>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: isDarkColorScheme ? "#888888" : "#6b7280",
              marginTop: 12,
              marginLeft: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {section.title}
          </Text>
          <DrawerSeparator
            style={{
              backgroundColor: isDarkColorScheme ? "#333333" : "#e5e7eb",
              marginVertical: 12,
            }}
          />
        </>
      )}
      {section.items.map((item) => renderItem(item))}
    </React.Fragment>
  );

  const renderItem = (item: DrawerMenuItem) => {
    const IconComponent = item.icon;

    return (
      <DrawerItem
        key={item.id}
        active={item.active}
        disabled={item.disabled}
        onPress={() => handleItemPress(item)}
        style={{
          backgroundColor: item.active
            ? isDarkColorScheme
              ? "#2a2a2a"
              : "#e5e7eb"
            : "transparent",
          marginRight: 8,
          marginLeft: 2,
          borderRadius: 100,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconComponent
            size={16}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
            style={{ marginRight: 12 }}
          />
          <Text
            style={{
              color: isDarkColorScheme ? "#ffffff" : "#000000",
              fontSize: 16,
              fontWeight: item.active ? "600" : "400",
              opacity: item.disabled ? 0.5 : 1,
            }}
          >
            {item.label}
          </Text>
        </View>
      </DrawerItem>
    );
  };

  return (
    <DrawerContent
      style={{
        backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
        paddingTop: insets.top + 16,
      }}
    >
      <DrawerHeader
        className="flex flex-row items-center gap-4"
        style={{
          borderBottomColor: isDarkColorScheme ? "#333333" : "#e5e7eb",
          backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
        }}
      >
        <Image
          source={require("@/assets/images/icon.svg")}
          style={{ width: 28, height: 28, borderRadius: 20 }}
        />
        <View className="flex-1 flex-col">
          <Text
            className="font-bricolage-grotesque text-xl"
            style={{
              color: isDarkColorScheme ? "#ffffff" : "#000000",
            }}
          >
            Tugas Collecter
          </Text>
        </View>
      </DrawerHeader>

      <View style={{ flex: 1, paddingTop: 16 }}>
        {config.map((section, index) => renderSection(section, index))}
      </View>

      <DrawerFooter />
    </DrawerContent>
  );
}

// Styles
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  itemActive: {
    backgroundColor: "#2a2a2a",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: "#333333",
    marginVertical: 8,
  },
});
