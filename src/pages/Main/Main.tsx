import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '@shared/hooks';

export const Main = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { user } = useAuth();

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
    <div style={{ color: '#000' }}>
      <h2>Main page</h2>
      {contextHolder}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
};
