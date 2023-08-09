import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const RootPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/main');
  }, [navigate]);

  return <></>;
};
