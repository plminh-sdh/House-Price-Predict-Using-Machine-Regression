export interface ProjectViewModel {
  id: number;
  projectName: string;
  company: string;
}

export interface PaginatedProjectListViewModel {
  items: ProjectViewModel[];
  totalCount: number;
  totalPages: number;
}

export interface CreateProjectModel {
  projectName: string;
  companyName: string;
}

export interface UpdateProjectModel {
  projectName: string;
  companyName: string;
}
