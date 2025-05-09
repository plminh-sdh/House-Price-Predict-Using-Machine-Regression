import { handleResponse } from "@/helpers/handle-response";
import { CreateUserModel, UpdateUserModel } from "@admin/models/user";
import { UserFilter } from "@admin/pages/UserAdmin";
import env from "@env";

export async function getAllUsers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users`,
    requestOptions
  );
  return handleResponse(response);
}

export async function getUsers(model: UserFilter) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let query = `?currentPage=${model.currentPage ?? 1}&pageSize=${model.pageSize}`;
  if (model.searchText) query += `&searchText=${model.searchText}`;

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users/search${query}`,
    requestOptions
  );
  return handleResponse(response);
}

export async function getUserById(id: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users/${id}`,
    requestOptions
  );
  return handleResponse(response);
}

export async function currentAssignedUser(id: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(
    `${env.VITE_APP_API_END_POINT}/users/${id}/active-comments`,
    requestOptions
  ).then(handleResponse);
}

export async function getUsersByCompanyIds(companyIds: string[]) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const query = companyIds.map((id) => `ids=${id}`).join("&");

  return fetch(
    `${env.VITE_APP_API_END_POINT}/users/companies?${query}`,
    requestOptions
  ).then(handleResponse);
}

export async function checkExistingUser(email: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const encodedMail = encodeURIComponent(email);
  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users/exist/${encodedMail}`,
    requestOptions
  );
  return handleResponse(response);
}

export async function createUser(user: CreateUserModel) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users`,
    requestOptions
  );
  return handleResponse(response);
}

export async function updateUser(id: string, user: UpdateUserModel) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users/${id}`,
    requestOptions
  );
  return handleResponse(response);
}

export async function deleteUser(id: string) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/users/${id}`,
    requestOptions
  );
  return handleResponse(response);
}
