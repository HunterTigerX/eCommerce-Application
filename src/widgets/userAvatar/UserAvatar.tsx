import { Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import classes from './UserAvatar.module.css';

// Подумать над добавлением crossOrigin для анонима / пользователя, чтобы лого было всегда
const UserAvatar = ({ username }: { username: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  const conditional = username.length <= 8;

  return (
    <Space size={16} wrap>
      <Avatar
        onClick={handleClick}
        className={!conditional ? classes.outlined : ''}
        size={conditional ? 40 : undefined}
        icon={!conditional ? <UserOutlined /> : null}
      >
        {username || null}
      </Avatar>
    </Space>
  );
};

export { UserAvatar };
