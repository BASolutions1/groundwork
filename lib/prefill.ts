export const BUSINESS_PREFILL_EVENT = "groundwork:business";

export function publishBusinessPrefill(value: string) {
  const trimmed = value.trim();
  const url = new URL(window.location.href);
  if (trimmed) url.searchParams.set("business", trimmed);
  else url.searchParams.delete("business");
  window.history.pushState({}, "", `${url.pathname}${url.search}#start`);
  window.dispatchEvent(
    new CustomEvent<string>(BUSINESS_PREFILL_EVENT, { detail: trimmed }),
  );
  document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
}

export function readBusinessPrefill() {
  return new URLSearchParams(window.location.search).get("business") ?? "";
}
