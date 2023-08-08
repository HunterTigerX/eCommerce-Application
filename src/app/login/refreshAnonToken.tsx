import { withRefreshToken } from './tokenMethods/withRefreshToken.tsx';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

// Если у нас просрочен анонимный токен, то на основе рефреш токена мы получаем новый access token для посетителя сайта
export async function refreshAnonToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    const client = withRefreshToken(refreshToken);
    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });

    const getProject = async () => {
      try {
        return await apiRoot.get().execute();
      } catch (e) {
        console.log(e);
      }
    };
    await getProject();
  }
}
