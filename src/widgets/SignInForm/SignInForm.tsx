import React from 'react';
import { Button, Form, Input, message } from 'antd';
// import { useNavigate } from 'react-router-dom';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
// import { ApiClient } from '@app/auth/client';
import { useAuth } from '@shared/hooks';

type FieldType = {
  email: string;
  password: string;
  remember?: string;
};

const SignInInputForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { signIn } = useAuth();
  // const Navigate = useNavigate();
  const onFinish = async (values: FieldType) => {
    const email = values.email;
    const password = values.password;

    const credentials: UserAuthOptions = {
      username: email,
      password: password,
    };

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

    // function validatePass(): boolean {
    //   const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    //   if (password.length < 8) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password is too shord',
    //     });
    //     return false;
    //   }
    //   if (!/[a-z]/.test(password)) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password must contain at least one lowercase letter (A-Z).',
    //     });
    //     return false;
    //   }
    //   if (!/[A-Z]/.test(password)) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password must contain at least one uppercase letter (A-Z).',
    //     });
    //     return false;
    //   }
    //   if (!/\d/.test(password)) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password must contain at least one digit (0-9).',
    //     });
    //     return false;
    //   }
    //   if (!/[!@#$%^&*]/.test(password)) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password must contain at least one special character (e.g., !@#$%^&*).',
    //     });
    //     return false;
    //   }
    //   if (/\s/.test(password)) {
    //     messageApi.open({
    //       type: 'error',
    //       content: 'Password must not contain leading or trailing whitespace.',
    //     });
    //     return false;
    //   }
    //   return regex.test(password);
    // }

    if (
      validateEmail()
      // && validatePass()
    ) {
      signIn(credentials).then((result) => {
        if (!result.success) {
          messageApi.open({
            type: 'error',
            content: result.message,
          });
        } else {
          // Чтобы один раз сказать юзеру привет при входе в систему, удаляется сразу после приветствия в Main.tsx
          localStorage.setItem('userLoggedIn', 'true');
          messageApi.open({
            type: 'success',
            content: result.data.firstName,
          });
        }
      });
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
