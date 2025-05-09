import { handleResponse } from "@/helpers/handle-response";
import { toQueryString } from "@/helpers/to-query-string";
import env from "@env";

export function getComments(
  currentPage: number,
  pageSize: number,
  search: string = ""
) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const query = `page=${currentPage}&size=${pageSize}&search=${search}`;
  return fetch(
    `${env.VITE_APP_API_END_POINT}/comments?${query}`,
    requestOptions
  ).then(handleResponse);
}
