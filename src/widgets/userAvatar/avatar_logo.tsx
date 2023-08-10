import React from 'react';
import { Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
/* import { UserOutlined } from '@ant-design/icons'; */
import './avatar_logo.css';

// Подумать над добавлением crossOrigin для анонима / пользователя, чтобы лого было всегда
export function ReturnAvatarLogo(uName?: string) {
  const Navigate = useNavigate();
  const goToProfile = () => {
    Navigate('/profile');
  };
  if (uName && uName.length <= 8) {
    const AvatarLogo: React.FC = () => (
      <Space size={16} wrap>
        <Avatar onClick={goToProfile} size={40}>
          {uName}
        </Avatar>
      </Space>
    );
    return AvatarLogo;
  } else {
    const AvatarLogo: React.FC = () => (
      <Space size={16} wrap>
        <Avatar onClick={goToProfile} style={{ backgroundColor: '#87d068' }} /* icon={<UserOutlined />} */ />
      </Space>
    );
    return AvatarLogo;
  }
}
