import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <>
        <br></br>This is profile page
      </>
    </>
  );
}
