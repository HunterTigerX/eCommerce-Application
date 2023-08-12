import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { ApiClient } from '@app/auth/client';


export async function SignInValidation(name: string, password: string) {
  const userObj: UserAuthOptions = {
    username: name,
    password: password,
  };
  let wasUserAdded = false;

  const apiClient = new ApiClient();
  apiClient.switchToPasswordFlow(userObj);
  await apiClient.requestBuilder
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
    });
  //Если логин успешный, сохраняем айди пользователя для дальнейших манипуляций

  // Проверяем, создался ли пользователь
  if (!wasUserAdded) {
    localStorage.removeItem('customerId');
  }
}
