export interface CreateGroupModel {
    name: string;
    type: string;
    companyIds: string[];
    userIds: string[];
}

export interface UpdateGroupModel extends CreateGroupModel {
    active: boolean;
}

export interface GroupModel {
    id: string;
    name: string;
    type: string;
    companyNames: string[];
    active: boolean;
}

export interface PaginatedGroupModel {
    items: GroupModel[];
    totalCount: number;
    totalPages: number;
}