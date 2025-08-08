import * as React from "react";
import { View, ScrollView } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

const Table = React.forwardRef<
  React.ElementRef<typeof ScrollView>,
  React.ComponentPropsWithoutRef<typeof ScrollView>
>(({ className, ...props }, ref) => (
  <ScrollView
    ref={ref}
    className={cn("relative w-full overflow-auto", className)}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted flex-row",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground flex-1 justify-center",
      className
    )}
    {...props}
  >
    {typeof children === "string" ? (
      <Text className="font-medium text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("p-4 align-middle flex-1 justify-center", className)}
    {...props}
  >
    {typeof children === "string" ? <Text>{children}</Text> : children}
  </View>
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  >
    {typeof children === "string" ? (
      <Text className="text-sm text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
