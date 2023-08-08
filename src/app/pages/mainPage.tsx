import NavButtons from '../login/navigation.tsx';
import { message } from 'antd';
import { useEffect } from 'react';

type UserData = {
  firstName: string;
};

export function MainPage() {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
  if (localStorage.getItem('loggedIn')) {
    const userDataLS = localStorage.getItem('userData');
    if (userDataLS) {
      const userData: UserData = JSON.parse(userDataLS);
      messageApi.open({
        type: 'success',
        content: `Hello, ${userData.firstName}`,
      });
      localStorage.removeItem('loggedIn')
    }
  }
}, [messageApi]);
  return (
    <>
      {contextHolder}
      <NavButtons />
      <>
        <br></br>This is main page
      </>
    </>
  );
}
