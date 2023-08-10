import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { validate } from './SignInValidation.tsx';

type FieldType = {
  email: string;
  password: string;
  remember?: string;
};

const SignInForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const Navigate = useNavigate();
  const onFinish = async (values: FieldType) => {
    const email = values.email;
    const password = values.password;

    function validateEmail(): boolean {
      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!emailRegex.test(email)) {
        if (!email.includes('@')) {
          messageApi.open({
            type: 'error',
            content: "Email address must contain an '@' symbol.",
          });
          return false;
        } else if (email.split('@')[1].trim() === '') {
          messageApi.open({
            type: 'error',
            content: 'Email address must contain a domain name.',
          });
          return false;
        } else if (email.trim() === '') {
          messageApi.open({
            type: 'error',
            content: 'Email address must not contain leading or trailing whitespace.',
          });
          return false;
        }
        messageApi.open({
          type: 'error',
          content: 'Email address must be properly formatted',
        });
        return false;
      }
      return true;
    }

    // Usage example:
    if (validateEmail()) {
      await validate(email, password);

      const userID = localStorage.getItem('customerId');
      const errorMessage = localStorage.getItem('errorMessage');

      if (userID !== 'undefined' && userID !== null) {
        const userDataLS = localStorage.getItem('userData');
        if (userDataLS) {
          localStorage.setItem('loggedIn', 'true');
          Navigate('/main');
        }
      } else {
        messageApi.open({
          type: 'error',
          content: errorMessage,
        });
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        name="login_form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
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

        <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
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

export { SignInForm };
