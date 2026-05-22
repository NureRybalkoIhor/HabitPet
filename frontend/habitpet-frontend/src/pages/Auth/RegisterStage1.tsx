import { FormEvent, ReactNode } from 'react';
import { Box } from '@mui/material';
import { AccountValidationData, ValidationErrors } from '../../utils/validation';
import { PrimaryButton, RegisterField, formStyles } from './RegisterShared';

interface RegisterStage1Props {
  account: AccountValidationData;
  errors: ValidationErrors<keyof AccountValidationData>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordAdornment: ReactNode;
  confirmPasswordAdornment: ReactNode;
  onChange: (field: keyof AccountValidationData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const RegisterStage1 = ({
  account,
  errors,
  showPassword,
  showConfirmPassword,
  passwordAdornment,
  confirmPasswordAdornment,
  onChange,
  onSubmit,
}: RegisterStage1Props) => (
  <Box component="form" onSubmit={onSubmit} sx={formStyles}>
    <RegisterField
      label="Username"
      placeholder="Enter your username"
      value={account.username}
      error={errors.username}
      onChange={(value) => onChange('username', value)}
    />

    <RegisterField
      label="Email"
      placeholder="Enter email"
      type="email"
      value={account.email}
      error={errors.email}
      onChange={(value) => onChange('email', value)}
    />

    <RegisterField
      label="Password"
      placeholder="Enter password"
      type={showPassword ? 'text' : 'password'}
      value={account.password}
      error={errors.password}
      onChange={(value) => onChange('password', value)}
      endAdornment={passwordAdornment}
    />

    <RegisterField
      label="Confirm password"
      placeholder="Confirm password"
      type={showConfirmPassword ? 'text' : 'password'}
      value={account.confirmPassword}
      error={errors.confirmPassword}
      onChange={(value) => onChange('confirmPassword', value)}
      endAdornment={confirmPasswordAdornment}
    />

    <PrimaryButton type="submit">Next</PrimaryButton>
  </Box>
);

export default RegisterStage1;
