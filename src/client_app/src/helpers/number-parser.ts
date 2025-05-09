import { sizeOptions } from "@/features/client/components/TablePagination";

export function parsePositiveNumber(value: string | null): number | undefined {
  return value ? (parseInt(value) > 0 ? parseInt(value) : undefined) : undefined;
}

export function parsePageSize(pageSize: string | null): number | undefined {
  const size = parsePositiveNumber(pageSize);
  return size && sizeOptions.some((o: any) => parseInt(o.value) === size) ? size : undefined;
}
