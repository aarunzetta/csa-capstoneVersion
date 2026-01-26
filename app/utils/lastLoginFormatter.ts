export const formatLastLogin = (
  dateValue: string | Date | undefined,
): string => {
  if (!dateValue) return "Never";

  const now = new Date();
  const date = new Date(dateValue);

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 1 minute
  if (diffMinutes < 1) {
    return "Just now";
  }

  // 1–59 minutes
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  // 1–23 hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // 1–7 days
  if (diffDays <= 7) {
    return `${diffDays}d ago`;
  }

  // More than 7 days
  return formatDate(date, false);
};
