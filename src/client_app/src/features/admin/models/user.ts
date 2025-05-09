export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  groupNames: string[];
  active: boolean;
}

export interface CreateUserModel {
  fullName: string;
  email: string;
  companyId: string;
  groupIds: string[];
}

export interface UpdateUserModel extends CreateUserModel {
  active: boolean;
}
