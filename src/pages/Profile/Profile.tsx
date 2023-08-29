import { useState } from 'react';
import Modal from 'react-modal';
import { Navigate } from 'react-router';
import { Button, Checkbox, DatePicker, Descriptions, DescriptionsProps, Form, Input, Select, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { getName } from 'country-list';
import dayjs from 'dayjs';
import { useAuth } from '@shared/hooks';
import { ApiClient } from '@app/auth/client';
import { validateData, validatePassword } from '@features/Validation';
import './Profile.css';
import { fillDesriptionProps } from './userInfo.tsx';
import { MyCustomerChangePassword, MyCustomerUpdateAction, _BaseAddress } from '@commercetools/platform-sdk';
import { postcodeValidator } from 'postcode-validator';

const apiClient = new ApiClient();

type FieldType = {
  passwordOld: string;
  passwordNew: string;
};

export const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { user } = useAuth();
  const { refreshUser } = useAuth();
  const dateFormat = 'YYYY-MM-DD';
  const hasSpecialCharacters = /[!@#$%'^&*(),.?":{}|<>0-9\\-]|[!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
  const emailRegex = /^\S+@\S+\.\S+$/;

  // console.log(user);

  const [isUserInfoModalOpened, userInfoModalIsOpen] = useState(false);
  const [isAddressInfoModalOpened, userAddressModalIsOpen] = useState(false);
  const [isPasswordInfoModalOpened, userPasswordModalIsOpen] = useState(false);
  const [name, setName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);

  const openUserModal = () => {
    userInfoModalIsOpen(true);
  };

  const closeUserInfoModal = () => {
    userInfoModalIsOpen(false);
  };

  const closePasswordInfoModal = () => {
    userPasswordModalIsOpen(false);
  };

  const changeUserData = () => {
    const newName = name ? name : '';
    const newLastName = lastName ? lastName : '';
    const newEmail = email ? email : '';

    const newDateInput = document.getElementById('dateOfBirth') as HTMLInputElement;

    if (!emailRegex.test(newEmail)) {
      if (!newEmail.includes('@')) {
        messageApi.open({
          type: 'error',
          content: `Email address must contain an '@' symbol.`,
          duration: 2,
          style: {
            color: 'red',
          },
        });
      } else if (newEmail.split('@')[1].trim() === '') {
        messageApi.open({
          type: 'error',
          content: 'Email address must contain a domain name.',
          duration: 2,
          style: {
            color: 'red',
          },
        });
      } else if (newEmail.trim() === '') {
        messageApi.open({
          type: 'error',
          content: 'Email address must not contain leading or trailing whitespace.',
          duration: 2,
          style: {
            color: 'red',
          },
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Email address must be properly formatted',
          duration: 2,
          style: {
            color: 'red',
          },
        });
      }
    } else if (hasSpecialCharacters.test(newName) || newName.length === 0) {
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
                  {
                    action: 'changeEmail',
                    email: newEmail,
                  },
                ],
              },
            })
            .execute()
            .then(async () => {
              messageApi.open({
                type: 'success',
                content: `Information successfully updated`,
                duration: 2,
              });
              await refreshUser();
              closeUserInfoModal();
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

  const [clickedAddressId, setAddressId] = useState('');

  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [state, setState] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');

  const [postalCode, setPostalCode] = useState('');
  const [pOBox, setpOBox] = useState('');
  const [additionalAddressInfo, setAdditionalAddressInfo] = useState('');
  const [additionalStreetInfo, setAdditionalStreetInfo] = useState('');

  const [defaultShippingAddressCheckBox, setDefaultShippingAddressCheckBox] = useState(false);
  const [defaultBillingAddressCheckBox, setDefaultBillingAddressCheckBox] = useState(false);
  const [shippingAddressCheckBox, setShippingAddressCheckBox] = useState(false);
  const [billingAddressCheckBox, setBillingAddressCheckBox] = useState(false);

  const [shippingCountry, setShippingCountry] = useState('');

  const closeAddressInfoModal = () => {
    userAddressModalIsOpen(false);
  };

  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Germany', value: 'DE' },
    { label: 'Russia', value: 'RU' },
    { label: 'France', value: 'FR' },
  ];

  function changeAddressData() {
    // Валидируем почту
    let postalCodeError = '';

    if (shippingCountry === 'US') {
      postalCodeError = 'code should be (5 digits): XXXXX or (5-4 digits): XXXXX-XXXX';
    } else if (shippingCountry === 'RU') {
      postalCodeError = 'code should be (6 digits): XXXXXX';
    } else if (shippingCountry === 'FR' || shippingCountry === 'DE') {
      postalCodeError = 'code should be (5 digits): XXXXX';
    }

    if (!postcodeValidator(postalCode, shippingCountry)) {
      messageApi.open({
        type: 'error',
        content: postalCodeError,
        duration: 2.5,
        style: {
          color: 'red',
        },
      });
    } else {
      postalCodeError = '';
    }

    // Валидируем город
    let cityError = '';

    if (hasSpecialCharacters.test(city) || city.length === 0) {
      cityError = 'City name Must contain at least one character and no special characters or numbers';
      messageApi.open({
        type: 'error',
        content: 'City name Must contain at least one character and no special characters or numbers',
        duration: 2,
        style: {
          color: 'red',
        },
      });
    }

    // Валидируем улицу
    let streetError = '';
    if (streetName.length === 0 || streetName.trim() === '') {
      streetError = 'Street name Must contain at least one character';
      messageApi.open({
        type: 'error',
        content: 'Street name Must contain at least one character',
        duration: 2,
        style: {
          color: 'red',
        },
      });
    }

    if (postalCodeError === '' && cityError === '' && streetError === '') {
      const arrayOfKeys = [
        'streetName',
        'streetNumber',
        'additionalStreetInfo',
        'additionalStreetInfo',
        'postalCode',
        'city',
        'region',
        'state',
        'building',
        'apartment',
        'pOBox',
        'additionalAddressInfo',
      ];
      const arrayOfValues = [
        streetName,
        streetNumber,
        additionalStreetInfo,
        additionalStreetInfo,
        postalCode,
        city,
        region,
        state,
        building,
        apartment,
        pOBox,
        additionalAddressInfo,
      ];

      const addressArray = [
        ['id', clickedAddressId],
        ['country', shippingCountry],
      ];

      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;
      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];
      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      for (let i = 0; i < arrayOfValues.length; i += 1) {
        if (arrayOfValues[i] !== '') {
          addressArray.push([arrayOfKeys[i], arrayOfValues[i]]);
        }
      }

      const baseAddressObj: _BaseAddress = Object.fromEntries(addressArray);

      const actionsArray: MyCustomerUpdateAction[] = [
        {
          action: 'changeAddress',
          addressId: clickedAddressId,
          address: baseAddressObj,
        },
      ];

      // Проверяем биллинг и шиппинг адреса, если их включили и они не были таковыми,
      // добавляем им новые параметры, но если параметры были и мы выключили чекбоксы,
      // то проверяя наличие параметров, убираем их.
      if (shippingAddressCheckBox && !shippingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'addShippingAddressId',
          addressId: clickedAddressId,
        });
      } else if (!shippingAddressCheckBox && shippingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'removeShippingAddressId',
          addressId: clickedAddressId,
        });
      }

      if (billingAddressCheckBox && !billingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'addBillingAddressId',
          addressId: clickedAddressId,
        });
      } else if (!billingAddressCheckBox && billingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'removeBillingAddressId',
          addressId: clickedAddressId,
        });
      }

      // Если адрес стоит по умолчанию, делаем его таковым, если не стоит, проверяем,
      // был ли он до этого адресом по умолчанию, и если да, то сбрасываем адрем по умолчанию
      if (defaultBillingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultBillingAddress',
          addressId: clickedAddressId,
        });
      } else if (clickedAddressId === defaultBillingAddressId) {
        actionsArray.push({
          action: 'setDefaultBillingAddress',
        });
      }

      if (defaultShippingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultShippingAddress',
          addressId: clickedAddressId,
        });
      } else if (clickedAddressId === defaultShippingAddressId) {
        actionsArray.push({
          action: 'setDefaultShippingAddress',
        });
      }

      if (user) {
        apiClient.requestBuilder
          .me()
          .post({
            body: {
              version: user.version,
              actions: actionsArray,
            },
          })
          .execute()
          .then(async () => {
            messageApi.open({
              type: 'success',
              content: `Information successfully updated`,
              duration: 2,
            });
            await refreshUser();
            closeAddressInfoModal();
          });
      }
    }
  }

  function inputValidAddressInfo(buttonNumber: number) {
    if (user) {
      const userCity = user?.addresses[buttonNumber].city;
      const userRegion = user?.addresses[buttonNumber].region;
      const userState = user?.addresses[buttonNumber].state;
      const userStreetNumber = user?.addresses[buttonNumber].streetNumber;
      const userStreetName = user?.addresses[buttonNumber].streetName;
      const userBuilding = user?.addresses[buttonNumber].building;
      const userApartment = user?.addresses[buttonNumber].apartment;
      const userPostalCode = user?.addresses[buttonNumber].postalCode;
      const userpOBox = user?.addresses[buttonNumber].pOBox;
      const userAdditionalAddressInfo = user?.addresses[buttonNumber].additionalAddressInfo;
      const userAdditionalStreetInfo = user?.addresses[buttonNumber].additionalStreetInfo;

      const userCountry = user?.addresses[buttonNumber].country;
      setShippingCountry(userCountry);

      const addressId = user?.addresses[buttonNumber].id as string;
      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;

      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];
      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      // Ставим чекбоксы в зависимости от параметров
      if (addressId === defaultShippingAddressId) {
        setDefaultShippingAddressCheckBox(true);
      } else {
        setDefaultShippingAddressCheckBox(false);
      }

      if (addressId === defaultBillingAddressId) {
        setDefaultBillingAddressCheckBox(true);
      } else {
        setDefaultBillingAddressCheckBox(false);
      }

      if (shippingAddressList.includes(addressId)) {
        setShippingAddressCheckBox(true);
      } else {
        setShippingAddressCheckBox(false);
      }

      if (billingAddressList.includes(addressId)) {
        setBillingAddressCheckBox(true);
      } else {
        setBillingAddressCheckBox(false);
      }

      if (addressId) {
        setAddressId(addressId);
      } else {
        setAddressId('');
      }

      if (addressId) {
        setAddressId(addressId);
      } else {
        setAddressId('');
      }

      if (userCity) {
        setCity(userCity);
      } else {
        setCity('');
      }
      if (userRegion) {
        setRegion(userRegion);
      } else {
        setRegion('');
      }

      if (userState) {
        setState(userState);
      } else {
        setState('');
      }

      if (userStreetNumber) {
        setStreetNumber(userStreetNumber);
      } else {
        setStreetNumber('');
      }

      if (userStreetName) {
        setStreetName(userStreetName.trimStart().trimEnd());
      } else {
        setStreetName('');
      }

      if (userBuilding) {
        setBuilding(userBuilding);
      } else {
        setBuilding('');
      }

      if (userApartment) {
        setApartment(userApartment);
      } else {
        setApartment('');
      }

      if (userPostalCode) {
        setPostalCode(userPostalCode);
      } else {
        setPostalCode('');
      }

      if (userpOBox) {
        setpOBox(userpOBox);
      } else {
        setpOBox('');
      }

      if (userAdditionalAddressInfo) {
        setAdditionalAddressInfo(userAdditionalAddressInfo);
      } else {
        setAdditionalAddressInfo('');
      }

      if (userAdditionalStreetInfo) {
        setAdditionalStreetInfo(userAdditionalStreetInfo);
      } else {
        setAdditionalStreetInfo('');
      }
    }
  }

  const openAddressModal = (buttonNumber: number) => {
    inputValidAddressInfo(buttonNumber);
    userAddressModalIsOpen(true);
  };

  const openPasswordModal = () => {
    userPasswordModalIsOpen(true);
  };

  async function changePasswordData(values: FieldType) {
    if (user) {
      const body: MyCustomerChangePassword = {
        version: user.version,
        currentPassword: values.passwordOld,
        newPassword: values.passwordNew,
      };

      apiClient.requestBuilder
        .me()
        .password()
        .post({
          body,
        })
        .execute()
        .then(async () => {
          messageApi.open({
            type: 'success',
            content: `Information successfully updated`,
            duration: 2,
          });
          await refreshUser();
          closePasswordInfoModal();
        })
        .catch((error) => {
          messageApi.open({
            type: 'error',
            content: error.message,
            duration: 2,
          });
        });
    }
  }

  const userAddressesArray = [];

  function removeAddress(addressId: number): void {
    const deleteAddressId = user?.addresses[addressId].id as string;
    if (user) {
      apiClient.requestBuilder
        .me()
        .post({
          body: {
            version: user.version,
            actions: [{ action: 'removeAddress', addressId: deleteAddressId }],
          },
        })
        .execute()
        .then(async () => {
          messageApi.open({
            type: 'success',
            content: `Address successfully deleted`,
            duration: 2,
          });
          await refreshUser();
          closeAddressInfoModal();
        });
    }
  }

  // Заполняем адреса, проходя по каждому
  if (user) {
    for (let i = 0; i < user.addresses.length; i += 1) {
      const items: DescriptionsProps['items'] = [];

      let newKey = 1;
      newKey += 1;
      const fullAddress = [];

      // Заполняем доступными данными
      if (`${user?.addresses[i].country}` !== 'undefined') {
        fullAddress.push(['Country', getName(`${user?.addresses[i].country}`)]);
      }
      if (`${user?.addresses[i].state}` !== 'undefined') {
        fullAddress.push(['State', `${user?.addresses[i].state}`]);
      }
      if (`${user?.addresses[i].city}` !== 'undefined') {
        fullAddress.push(['City', `${user?.addresses[i].city}`]);
      }
      // Делаем полное название улицы из её частей
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
      // По айди проверяем тип адреса
      const address = [];
      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;

      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];

      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      // Делаем заголовок типа адреса
      if (user.addresses[i].id === defaultBillingAddressId && addressId === defaultShippingAddressId) {
        address.push('Default billing and shipping address');
      } else if (addressId === defaultBillingAddressId) {
        address.push('Default billing address');
        if (shippingAddressList.includes(addressId)) {
          address.push('Shipping address');
        }
      } else if (addressId === defaultShippingAddressId) {
        address.push('Default shipping address');
        if (billingAddressList.includes(addressId)) {
          address.push('Billing address');
        }
      } else {
        if (shippingAddressList.includes(addressId)) {
          address.push('Shipping address');
        }
        if (billingAddressList.includes(addressId)) {
          address.push('Billing address');
        }
      }

      // Заполняем адрес данными
      for (let x = 0; x < fullAddress.length; x += 1) {
        newKey += 1;
        items?.push({
          key: newKey,
          label: fullAddress[x][0],
          children: fullAddress[x][1],
        });
      }

      const userAddress = (
        <Descriptions title={address.join(', ')} bordered items={items} column={1} key={`descriptions${i}`} />
      );

      const addressButtons = (
        <div className="address-controls" key={`buttonDiv${i}`}>
          <Button type="primary" key={`buttonA${i}`} onClick={() => openAddressModal(i)}>
            Edit address
          </Button>
          <Button type="primary" key={`buttonR${i}`} onClick={() => removeAddress(i)}>
            Remove address
          </Button>
        </div>
      );
      userAddressesArray.push(userAddress, addressButtons);
    }
  }

  return (
    <>
      {user ? (
        <>
          <h2>Profile</h2>
          <div>
            {contextHolder}
            {fillDesriptionProps(user)}
            <div className="user-data-controls">
              <Button type="primary" onClick={openUserModal}>
                Edit user
              </Button>
              <Button type="primary" onClick={openPasswordModal}>
                Edit password
              </Button>
            </div>
            {userAddressesArray}
          </div>

          <div>
            <Modal isOpen={isUserInfoModalOpened} ariaHideApp={false} onRequestClose={closeUserInfoModal}>
              {contextHolder}
              <h2>Personal info</h2>
              <Form
                className="personal-info-form"
                initialValues={{ dateOfBirth: dayjs(user?.dateOfBirth, dateFormat) }}
              >
                <label>
                  <div>Name:</div>
                  <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>Last Name:</div>
                  <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>Email:</div>
                  <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
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
                  <button type="button" onClick={closeUserInfoModal}>
                    Close
                  </button>
                </div>
              </Form>
            </Modal>

            <Modal isOpen={isAddressInfoModalOpened} ariaHideApp={false} onRequestClose={closeAddressInfoModal}>
              {contextHolder}
              <h2>Personal info</h2>
              <Form initialValues={{ country: shippingCountry }} className="personal-info-form address-info-form">
                <Form.Item name="country" rules={[{ required: true, message: 'Please select your country' }]}>
                  <Select
                    placeholder={'Select your country'}
                    value={shippingCountry}
                    onChange={(value) => {
                      setShippingCountry(value);
                    }}
                  >
                    {countryOptions.map((country) => (
                      <Select.Option key={country.value} value={country.value}>
                        {country.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <br />
                <label>
                  <div>Region:</div>
                  <input type="text" value={region} onChange={(event) => setRegion(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>State:</div>
                  <input type="text" value={state} onChange={(event) => setState(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>City:</div>
                  <input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                </label>
                <br />

                <label>
                  <div>Street number:</div>
                  <input type="text" value={streetNumber} onChange={(event) => setStreetNumber(event.target.value)} />
                </label>
                <br />

                <label>
                  <div>Street name:</div>
                  <input type="text" value={streetName} onChange={(event) => setStreetName(event.target.value)} />
                </label>
                <br />

                <label>
                  <div>Building:</div>
                  <input type="text" value={building} onChange={(event) => setBuilding(event.target.value)} />
                </label>
                <br />

                <label>
                  <div>Apartment / Suite:</div>
                  <input type="text" value={apartment} onChange={(event) => setApartment(event.target.value)} />
                </label>
                <br />

                <label>
                  <div>Postal Code</div>
                  <input type="text" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>PO Box</div>
                  <input type="text" value={pOBox} onChange={(event) => setpOBox(event.target.value)} />
                </label>
                <br />
                <label>
                  <div>Additional address info</div>
                  <input
                    type="text"
                    value={additionalAddressInfo}
                    onChange={(event) => setAdditionalAddressInfo(event.target.value)}
                  />
                </label>
                <br />
                <label>
                  <div>Additional street info</div>
                  <input
                    type="text"
                    value={additionalStreetInfo}
                    onChange={(event) => setAdditionalStreetInfo(event.target.value)}
                  />
                </label>
                <br />
                <Form.Item>
                  <Checkbox
                    checked={defaultShippingAddressCheckBox}
                    onChange={() => setDefaultShippingAddressCheckBox(!defaultShippingAddressCheckBox)}
                  >
                    default Shipping Address
                  </Checkbox>
                  <Checkbox
                    checked={defaultBillingAddressCheckBox}
                    onChange={() => setDefaultBillingAddressCheckBox(!defaultBillingAddressCheckBox)}
                  >
                    default Billing Address
                  </Checkbox>
                  <Checkbox
                    checked={shippingAddressCheckBox}
                    onChange={() => setShippingAddressCheckBox(!shippingAddressCheckBox)}
                  >
                    Shipping Address
                  </Checkbox>
                  <Checkbox
                    checked={billingAddressCheckBox}
                    onChange={() => setBillingAddressCheckBox(!billingAddressCheckBox)}
                  >
                    Billing Address
                  </Checkbox>
                </Form.Item>

                <div className="modal-controls">
                  <button onClick={changeAddressData}>Submit</button>
                  <button type="button" onClick={closeAddressInfoModal}>
                    Close
                  </button>
                </div>
              </Form>
            </Modal>

            <Modal isOpen={isPasswordInfoModalOpened} ariaHideApp={false} onRequestClose={closePasswordInfoModal}>
              {contextHolder}
              <h2>Change your password</h2>
              <Form
                name="login_form"
                className="personal-info-form"
                initialValues={{ remember: true }}
                onFinish={changePasswordData}
              >
                <Form.Item<FieldType>
                  label="Old password:"
                  name="passwordOld"
                  rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                  label="New password:"
                  name="passwordNew"
                  rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
                >
                  <Input.Password />
                </Form.Item>
                <div className="modal-controls">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <button type="button" onClick={closePasswordInfoModal}>
                    Close
                  </button>
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
