import { withAnonymousSession } from './tokenMethods/clientAnonymousFlow.tsx';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

function generateUniqId(): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 16) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// При первом входе на сайт даёт пользователю анонимный айди, и на основе его генерирует пользователю
// access и refresh токены, в дальнейшем настроенные на скоупы анонимного пользователя
export async function giveAnonToken() {
  const isTokenExixt = localStorage.getItem('access_token');
  if (!isTokenExixt) {
    const userAnonId = generateUniqId();
    localStorage.setItem('anon_id', userAnonId);
    const client = withAnonymousSession(userAnonId);
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
