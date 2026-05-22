import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import AuthBackButton from '../../components/auth/AuthBackButton';
import AuthCardButton from '../../components/auth/AuthCardButton';
import AuthLayout from '../../components/auth/AuthLayout';
import OrangeCard from '../../components/auth/OrangeCard';
import { authColors, authFont, sharedTitleStyles } from '../../components/auth/authTheme';
import SideToast from '../../components/SideToast';

const ResetPasswordSentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('success');

  const handleResend = async () => {
    const email = searchParams.get('email');

    if (!email) {
      navigate('/forgot-password');
      return;
    }

    try {
      await forgotPassword({ email });
      setToastType('success');
      setToastMessage('Reset email was sent again. Please check your inbox.');
    } catch {
      setToastType('error');
      setToastMessage('Could not resend reset email. Please try again.');
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

        <OrangeCard>
          <Typography sx={messageStyles}>
            We sent you an email with link to create new password. Check your inbox
          </Typography>

          <Typography sx={resendTextStyles}>
            Didn&apos;t receive the link?{' '}
            <Box component="button" type="button" onClick={handleResend} sx={resendButtonStyles}>
              Resend email
            </Box>
          </Typography>

          <AuthCardButton type="button" onClick={() => navigate('/login')} width="72%" height={48} fontWeight={800}>
            Back to login
          </AuthCardButton>
        </OrangeCard>
      </AuthLayout>
    </>
  );
};

const messageStyles = {
  maxWidth: 310,
  color: authColors.black,
  fontFamily: authFont,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.35,
  textAlign: 'center',
};

const resendTextStyles = {
  color: authColors.black,
  fontFamily: authFont,
  fontSize: 16,
  fontWeight: 500,
  textAlign: 'center',
};

const resendButtonStyles = {
  border: 0,
  bgcolor: 'transparent',
  color: authColors.black,
  cursor: 'pointer',
  fontFamily: authFont,
  fontSize: 16,
  fontWeight: 900,
  p: 0,
};

export default ResetPasswordSentPage;
