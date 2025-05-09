import { handleResponse } from "@/helpers/handle-response";
import { toQueryString } from "@/helpers/to-query-string";
import {
  CreateProjectModel,
  PaginatedProjectListViewModel,
  UpdateProjectModel,
} from "@admin/models/project";
import env from "@env";

export async function getProjects(
  sortField?: string,
  sortOrder?: string,
  pageNumber?: number,
  pageSize?: number,
  search?: string
): Promise<PaginatedProjectListViewModel> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/projects?${toQueryString({
      sortField,
      sortOrder,
      pageNumber,
      pageSize,
      search,
    })}`,
    requestOptions
  ).then(handleResponse);
}

export async function checkProjectNameExists(name?: string, id?: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${env.VITE_APP_API_END_POINT}/projects/exists?${toQueryString({
        name,
        id,
      })}`,
      requestOptions
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createProject(model: CreateProjectModel) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  };
  return fetch(`${env.VITE_APP_API_END_POINT}/projects`, requestOptions).then(
    handleResponse
  );
}

export async function updateProject(id: number, model: UpdateProjectModel) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  };
  return fetch(
    `${env.VITE_APP_API_END_POINT}/projects/${id}`,
    requestOptions
  ).then(handleResponse);
}
