import React, { useState } from "react";
import { View, Pressable, Image as RNImage, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { AttachmentData } from "@tugascollecter/types";
import { AttachmentPreviewDialog } from "@/components/attachment-preview-dialog";
import { useColorScheme } from "@/lib/useColorScheme";
import {
  FileText,
  File,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

interface AttachmentViewerProps {
  attachments: AttachmentData[];
  compact?: boolean;
}

function AttachmentViewer({
  attachments,
  compact = false,
}: AttachmentViewerProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [previewAttachment, setPreviewAttachment] =
    useState<AttachmentData | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const getFileTypeColor = (mimeType?: string): string => {
    if (!mimeType) return "#64748b";
    if (mimeType.startsWith("image/")) return "#059669";
    if (mimeType.startsWith("video/")) return "#dc2626";
    if (mimeType.startsWith("audio/")) return "#7c3aed";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    )
      return "#ea580c";
    if (
      mimeType.includes("zip") ||
      mimeType.includes("archive") ||
      mimeType.includes("compressed")
    )
      return "#0d9488";
    return "#64748b";
  };

  const getFileTypeIcon = (mimeType?: string) => {
    const iconSize = 24;
    const iconColor = "#ffffff";

    if (!mimeType) return <File size={iconSize} color={iconColor} />;
    if (mimeType.startsWith("image/"))
      return <ImageIcon size={iconSize} color={iconColor} />;
    if (mimeType.startsWith("video/"))
      return <Video size={iconSize} color={iconColor} />;
    if (mimeType.startsWith("audio/"))
      return <Music size={iconSize} color={iconColor} />;
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    )
      return <FileText size={iconSize} color={iconColor} />;
    if (
      mimeType.includes("zip") ||
      mimeType.includes("archive") ||
      mimeType.includes("compressed")
    )
      return <Archive size={iconSize} color={iconColor} />;
    return <File size={iconSize} color={iconColor} />;
  };

  const getDisplayName = (attachment: AttachmentData): string => {
    if (!attachment) return "Unknown Attachment";
    if (attachment.name) return attachment.name;
    if (attachment.uri) return attachment.uri.split("/").pop() || "Attachment";
    return "Attachment";
  };

  const renderAttachment = (attachment: AttachmentData, index: number) => {
    // Add safety check for attachment
    if (!attachment) {
      return null;
    }

    const isImage = attachment.mimeType?.startsWith("image/");
    const backgroundColor = getFileTypeColor(attachment.mimeType);
    const displayName = getDisplayName(attachment);

    return (
      <Pressable
        key={attachment.id || `attachment-${index}`}
        className="h-20 w-20 overflow-hidden rounded-lg shadow-sm"
        style={!isImage ? { backgroundColor } : undefined}
        onPress={() => {
          setPreviewAttachment(attachment);
          setPreviewVisible(true);
        }}
      >
        {isImage && attachment.uri ? (
          <View className="relative flex-1">
            <RNImage
              source={{ uri: attachment.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              onError={() => {
                console.log("Image failed to load:", attachment.uri);
              }}
            />
            <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
              <Text
                className="text-xs font-medium text-white"
                numberOfLines={1}
              >
                {displayName}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-2">
            <View className="mb-1">{getFileTypeIcon(attachment.mimeType)}</View>
            <Text
              className="text-center text-xs font-medium text-white"
              numberOfLines={2}
            >
              {displayName}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  // Filter out any null/undefined attachments
  const validAttachments = attachments.filter(Boolean);

  if (validAttachments.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <View
        className={`overflow-hidden rounded-lg border ${
          isDarkColorScheme
            ? "border-gray-600 bg-gray-800"
            : "border-gray-300 bg-white"
        }`}
      >
        <Pressable
          className={`flex-row items-center justify-between border-b p-3 ${
            isDarkColorScheme
              ? "border-gray-600 bg-gray-700 active:bg-gray-600"
              : "border-gray-300 bg-gray-50 active:bg-gray-100"
          }`}
          onPress={() => setExpanded(!expanded)}
        >
          <Text
            className={`text-sm font-semibold ${
              isDarkColorScheme ? "text-white" : "text-gray-900"
            }`}
          >
            {validAttachments.length} attachment
            {validAttachments.length !== 1 ? "s" : ""}
          </Text>
          {expanded ? (
            <ChevronUp
              size={16}
              color={isDarkColorScheme ? "#d1d5db" : "#6b7280"}
            />
          ) : (
            <ChevronDown
              size={16}
              color={isDarkColorScheme ? "#d1d5db" : "#6b7280"}
            />
          )}
        </Pressable>

        {expanded && (
          <View
            className={`flex-row flex-wrap gap-3 p-4 ${
              isDarkColorScheme ? "bg-gray-800" : "bg-white"
            }`}
          >
            {validAttachments.filter(Boolean).map(renderAttachment)}
          </View>
        )}

        <AttachmentPreviewDialog
          attachment={previewAttachment}
          visible={previewVisible}
          onClose={() => {
            setPreviewVisible(false);
            setPreviewAttachment(null);
          }}
        />
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text
        className={`mb-3 text-base font-semibold ${
          isDarkColorScheme ? "text-white" : "text-gray-900"
        }`}
      >
        Attachments ({validAttachments.length})
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {validAttachments.filter(Boolean).map(renderAttachment)}
      </View>

      <AttachmentPreviewDialog
        attachment={previewAttachment}
        visible={previewVisible}
        onClose={() => {
          setPreviewVisible(false);
          setPreviewAttachment(null);
        }}
      />
    </View>
  );
}

// Add displayName for debugging
AttachmentViewer.displayName = "AttachmentViewer";

export { AttachmentViewer };
``;
