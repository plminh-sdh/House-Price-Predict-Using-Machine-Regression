import { handleResponse } from '@/helpers/handle-response';
import env from '@env';

export function getCompanies() {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(`${env.VITE_APP_API_END_POINT}/companies`, requestOptions).then(
    handleResponse,
  );
}
