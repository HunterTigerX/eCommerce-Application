import { Rule } from 'antd/es/form';
import dayjs, { Dayjs } from 'dayjs';

const validateWhitespace = (value: string) => {
  if (!value) {
    return Promise.reject('Please fill in the field!');
  }

  if (value.startsWith(' ')) {
    return Promise.reject("Please don't use spaces at the beginning");
  }

  if (value.endsWith(' ')) {
    return Promise.reject("Please don't use spaces at the end");
  }

  return Promise.resolve();
};

export const validatePassword = (_: Rule, value: string) => {
  return validateWhitespace(value).then(() => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (hasUppercase && hasLowercase && hasNumber && value.length >= 8) {
      return Promise.resolve();
    }

    return Promise.reject('Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number');
  });
};

export const validateField = (_: Rule, value: string) => {
  return validateWhitespace(value).then(() => {
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>0-9]/.test(value);
    if (value && !hasSpecialCharacters) {
      return Promise.resolve();
    }
    return Promise.reject('Must contain at least one character and no special characters or numbers');
  });
};

export const validateData = (_: Rule, value: Dayjs) => {
  if (!value) return Promise.reject('Please fill in the field!');
  const currentDate = dayjs();
  const birthDate = dayjs(value);
  const age = currentDate.diff(birthDate, 'year');
  if (age >= 13) {
    return Promise.resolve();
  }
  return Promise.reject('You must be over 13');
};

export const validatePostalCode = (country: string, value: string) => {
  const postalCodeRegex = country === 'RU' ? /^\d{6}$/ : /^\d{5}$/;
  const error = country === 'RU' ? 'code (6 digits): XXXXXX' : 'code (5 digits): XXXXX';

  if (postalCodeRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(error);
};

export const validateStreet = (_: Rule, value: string) => {
  return validateWhitespace(value).then(() => {
    if (value.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject('Please fill in the field!');
  });
};
