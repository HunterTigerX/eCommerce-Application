import { Navigate } from 'react-router';
import { Descriptions, DescriptionsProps } from 'antd';
import { getName } from 'country-list';
import { useAuth } from '@shared/hooks';
import './Profile.css';

export const Profile = () => {
  const { user } = useAuth();
  console.log(user);

  const items: DescriptionsProps['items'] = [];

  function fillDesriptionProps() {
    let newKey = 1;

    items?.push({
      key: newKey,
      label: 'Personal information',
      children: '',
      className: 'emptyPrev',
    });
    if (user) {
      // Заполняем данные пользователя, основываясь на доступных данных
      const userData = [];
      if (`${user?.firstName}` !== 'undefined') {
        userData.push(['Name', `${user?.firstName}`]);
      }
      if (`${user?.lastName}` !== 'undefined') {
        userData.push(['Last Name', `${user?.lastName}`]);
      }
      if (`${user?.dateOfBirth}` !== 'undefined') {
        userData.push(['Date of birth', `${user?.dateOfBirth}`]);
      }
      for (let i = 0; i < userData.length; i += 1) {
        newKey += 1;
        items?.push({
          key: newKey,
          label: userData[i][0],
          children: userData[i][1],
        });
      }

      // Заполняем адрес, основываясь на доступных данных
      for (let i = 0; i < user.addresses.length; i += 1) {
        newKey += 1;
        const fullAddress = [];

        if (`${user?.addresses[i].country}` !== 'undefined') {
          fullAddress.push(['Country', getName(`${user?.addresses[i].country}`)]);
        }
        if (`${user?.addresses[i].state}` !== 'undefined') {
          fullAddress.push(['State', `${user?.addresses[i].state}`]);
        }
        if (`${user?.addresses[i].city}` !== 'undefined') {
          fullAddress.push(['City', `${user?.addresses[i].city}`]);
        }

        const fullStreet = [];
        if (`${user?.addresses[i].streetName}` !== 'undefined') {
          fullStreet.push(`${user?.addresses[i].streetName}`);
        }
        if (`${user?.addresses[i].streetNumber}` !== 'undefined') {
          fullStreet.push(`${user?.addresses[i].streetName}`);
        }
        if (`${user?.addresses[i].additionalStreetInfo}` !== 'undefined') {
          fullStreet.push(`${user?.addresses[i].streetName}`);
        }
        if (fullStreet.length !== 0) {
          fullAddress.push(['Street', fullStreet.join(', ')]);
        }

        if (`${user?.addresses[i].postalCode}` !== 'undefined') {
          fullAddress.push(['Zip code', `${user?.addresses[i].postalCode}`]);
        }

        const addressId = user.addresses[i].id as string;

        let address = '';
        const defaultBillingAddressId = user?.defaultShippingAddressId;
        const defaultShippingAddressId = user?.defaultBillingAddressId;
        let defaultShippingAddressList: string[] = [];
        let defaultBillingAddressList: string[] = [];

        if (user?.shippingAddressIds) {
          defaultShippingAddressList = user?.shippingAddressIds;
        }
        if (user?.billingAddressIds) {
          defaultBillingAddressList = user?.billingAddressIds;
        }

        if (user.addresses[i].id === defaultBillingAddressId && addressId === defaultShippingAddressId) {
          address = 'Default billing and shipping address';
        } else if (addressId === defaultBillingAddressId) {
          address = 'Default billing address';
        } else if (addressId === defaultShippingAddressId) {
          address = 'Default shipping address';
        } else if (defaultShippingAddressList.includes(addressId)) {
          address = 'Shipping address';
        } else if (defaultBillingAddressList.includes(addressId)) {
          address = 'Shipping address';
        }

        // Делаем заголовок типа адреса
        items?.push({
          key: newKey,
          label: address,
          children: address,
          className: 'emptyPrev',
        });

        // Заполняем адрес данными
        for (let x = 0; x < fullAddress.length; x += 1) {
          newKey += 1;
          items?.push({
            key: newKey,
            label: fullAddress[x][0],
            children: fullAddress[x][1],
          });
        }
      }
    }
  }

  // Делаем ширину заголовков типа адреса в 2 ячейки
  function changeColspans() {
    const listOfElements: NodeListOf<HTMLElement> = document.querySelectorAll('.emptyPrev');
    console.log(document.querySelectorAll('.emptyPrev'));
    listOfElements.forEach((element, index) => {
      if (index % 2 !== 0) {
        element.style.display = 'none';
      } else {
        (element as HTMLTableCellElement).colSpan = 2;
      }
    });
  }

  async function fillPage() {
    await fillDesriptionProps();
    await changeColspans();
  }
  fillPage();

  return (
    <>
      {user ? (
        <>
          <h2>Profile</h2>
          <div>
            <Descriptions
              // title={`Hello, ${user?.firstName}`}
              bordered
              items={items}
              column={1}
            />
          </div>
        </>
      ) : (
        <Navigate to={'/'} replace={true} />
      )}
    </>
  );
};
