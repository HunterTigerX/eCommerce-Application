import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginInputForm from '../../app/login/LoginForm.tsx';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const custumerId = localStorage.getItem('customerId');
    if (custumerId) {
      navigate('/main');
    }
  }, [navigate]);
  const customerId = localStorage.getItem('customerId');

  if (!customerId) {
    return (
      <>
        <LoginInputForm />
      </>
    );
  }
}

// customerId
