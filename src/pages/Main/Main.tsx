import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '@shared/hooks';

export const Main = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });

  useEffect(() => {
    const hi = state?.hi;
    const bye = state?.bye;

    if (hi || bye) {
      messageApi.open({
        type: 'success',
        content: hi ? `Hello, ${hi}` : `Goodbye, ${bye}`,
      });

      navigate('/', { replace: true });
    }
  }, [state, messageApi, navigate]);

  return (
    <div style={{ color: '#000' }}>
      <h2>Main page</h2>
      {contextHolder}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
};
