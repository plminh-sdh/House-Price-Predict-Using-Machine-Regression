export interface PaginatedItemsModel<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
}