/** MVP: SERP ranking is deferred. Preserve schema and Not available state. */
export function collectSearch() {
  return {
    available: false as const,
    note: "Search ranking / SERP visibility: Not available in this report version. Metadata-only signals are scored under Discoverability.",
  }
}
