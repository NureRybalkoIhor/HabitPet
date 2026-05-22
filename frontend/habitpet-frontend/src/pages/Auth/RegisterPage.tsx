import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { register, sendOtp, verifyOtp } from '../../api/authApi';
import { uploadAvatar } from '../../api/userApi';
import { useAuth } from '../../store/AuthContext';
import SideToast from '../../components/SideToast';
import AuthBackButton from '../../components/auth/AuthBackButton';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordToggle from '../../components/auth/PasswordToggle';
import {
  AccountValidationData,
  ProfileValidationData,
  ValidationErrors,
  toApiBirthday,
  validateAccountStep,
  validateOtp,
  validateProfileStep,
} from '../../utils/validation';
import OtpVerificationPage from './OtpVerificationPage';
import RegisterStage1 from './RegisterStage1';
import RegisterStage2 from './RegisterStage2';
import { titleStyles } from './RegisterShared';

type RegisterStep = 'stage1' | 'stage2' | 'otp';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { stage } = useParams();
  const { setAuth } = useAuth();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const step = getRegisterStep(stage);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [account, setAccount] = useState<AccountValidationData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profile, setProfile] = useState<ProfileValidationData>({
    firstName: '',
    lastName: '',
    birthday: '',
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [accountErrors, setAccountErrors] = useState<ValidationErrors<keyof AccountValidationData>>({});
  const [profileErrors, setProfileErrors] = useState<ValidationErrors<keyof ProfileValidationData>>({});
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (!step) {
      navigate('/register/stage1', { replace: true });
      return;
    }

    const accountIsInvalid = Object.keys(validateAccountStep(account)).length > 0;

    if ((step === 'stage2' || step === 'otp') && accountIsInvalid) {
      navigate('/register/stage1', { replace: true });
      return;
    }

    const profileIsInvalid = Object.keys(validateProfileStep(profile)).length > 0;

    if (step === 'otp' && profileIsInvalid) {
      navigate('/register/stage2', { replace: true });
    }
  }, [account, navigate, profile, step]);

  const goBack = () => {
    setSubmitError('');

    if (step === 'otp') {
      navigate('/register/stage2');
      return;
    }

    if (step === 'stage2') {
      navigate('/register/stage1');
      return;
    }

    navigate('/login');
  };

  const handleAccountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateAccountStep(account);
    setAccountErrors(errors);

    if (Object.keys(errors).length === 0) {
      navigate('/register/stage2');
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateProfileStep(profile);
    setProfileErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        await sendOtp(account.email.trim());
        setOtp(['', '', '', '']);
        navigate('/register/otp');
      } catch {
        setSubmitError('Failed to send OTP. Please try again.');
      }
    }
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = otp.join('');
    const error = validateOtp(code);
    setOtpError(error);

    if (error) return;

    setSubmitError('');
    setIsLoading(true);

    try {
      await verifyOtp(account.email.trim(), code);

      const response = await register({
        fullName: `${profile.firstName.trim()} ${profile.lastName.trim()}`,
        email: account.email.trim(),
        username: account.username.trim(),
        password: account.password,
        birthday: toApiBirthday(profile.birthday),
        sex: 'Unspecified',
      });

      setAuth(response.token, response.userId, response.username);

      if (avatarFile) {
        try {
          await uploadAvatar(response.userId, avatarFile);
        } catch {
          // аватар не критичний — ігноруємо помилку
        }
      }

      navigate('/dashboard');
    } catch {
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = (field: keyof AccountValidationData, value: string) => {
    setAccount((current) => ({ ...current, [field]: value }));
    setAccountErrors((current) => ({ ...current, [field]: '' }));
  };

  const updateProfile = (field: keyof ProfileValidationData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setOtpError('');

    if (digit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    setOtpError('');
    otpRefs.current[0]?.focus();
  };

  return (
    <>
      <AuthBackButton onClick={goBack} />

      <SideToast message={submitError} onClose={() => setSubmitError('')} />

      <AuthLayout maxWidth={416} logoSize={200} shiftClassName="translate-y-4" logoMarginClassName="mb-5">
        {step === 'otp' ? (
          <OtpVerificationPage
            email={account.email}
            isLoading={isLoading}
            otp={otp}
            otpError={otpError}
            otpRefs={otpRefs}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            onResend={handleResendOtp}
            onSubmit={handleOtpSubmit}
          />
        ) : (
          <>
            <Typography sx={titleStyles}>Create An Account and Sign Up</Typography>

            {step === 'stage1' && (
              <RegisterStage1
                account={account}
                errors={accountErrors}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                passwordAdornment={
                  <PasswordToggle
                    isVisible={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  />
                }
                confirmPasswordAdornment={
                  <PasswordToggle
                    isVisible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((current) => !current)}
                  />
                }
                onChange={updateAccount}
                onSubmit={handleAccountSubmit}
              />
            )}

            {step === 'stage2' && (
              <RegisterStage2
                avatarPreview={avatarPreview}
                errors={profileErrors}
                profile={profile}
                onAvatarChange={handleAvatarChange}
                onChange={updateProfile}
                onSubmit={handleProfileSubmit}
              />
            )}
          </>
        )}
      </AuthLayout>
    </>
  );
};

const getRegisterStep = (stage?: string): RegisterStep | null => {
  if (stage === 'stage1' || stage === 'stage2' || stage === 'otp') {
    return stage;
  }

  return null;
};

export default RegisterPage;
