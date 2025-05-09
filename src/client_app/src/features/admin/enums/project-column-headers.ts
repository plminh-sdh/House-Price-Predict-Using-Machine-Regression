export enum ProjectColumnHeader {
  Id = "id",
  ProjectName = "projectName",
  Company = "company",
}

export enum ProjectColumnHeaderSortKey {
  Id = "Id",
  ProjectName = "ProjectName",
  Company = "Company",
}

export const ProjectColumnHeaderDisplayNames = [
  {
    key: ProjectColumnHeader.Id,
    sortKey: ProjectColumnHeaderSortKey.Id,
    value: "Project ID",
  },
  {
    key: ProjectColumnHeader.ProjectName,
    sortKey: ProjectColumnHeaderSortKey.ProjectName,
    value: "Project Name",
  },
  {
    key: ProjectColumnHeader.Company,
    sortKey: ProjectColumnHeaderSortKey.Company,
    value: "Company",
  },
];
