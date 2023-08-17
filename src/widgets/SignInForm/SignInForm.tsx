import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { useAuth } from '@shared/hooks';

type FieldType = {
  email: string;
  password: string;
};

const SignInInputForm = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values: FieldType) => {
    const email = values.email;
    const password = values.password;

    const credentials: UserAuthOptions = {
      username: email,
      password: password,
    };

    signIn(credentials).then((result) => {
      if (!result.success) {
        messageApi.open({
          type: 'error',
          content: result.message,
          duration: 0.75,
        });
      } else {
        navigate('/', {
          replace: true,
          state: {
            hi: result.data.firstName,
          },
        });
      }
    });
  };

  let emailError = '';
  let passwordError = '';

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (email) {
      if (!emailRegex.test(email)) {
        if (!email.includes('@')) {
          emailError = "Email address must contain an '@' symbol.";
        } else if (email.split('@')[1].trim() === '') {
          emailError = 'Email address must contain a domain name.';
        } else if (email.trim() === '') {
          emailError = 'Email address must not contain leading or trailing whitespace.';
        } else {
          emailError = 'Email address must be properly formatted';
        }
      } else {
        emailError = '';
      }
    }
    return emailError === '' ? true : false;
  };

  const validatePassword = (password: string): boolean => {
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (password) {
      if (password.length < 8) {
        passwordError = 'Password must be at least 8 characters long';
      } else if (!/[a-z]/.test(password)) {
        passwordError = 'Password must contain at least one lowercase letter (A-Z).';
      } else if (!/[A-Z]/.test(password)) {
        passwordError = 'Password must contain at least one uppercase letter (A-Z).';
      } else if (!/\d/.test(password)) {
        passwordError = 'Password must contain at least one digit (0-9).';
      } else if (!/[!@#$%^&*]/.test(password)) {
        passwordError = 'Password must contain at least one special character (e.g., !@#$%^&*).';
      } else if (/\s/.test(password)) {
        passwordError = 'Password must not contain leading or trailing whitespace.';
      } else if (passRegex.test(password)) {
        passwordError = '';
      }
    }
    return passwordError === '' ? true : false;
  };

  return (
    <>
      <Form
        name="login_form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {contextHolder}
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            {
              validator: (_, username) => (validateEmail(username) ? Promise.resolve() : Promise.reject(emailError)),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              validator: (_, password) =>
                validatePassword(password) ? Promise.resolve() : Promise.reject(passwordError),
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <div>
          You don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </>
  );
};

export { SignInInputForm };
