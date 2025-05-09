 

export interface ViewCommentModel {
    id: string;
    name: string;
    type: string;
    dueDays: number;
    companyNames: string[];
    active: boolean;
}

export interface PaginatedViewCommentModel {
    items: ViewCommentModel[];
    totalCount: number;
    totalPages: number;
}