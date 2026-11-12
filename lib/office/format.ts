export function todayISO() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function relativeTime(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export function formatCad(amount: number) {
  const formatted = new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(
    Math.round(amount),
  );
  return `$${formatted} CAD`;
}

export function formatCount(amount: number) {
  return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(
    Math.round(amount),
  );
}

export function needsReverify(date: string | null) {
  if (!date) return true;
  const then = new Date(`${date}T00:00:00`);
  return (Date.now() - then.getTime()) / 86400000 > 60;
}

export function websiteHref(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export const STATUS_LABEL: Record<string, string> = {
  todo: "To do",
  doing: "Doing",
  done: "Done",
  on_hold: "On hold",
  open: "Open",
  decided: "Decided",
  watching: "Watching",
  resolved: "Resolved",
  low: "Low",
  medium: "Medium",
  high: "High",
};
