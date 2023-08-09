const { VITE_CLIENT_ID: clientId, VITE_CLIENT_SECRET: clientSecret, VITE_AUTH: host } = import.meta.env;

export function revokeToken(token: string) {
  const credentials = btoa(clientId + ':' + clientSecret);
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${credentials}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('token', `${token}`);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  fetch(`${host}/oauth/token/revoke`, requestOptions)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log('error', error));
  localStorage.removeItem('access_token');
}
