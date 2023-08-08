import React from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { giveAnonToken } from './firstLogin.tsx';
import { message } from 'antd';
import { userDataParser } from './getCustomer.tsx';
import { ReturnAvatarLogo } from '../login/userAvatar/avatar_logo.tsx';
import { revokeToken } from './tokenMethods/revokeToken.tsx';

const NavButtons: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const Navigate = useNavigate();
  const custumerId = localStorage.getItem('customerId');
  const mainPage = () => {
    Navigate('/main');
  };

  const text = custumerId ? 'Logout' : 'Log In';
  console.log(custumerId);

  const logInOutPage = () => {
    // Если пользователь хранится в LocalStorage, кнопка логаут, если нет, логин
    // Можно разбить потом на 2 части, чтобы было как в логотипом аватара
    if (custumerId) {
      const tokenToCheck = localStorage.getItem('access_token');
      if (tokenToCheck) {
        revokeToken(tokenToCheck);
      }

      Navigate('/main');

      localStorage.clear();

      giveAnonToken();

      messageApi.open({
        type: 'success',
        content: 'Goodbye, username',
      });
    } else {
      Navigate('/login');
    }
  };

  const customerId = localStorage.getItem('customerId');
  const userName = userDataParser().firstName;
  console.log(userName)
  const AvatarLogo = userName === '' ? ReturnAvatarLogo() : ReturnAvatarLogo(userName);
  const avatarLogo: JSX.Element | null = customerId ? <AvatarLogo /> : null;

  return (
    <>
      {contextHolder}
      <Space wrap>
        <Button type="primary" onClick={mainPage}>
          Main page
        </Button>
        <Button type="primary" onClick={logInOutPage}>
          {text}
        </Button>
        {avatarLogo}
      </Space>
    </>
  );
};

export default NavButtons;
