import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { useAuth } from '@shared/hooks';

type FieldType = {
  email: string;
  password: string;
};

const SignInInputForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
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
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { SignInInputForm };
