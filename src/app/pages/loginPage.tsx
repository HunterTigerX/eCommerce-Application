import LoginInputForm from '../login/LoginForm.tsx';
import NavButtons from '../login/navigation.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const custumerId = localStorage.getItem('customerId');
    console.log(custumerId, 'custumerId')
    if (custumerId) {
      navigate('/main');
    }
  }, [navigate]);
  return (
    <>
      <NavButtons />
      <LoginInputForm />
    </>
  );
}

// customerId
