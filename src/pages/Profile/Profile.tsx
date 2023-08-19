import { useAuth } from '@shared/hooks';
import { Descriptions, DescriptionsProps } from 'antd';

export const Profile = () => {
  const { user } = useAuth();

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'UserName',
      children: user?.firstName,
    },
    {
      key: '2',
      label: 'Email',
      children: user?.email,
    },
    {
      key: '3',
      label: 'Date of birth',
      children: user?.dateOfBirth,
    },

    {
      key: '4',
      label: 'Address',
      children: `${user?.addresses[0].city}, ${user?.addresses[0].streetName} `,
    },
  ];

  return (
    <>
      <h2>Profile</h2>
      <div>
        <Descriptions title={`Hello, ${user?.firstName}`} items={items} />
      </div>
    </>
  );
};
