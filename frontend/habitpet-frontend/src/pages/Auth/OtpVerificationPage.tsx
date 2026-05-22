import { FormEvent, KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { PrimaryButton, errorStyles } from './RegisterShared';

interface OtpVerificationPageProps {
  email: string;
  isLoading: boolean;
  otp: string[];
  otpError: string;
  otpRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onResend: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const OtpVerificationPage = ({
  email,
  isLoading,
  otp,
  otpError,
  otpRefs,
  onChange,
  onKeyDown,
  onResend,
  onSubmit,
}: OtpVerificationPageProps) => {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    if (secondsLeft > 0) return;

    onResend();
    setSecondsLeft(60);
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
    >
      <Typography
        component="h1"
        sx={{
          mb: 2,
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: 28,
          fontWeight: 900,
          color: '#111',
          textAlign: 'center',
        }}
      >
        OTP Verification
      </Typography>

      <Typography sx={{ maxWidth: 336, fontSize: 15, fontWeight: 500, lineHeight: 1.45, textAlign: 'center' }}>
        We will send you a one time password to your email address
      </Typography>
      <Typography sx={{ mt: 2, mb: 4, fontSize: 15, letterSpacing: 2, textAlign: 'center' }}>
        {email}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2.2, mb: 2 }}>
        {otp.map((digit, index) => (
          <InputBase
            key={index}
            value={digit}
            inputRef={(element) => {
              otpRefs.current[index] = element;
            }}
            onChange={(event) => onChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            sx={otpInputStyles}
          />
        ))}
      </Box>

      {otpError && <Typography sx={errorStyles}>{otpError}</Typography>}

      <Typography sx={{ mt: 2.5, fontSize: 13.5, color: '#444', textAlign: 'center' }}>
        Didn&apos;t you receive the OTP?{' '}
        <Box
          component="button"
          disabled={secondsLeft > 0}
          type="button"
          onClick={handleResend}
          sx={resendStyles}
        >
          {secondsLeft > 0 ? `Resend in ${formatTimer(secondsLeft)}` : 'Resend OTP'}
        </Box>
      </Typography>

      <Box sx={{ width: '100%', mt: 4.8 }}>
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify'}
        </PrimaryButton>
      </Box>
    </Box>
  );
};

const formatTimer = (seconds: number) => {
  return `00:${String(seconds).padStart(2, '0')}`;
};

const otpInputStyles = {
  width: 44,
  borderBottom: '1.5px solid #111',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 22,
  fontWeight: 600,
  '& input': {
    p: 0,
    textAlign: 'center',
  },
  '&.Mui-focused': {
    borderBottomColor: '#ff8624',
  },
};

const resendStyles = {
  border: 0,
  bgcolor: 'transparent',
  color: '#ff6f00',
  cursor: 'pointer',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 13.5,
  fontWeight: 800,
  p: 0,
  '&:disabled': {
    color: '#8a8a8a',
    cursor: 'default',
  },
};

export default OtpVerificationPage;
