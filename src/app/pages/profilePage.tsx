import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavButtons from '../login/navigation.tsx';

export function ProfilePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const custumerId = localStorage.getItem('customerId');
    if (!custumerId) {
      navigate('/main');
    }
  }, [navigate]);
  return (
    <>
      <NavButtons />
      <>
        <br></br>This is profile page
      </>
    </>
  );
}
