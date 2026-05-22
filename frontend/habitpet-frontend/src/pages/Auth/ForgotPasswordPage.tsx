import { FormEvent, useState } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import AuthBackButton from '../../components/auth/AuthBackButton';
import AuthCardButton from '../../components/auth/AuthCardButton';
import AuthLayout from '../../components/auth/AuthLayout';
import OrangeCard from '../../components/auth/OrangeCard';
import SideToast from '../../components/SideToast';
import { validateEmail } from '../../utils/validation';
import {
  authColors,
  authFont,
  sharedTitleStyles,
  sharedCardInputStyles,
  sharedErrorStyles,
} from '../../components/auth/authTheme';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);

    if (error) return;

    setIsLoading(true);

    try {
      await forgotPassword({ email: email.trim() });
      navigate(`/reset-password/sent?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setToastMessage('Could not send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthBackButton onClick={() => navigate('/login')} />
      <SideToast message={toastMessage} onClose={() => setToastMessage('')} />

      <AuthLayout
        maxWidth={430}
        logoSize={250}
        mainClassName="min-h-screen bg-white px-4 pb-12 pt-20 sm:pt-24"
        shiftClassName="translate-y-8"
        logoMarginClassName="mb-5"
      >
        <Typography sx={sharedTitleStyles}>Reset password to HabitPet</Typography>

        <OrangeCard component="form" onSubmit={handleSubmit} dense>
          <Typography sx={messageStyles}>Enter your email and we will send you a reset link.</Typography>

          <Box sx={{ width: '100%' }}>
            <InputBase
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError('');
              }}
              fullWidth
              sx={sharedCardInputStyles}
            />
            {emailError && <Typography sx={sharedErrorStyles}>{emailError}</Typography>}
          </Box>

          <AuthCardButton type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset link'}
          </AuthCardButton>
        </OrangeCard>
      </AuthLayout>
    </>
  );
};

const messageStyles = {
  color: authColors.black,
  fontFamily: authFont,
  fontSize: 16,
  fontWeight: 600,
  textAlign: 'center',
};

export default ForgotPasswordPage;
