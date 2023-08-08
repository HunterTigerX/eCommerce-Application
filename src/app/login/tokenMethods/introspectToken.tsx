import { refreshAnonToken } from "../refreshAnonToken.tsx";

const { VITE_CLIENT_ID: clientId, VITE_CLIENT_SECRET: clientSecret, VITE_AUTH: host } = import.meta.env;

interface TokenIntrospection {
  active: boolean;
  client_id: string;
  exp: number;
  scope: string;
}

// Проверяет статус токена, активен ли он ещё или уже просрочен. В случае, если
// токен просрочен. Если токен был от анонимного пользователя и он просрочен,
// на основе refresh токена генерируется новый токен доступа для анонимного пользователя
export function checkToken(token: string) {
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

  fetch(`${host}/oauth/introspect`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result: TokenIntrospection) => {
      if (!result.active) {
        const anonId = localStorage.getItem('anon_id');
        console.log('anonId', anonId);
        if (anonId) {
          refreshAnonToken();
        }
        console.log('token prosrochen');
      }
    })
    .catch((error) => console.log('error', error));
}
