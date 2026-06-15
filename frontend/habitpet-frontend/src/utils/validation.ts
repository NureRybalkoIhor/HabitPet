export interface AccountValidationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileValidationData {
  firstName: string;
  lastName: string;
  birthday: string;
}

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'-]+(?: [A-Za-zА-Яа-яІіЇїЄєҐґ'-]+)*$/;

export const validateUsername = (username: string) => {
  const value = username.trim();

  if (!value) return 'Username is required.';
  if (value.length < 3 || value.length > 25) {
    return 'Username must be between 3 and 25 characters.';
  }

  return '';
};

export const validateEmail = (email: string) => {
  const value = email.trim();

  if (!value) return 'Email is required.';
  if (!emailPattern.test(value)) return 'Invalid email, example: example@gmail.com';

  return '';
};

export const validatePassword = (password: string) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must contain at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must have at least 1 capital character.';
  if (!/[a-z]/.test(password)) return 'Password must have at least 1 small character.';
  if (!/\d/.test(password)) return 'Password must have at least 1 number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must have at least 1 special character.';

  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Password does not match';

  return '';
};

export const validatePersonName = (value: string, label: string) => {
  const trimmed = value.trim();

  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < 3 || trimmed.length > 25) {
    return `${label} must be between 3 and 25 characters.`;
  }
  if (!namePattern.test(trimmed)) return `${label} can contain letters, spaces, apostrophes and hyphens.`;

  return '';
};

export const validateBirthday = (birthday: string) => {
  const value = birthday.trim();

  if (!value) return 'Birthday is required.';

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const displayMatch = value.match(/^(\d{2})[-.](\d{2})[-.](\d{4})$/);

  if (!isoMatch && !displayMatch) return 'Invalid date format.';

  const dayText = isoMatch ? isoMatch[3] : displayMatch?.[1];
  const monthText = isoMatch ? isoMatch[2] : displayMatch?.[2];
  const yearText = isoMatch ? isoMatch[1] : displayMatch?.[3];
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  
  const date = new Date(year, month - 1, day);
  const today = new Date();

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Invalid calendar date.';
  }

  if (date > today) {
    return 'Date of birth cannot be in the future.';
  }

  const minAgeDate = new Date();
  minAgeDate.setFullYear(today.getFullYear() - 18);
  if (date > minAgeDate) {
    return 'You must be at least 18 years old.';
  }

  if (year < 1900) {
    return 'Date of birth cannot be before 1900.';
  }

  return '';
};

export const validateOtp = (otp: string) => {
  if (!otp) return 'OTP code is required.';
  if (!/^\d{4}$/.test(otp)) return 'OTP code must contain 4 digits.';

  return '';
};

export const validateAccountStep = (data: AccountValidationData) => {
  const errors: ValidationErrors<keyof AccountValidationData> = {};

  errors.username = validateUsername(data.username);
  errors.email = validateEmail(data.email);
  errors.password = validatePassword(data.password);
  errors.confirmPassword = validateConfirmPassword(data.password, data.confirmPassword);

  return removeEmptyErrors(errors);
};

export const validateProfileStep = (data: ProfileValidationData) => {
  const errors: ValidationErrors<keyof ProfileValidationData> = {};

  errors.firstName = validatePersonName(data.firstName, 'Name');
  errors.lastName = validatePersonName(data.lastName, 'Last name');
  errors.birthday = validateBirthday(data.birthday);

  return removeEmptyErrors(errors);
};

export const toApiBirthday = (birthday: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return birthday;

  const [day, month, year] = birthday.split('-');
  return `${year}-${month}-${day}`;
};

const removeEmptyErrors = <T extends string>(errors: ValidationErrors<T>) => {
  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => Boolean(value))
  ) as ValidationErrors<T>;
};
