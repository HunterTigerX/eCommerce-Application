import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/es/interface';
import { validate } from './LoginValidation.tsx';
import { useNavigate } from 'react-router-dom';


type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

type UserData = {
  firstName: string
}
const LoginInputForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const Navigate = useNavigate();
  const onFinish = async (values: FieldType) => {
    const email = values.email;
    const password = values.password;
    const remember = values.remember;
    if (email && password && remember) {
      await validate(email, password, remember);

      const userID = localStorage.getItem('customerId');
      const errorMessage =  localStorage.getItem('errorMessage');

      if (userID !== 'undefined' && userID !== null) {
        const userDataLS = localStorage.getItem('userData');
        if (userDataLS) {
          const userData: UserData = JSON.parse(userDataLS);
          messageApi.open({
            type: 'success',
            content: `Hello, ${userData.firstName}`,
          });
          Navigate('/profile')
        }
      } else {
        messageApi.open({
          type: 'error',
          content: errorMessage,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log('Failed:', errorInfo);
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
        onFinishFailed={onFinishFailed}
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

export default LoginInputForm;
