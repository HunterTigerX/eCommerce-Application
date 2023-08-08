import React from 'react';
import { Result } from 'antd';

const ErrorBlock: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you are looking do not exist."
  />
);

export default ErrorBlock;