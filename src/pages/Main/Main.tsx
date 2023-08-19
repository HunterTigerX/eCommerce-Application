import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuProps, message } from 'antd';
// import { useAuth } from '@shared/hooks';
import {
  HomeOutlined,
  ProfileOutlined,
  ReadOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label: <Link to="/">Home</Link>,
    key: 'mail',
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="catalog">Catalog</Link>,
    key: 'Catalog',
    icon: <ShoppingOutlined />,
  },
  {
    label: <Link to="about">About</Link>,
    key: 'about',
    icon: <ReadOutlined />,
  },
  {
    label: <Link to="/signin">Sign In</Link>,
    key: 'signin',
    icon: <UserOutlined />,
  },
  {
    label: <Link to="/signup">Sign Up</Link>,
    key: 'signup',
    icon: <UserAddOutlined />,
  },
  {
    label: <Link to="/profile">Profile</Link>,
    key: 'Profile',
    icon: <ProfileOutlined />,
  },
];

export const Main = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const hi = state?.hi;
  const bye = state?.bye;

  useEffect(() => {
    if (hi) {
      messageApi.open({
        type: 'success',
        content: `Hello, ${hi}`,
      });

      navigate('/', { replace: true });
    }

    if (bye) {
      messageApi.open({
        type: 'success',
        content: `Goodbye, ${bye}`,
      });

      navigate('/', { replace: true });
    }
  }, [hi, bye, messageApi, navigate]);

  // username: 'te145431323mp555da@mail.ru', password: 'test'

  return (
    <div style={{ color: '#000', width: '300px' }}>
      <h2>Main page</h2>
      {contextHolder}
      <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />
      {/* {user && <pre>{JSON.stringify(user, null, 2)}</pre>} */}
    </div>
  );
};
