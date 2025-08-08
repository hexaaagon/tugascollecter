export function getGreeting(
  t: (key: string, replacements?: Record<string, string | number>) => string,
) {
  const date = new Date();
  const hours = date.getHours();

  if (hours < 6) {
    return `${t("greeting.evening")}.`;
  } else if (hours < 12) {
    return `${t("greeting.morning")}.`;
  } else if (hours < 17) {
    return `${t("greeting.afternoon")}.`;
  } else if (hours < 21) {
    return `${t("greeting.evening")}.`;
  } else {
    return `${t("greeting.evening")}.`;
  }
}
