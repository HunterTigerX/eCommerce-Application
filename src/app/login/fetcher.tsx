export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);
  const json = await response.clone().json();
  if (json.access_token) localStorage.setItem('access_token', json.access_token);
  if (json.refresh_token) localStorage.setItem('refresh_token', json.refresh_token);
  if (json.statusCode === 400) {
    localStorage.setItem('errorMessage', json.message);
    localStorage.removeItem('userData');
  }
  return response;
};
