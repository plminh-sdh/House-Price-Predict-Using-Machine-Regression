import { PaginationModel } from "./pagination";

export interface Filter extends PaginationModel
{
    searchText: string;
}