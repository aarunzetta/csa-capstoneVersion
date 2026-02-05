export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hideOn?: "mobile" | "tablet" | "mobile-tablet";
}
