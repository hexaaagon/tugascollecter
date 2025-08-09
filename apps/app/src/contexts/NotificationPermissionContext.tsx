import React, { createContext, useContext, useRef } from "react";

interface NotificationPermissionContextType {
  showDialog: () => void;
  registerDialogTrigger: (trigger: () => void) => void;
}

const NotificationPermissionContext = createContext<
  NotificationPermissionContextType | undefined
>(undefined);

export function NotificationPermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dialogTriggerRef = useRef<(() => void) | null>(null);

  const showDialog = () => {
    if (dialogTriggerRef.current) {
      dialogTriggerRef.current();
    }
  };

  const registerDialogTrigger = (trigger: () => void) => {
    dialogTriggerRef.current = trigger;
  };

  return (
    <NotificationPermissionContext.Provider
      value={{ showDialog, registerDialogTrigger }}
    >
      {children}
    </NotificationPermissionContext.Provider>
  );
}

export function useNotificationPermissionContext() {
  const context = useContext(NotificationPermissionContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationPermissionContext must be used within a NotificationPermissionProvider",
    );
  }
  return context;
}
