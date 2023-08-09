/* eslint-disable @typescript-eslint/no-unused-vars */
import { withPasswordFlow } from '../../app/login/tokenMethods/getClient/clientPasswordFlow.tsx';
import { createApiBuilderFromCtpClient, ApiRoot } from '@commercetools/platform-sdk';

const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

export async function validate(name: string, password: string, remember?: string) {
  const client = withPasswordFlow(name, password);

  const getApiRoot: () => ApiRoot = () => {
    return createApiBuilderFromCtpClient(client);
  };

  let wasUserAdded = false;

  //Если логин успешный, сохраняем айди пользователя для дальнейших манипуляций
  const validateUser = async () => {
    try {
      await getApiRoot()
        .withProjectKey({ projectKey })
        .me()
        .login()
        .post({
          body: {
            email: name,
            password: password,
          },
        })
        .execute()
        .then(({ body }) => {
          localStorage.setItem('userData', JSON.stringify(body.customer));
          localStorage.setItem('customerId', body.customer.id);
          wasUserAdded = true;
        })
        .catch(console.error);
    } catch (e) {
      console.log(e);
    }
  };
  await validateUser();

  // Проверяем, создался ли пользователь
  if (!wasUserAdded) {
    localStorage.removeItem('customerId');
  }
}
