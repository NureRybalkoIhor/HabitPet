import { FormEvent, useState } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import AuthBackButton from '../../components/auth/AuthBackButton';
import AuthCardButton from '../../components/auth/AuthCardButton';
import AuthLayout from '../../components/auth/AuthLayout';
import OrangeCard from '../../components/auth/OrangeCard';
import PasswordToggle from '../../components/auth/PasswordToggle';
import SideToast from '../../components/SideToast';
import { validateConfirmPassword, validatePassword } from '../../utils/validation';
import {
  sharedTitleStyles,
  sharedCardInputStyles,
  sharedErrorStyles,
} from '../../components/auth/authTheme';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextPasswordError = validatePassword(password);
    const nextRepeatPasswordError = validateConfirmPassword(password, repeatPassword);
    setPasswordError(nextPasswordError);
    setRepeatPasswordError(nextRepeatPasswordError);

    if (nextPasswordError || nextRepeatPasswordError) return;

    setIsLoading(true);

    try {
      await resetPassword({
        token: searchParams.get('token') ?? undefined,
        newPassword: password,
      });

      setToastType('success');
      setToastMessage('Password reset successfully. You can log in now.');
      window.setTimeout(() => navigate('/login'), 1200);
    } catch {
      setToastType('error');
      setToastMessage('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthBackButton onClick={() => navigate('/login')} />

      <SideToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <AuthLayout
        maxWidth={430}
        logoSize={250}
        mainClassName="min-h-screen bg-white px-4 pb-12 pt-20 sm:pt-24"
        shiftClassName="translate-y-8"
        logoMarginClassName="mb-5"
      >
        <Typography sx={sharedTitleStyles}>Reset password to HabitPet</Typography>

        <OrangeCard component="form" onSubmit={handleSubmit} dense>
          <PasswordField
            placeholder="New password"
            value={password}
            isVisible={showPassword}
            error={passwordError}
            onChange={(value) => {
              setPassword(value);
              setPasswordError('');
            }}
            onToggle={() => setShowPassword((current) => !current)}
          />

          <PasswordField
            placeholder="Repeat password"
            value={repeatPassword}
            isVisible={showRepeatPassword}
            error={repeatPasswordError}
            onChange={(value) => {
              setRepeatPassword(value);
              setRepeatPasswordError('');
            }}
            onToggle={() => setShowRepeatPassword((current) => !current)}
          />

          <AuthCardButton type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset password'}
          </AuthCardButton>
        </OrangeCard>
      </AuthLayout>
    </>
  );
};

interface PasswordFieldProps {
  placeholder: string;
  value: string;
  isVisible: boolean;
  error: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}

const PasswordField = ({ placeholder, value, isVisible, error, onChange, onToggle }: PasswordFieldProps) => (
  <Box sx={{ width: '100%' }}>
    <InputBase
      placeholder={placeholder}
      type={isVisible ? 'text' : 'password'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
      endAdornment={<PasswordToggle isVisible={isVisible} onClick={onToggle} iconSize={30} />}
      sx={sharedCardInputStyles}
    />
    {error && <Typography sx={sharedErrorStyles}>{error}</Typography>}
  </Box>
);

export default ResetPasswordPage;
