// utils/status.ts
export function getUserStatus(isOnline: boolean, lastSeen: Date): string {
  if (isOnline) return "Online";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const mins = Math.floor(diff / 1000 / 60);
  if (mins < 1) return "Last seen just now";
  if (mins < 60) return `Last seen ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `Last seen ${hours}h ago`;
}
