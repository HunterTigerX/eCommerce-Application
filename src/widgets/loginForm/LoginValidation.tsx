/* eslint-disable @typescript-eslint/no-unused-vars */
import { NewClient } from '@app/login/tokenMethods/getClient/clientClass'; 
import { createApiBuilderFromCtpClient, ApiRoot } from '@commercetools/platform-sdk';

const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

export async function validate(name: string, password: string) {
  const client = NewClient.withPasswordFlow(name, password);

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
            updateProductData: true,
            activeCartSignInMode: 'MergeWithExistingCustomerCart',
            // AnonymousCartSignInMode = 'MergeWithExistingCustomerCart' | 'UseAsNewActiveCustomerCart' ;
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
      console.error(e);
    }
  };
  await validateUser();

  // Проверяем, создался ли пользователь
  if (!wasUserAdded) {
    localStorage.removeItem('customerId');
  }
}
