const { VITE_API: api, VITE_PROJECT_KEY: projectKey } = import.meta.env;

class FetchExistingUser {
  async userDataParser(id: string) {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem('access_token');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    return fetch(`${api}/${projectKey}/customers/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error('error', error));
  }
}

export const fetchUser = new FetchExistingUser();

// Сделать класс с разными методами получения данных пользователя

/*

curl --get https://https://api.europe-west1.gcp.commercetools.com.commercetools.com/{projectKey}/customers/ecommerce-tools -i \
--header 'Authorization: Bearer 77SD4FPASbguLlfsf9a6XE9k9isQ6UuJ'

curl --get https://api.{region}.commercetools.com/{projectKey}/customers/{id} -i \
--header 'Authorization: Bearer ${BEARER_TOKEN}'

*/
