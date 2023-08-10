import { useEffect } from 'react';
import { message } from 'antd';
// import { useAuth } from '@shared/hooks';

type UserData = {
  firstName: string;
};

export const Main = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // const { user } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('loggedIn')) {
      const userDataLS = localStorage.getItem('userData');
      if (userDataLS) {
        const userData: UserData = JSON.parse(userDataLS);
        messageApi.open({
          type: 'success',
          content: `Hello, ${userData.firstName}`,
        });
        localStorage.removeItem('loggedIn');
      }
    }
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      <>
        <br></br>This is main page
      </>
    </>
  );
};
