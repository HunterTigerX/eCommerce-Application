import { useState } from 'react';
import Modal from 'react-modal';
import { Navigate } from 'react-router';
import { Button, Descriptions, DescriptionsProps, DatePicker, Form, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { getName } from 'country-list';
import dayjs from 'dayjs'; //, { Dayjs }
import { useAuth } from '@shared/hooks';
import { ApiClient } from '@app/auth/client';
import {
  validateData,
  // validateEmail,
  // validateField,
  // validatePassword,
  // validatePostalCode,
  // validateStreet,
} from '@features/Validation';
import './Profile.css';

const apiClient = new ApiClient();

export const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { user } = useAuth();
  const dateFormat = 'YYYY-MM-DD';
  // console.log(user);

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

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const changeUserData = () => {
    const newName = name ? name : '';
    const newLastName = lastName ? lastName : '';
    const hasSpecialCharacters = /[!@#$%'^&*(),.?":{}|<>0-9\\-]|[!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
    const newDateInput = document.getElementById('dateOfBirth') as HTMLInputElement;

    if (hasSpecialCharacters.test(newName) || newName.length === 0) {
      messageApi.open({
        type: 'error',
        content: 'First name Must contain at least one character and no special characters or numbers',
        duration: 2,
        style: {
          color: 'red',
        },
      });
    } else if (hasSpecialCharacters.test(newLastName) || newLastName.length === 0) {
      messageApi.open({
        type: 'error',
        content: 'Last name Must contain at least one character and no special characters or numbers',
        duration: 2,
        style: {
          color: 'red',
        },
      });
    } else if (newDateInput.value !== '') {
      const dateFromInput = new Date(newDateInput.value);
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
      if (
        targetDate.getMonth() > currentDate.getMonth() ||
        (targetDate.getMonth() === currentDate.getMonth() && targetDate.getDate() > currentDate.getDate())
      ) {
        targetDate.setFullYear(targetDate.getFullYear() - 1);
      }
      // Если введённая дата валидна (более 13 лет назад, выше проверка на високосный год)
      if (dateFromInput < targetDate) {
        if (user) {
          apiClient.requestBuilder
            .me()
            .post({
              body: {
                version: user.version,
                actions: [
                  {
                    action: 'setFirstName',
                    firstName: newName,
                  },
                  {
                    action: 'setLastName',
                    lastName: newLastName,
                  },
                  {
                    action: 'setDateOfBirth',
                    dateOfBirth: newDateInput.value,
                  },
                ],
              },
            })
            .execute()
            .then(() => {
              window.location.reload(); // Подумать над тем, как можно сделать без перезагрузки страницы
            });
        }
      }
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const currentDate = dayjs();
    const selectedDate = dayjs(current);
    return selectedDate.isAfter(currentDate);
  };

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
            <div className="profile-change-buttons">
              <Button type="primary" onClick={openModal}>
                Edit user
              </Button>
              <Button type="primary" onClick={openModal}>
                Edit address
              </Button>
            </div>
          </div>
          <div>
            <Modal isOpen={isOpen} ariaHideApp={false} onRequestClose={closeModal}>
              {contextHolder}
              <h2>Personal info</h2>
              <Form
                className="personal-info-form"
                initialValues={{ dateOfBirth: dayjs(user?.dateOfBirth, dateFormat) }}
              >
                <label>
                  <div>Name:</div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                  <div>Last Name:</div>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
                <br />
                <label className="personal-info-date">
                  <div className="dateOfBirth">Date of Birth:</div>
                  <Form.Item name="dateOfBirth" required={true} rules={[{ validator: validateData }]}>
                    <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
                  </Form.Item>
                </label>
                <br />
                <div className="modal-controls">
                  <button onClick={changeUserData}>Submit</button>
                  <button onClick={closeModal}>Close</button>
                </div>
              </Form>
            </Modal>
          </div>
        </>
      ) : (
        <Navigate to={'/'} replace={true} />
      )}
    </>
  );
};
