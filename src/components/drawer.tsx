import * as React from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Info,
  type LucideIcon,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { iconWithClassName } from "@/lib/icons/iconWithClassName";
import { Image } from "expo-image";

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

iconWithClassName(Home);
iconWithClassName(CheckSquare);
iconWithClassName(Calendar);
iconWithClassName(BarChart3);
iconWithClassName(Settings);
iconWithClassName(Info);

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
        onPress: () => Alert.alert("Settings", "Navigate to settings screen"),
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
  const insets = useSafeAreaInsets();

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
    >
      <View style={styles.overlay}>
        <Animated.View
          className="absolute inset-0 z-10"
          style={[
            styles.drawer,
            {
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
    </Modal>
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

export function CustomDrawerContent({
  footer,
  onItemPress,
}: CustomDrawerContentProps) {
  const { config, setActiveItem } = useDrawerConfig();

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
              color: "#888888",
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
              backgroundColor: "#333333",
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
          backgroundColor: item.active ? "#2a2a2a" : "transparent",
          marginRight: 8,
          marginLeft: 2,
          borderRadius: 100,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconComponent
            size={16}
            color="#ffffff"
            style={{ marginRight: 12 }}
          />
          <Text
            style={{
              color: "#ffffff",
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
        backgroundColor: "#121212",
      }}
    >
      <DrawerHeader
        className="flex flex-row items-center gap-4"
        style={{
          borderBottomColor: "#333333",
          backgroundColor: "#121212",
        }}
      >
        <Image
          source={require("@/assets/images/icon.svg")}
          style={{ width: 32, height: 32, borderRadius: 20 }}
        />
        <View className="flex-1 flex-col">
          <Text className="font-bricolage-grotesque text-3xl">
            Tugas Collecter
          </Text>
        </View>
      </DrawerHeader>

      <View style={{ flex: 1, paddingTop: 16 }}>
        {config.map((section, index) => renderSection(section, index))}
      </View>

      {footer}
    </DrawerContent>
  );
}

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: "#121212",
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
    borderBottomColor: "#333333",
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
