export interface User {
  id: string;
  email: string;
  fullName: string;
  token?: string;
  refreshToken?: string;
  actions: string[];
  companyId: number;
}
