import { handleResponse } from "@/helpers/handle-response";
import { CreateGroupModel } from "@admin/models/group";
import { toQueryString } from "@/helpers/to-query-string";
import env from "@env";

export async function getByCompany(companyId: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/company/${companyId}`,
    requestOptions
  ).then(handleResponse);
}

export async function getGroupById(id: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/${id}`,
    requestOptions
  ).then(handleResponse);
}

export async function currentAssignedGroup(id: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/${id}/active-comments`,
    requestOptions
  ).then(handleResponse);
}

export async function getGroups(
  pageNumber?: number,
  pageSize?: number,
  search?: string
) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const query = toQueryString({ pageNumber, pageSize, search });

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/search?${query}`,
    requestOptions
  ).then(handleResponse);
}

export function createGroup(createGroupModel: CreateGroupModel) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createGroupModel),
  };

  return fetch(`${env.VITE_APP_API_END_POINT}/groups`, requestOptions).then(
    handleResponse
  );
}

export async function updateGroup(
  id: string,
  updateGroupModel: CreateGroupModel
) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateGroupModel),
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/${id}`,
    requestOptions
  ).then(handleResponse);
}

export async function deleteGroup(id: string) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/${id}`,
    requestOptions
  ).then(handleResponse);
}

export async function checkGroupNameExits(
  name: string,
  id?: string
): Promise<{ exists: boolean }> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const query = toQueryString({ name, id });

  return fetch(
    `${env.VITE_APP_API_END_POINT}/groups/exists?${query}`,
    requestOptions
  ).then(handleResponse);
}
