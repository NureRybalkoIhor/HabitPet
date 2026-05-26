import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login, getGoogleConfig, googleLogin } from '../../api/authApi';
import logo from '../../assets/Logo.png';
import { useAuth } from '../../store/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import SideToast from '../../components/SideToast';
import { authColors, authFont } from '../../components/auth/authTheme';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const googleTokenClientRef = useRef<any>(null);

  useEffect(() => {
    const initGoogle = async () => {
      try {
        const config = await getGoogleConfig();
        const googleObj = (window as any).google;
        if (config.clientId && googleObj) {
          googleTokenClientRef.current = googleObj.accounts.oauth2.initTokenClient({
            client_id: config.clientId,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.access_token) {
                setIsLoading(true);
                try {
                  const response = await googleLogin({ accessToken: tokenResponse.access_token });
                  setAuth(response.token, response.userId, response.username);
                  navigate('/dashboard');
                } catch {
                  setError('Failed to log in with Google.');
                } finally {
                  setIsLoading(false);
                }
              }
            },
          });
        }
      } catch (err) {
        console.error('Error loading Google login configuration:', err);
      }
    };
    initGoogle();
  }, [navigate, setAuth]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const nextEmailError = validateEmail(trimmedEmail);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    setIsLoading(true);

    try {
      const response = await login({ email: trimmedEmail, password });
      setAuth(response.token, response.userId, response.username);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SideToast message={error} onClose={() => setError('')} />
      <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
        <section className="flex w-full max-w-[450px] -translate-y-4 flex-col items-center" aria-label="Sign in form">
          <img className="mb-6 h-[280px] w-[280px] object-contain" src={logo} alt="HabitPet" />

          <Typography
            component="h1"
            sx={{
              mb: 3.5,
              fontFamily: authFont,
              fontSize: 24,
              fontWeight: 800,
              color: '#161616',
              textAlign: 'center',
            }}
          >
            Sign in to HabitPet
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, width: '100%' }}
          >
            <Box sx={{ width: '100%' }}>
              <InputBase
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError('');
                }}
                autoComplete="email"
                fullWidth
                sx={fieldStyles}
              />
              {emailError && <Typography sx={errorStyles}>{emailError}</Typography>}
            </Box>

            <Box sx={{ width: '100%' }}>
              <InputBase
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError('');
                }}
                autoComplete="current-password"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      edge="end"
                      onClick={() => setShowPassword((current) => !current)}
                      sx={{
                        mr: 0.8,
                        color: '#161616',
                        '& svg': { fontSize: 26 },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={fieldStyles}
              />
              {passwordError && <Typography sx={errorStyles}>{passwordError}</Typography>}
            </Box>

            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              size="large"
              sx={{
                mt: 0.2,
                height: 56,
                borderRadius: 2,
                bgcolor: authColors.orange,
                color: '#111',
                fontFamily: authFont,
                fontSize: 15,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: authColors.orangeHover },
              }}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </Box>

          <Typography sx={{ mt: 2.8, fontFamily: authFont, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
            Forgot password? Don't worry{' '}
            <Box
              component={RouterLink}
              to="/forgot-password"
              sx={{ color: authColors.orange, fontWeight: 800, textDecoration: 'none' }}
            >
              reset it here!
            </Box>
          </Typography>

          <Typography sx={{ mt: 3, fontFamily: authFont, fontSize: 15, fontWeight: 700, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Box
              component={RouterLink}
              to="/register"
              sx={{ color: '#111', fontWeight: 900, textDecoration: 'none' }}
            >
              Sign Up.
            </Box>
          </Typography>

          <Button
            type="button"
            onClick={() => {
              if (googleTokenClientRef.current) {
                googleTokenClientRef.current.requestAccessToken();
              } else {
                setError('Google Sign-In is not initialized. Please refresh.');
              }
            }}
            sx={{
              mt: 3.2,
              color: '#111',
              fontSize: 16,
              fontWeight: 900,
              fontFamily: authFont,
              textTransform: 'none',
              borderRadius: 999,
              px: 1.8,
              py: 0.8,
              transition: 'background 160ms ease, box-shadow 160ms ease, transform 160ms ease',
              '& .MuiButton-startIcon': { mr: 1.1 },
              '&:hover': {
                bgcolor: '#fff3e8',
                boxShadow: '0 8px 20px rgba(255, 134, 36, 0.14)',
                transform: 'translateY(-1px)',
              },
            }}
            startIcon={<GoogleLogo />}
          >
            Log In with Google
          </Button>
        </section>
      </main>
    </>
  );
};

const fieldStyles = {
  minHeight: 64,
  border: '1.5px solid #161616',
  borderRadius: '8px',
  bgcolor: authColors.peach,
  color: '#111',
  fontFamily: authFont,
  fontSize: 14,
  fontWeight: 700,
  px: 2,
  transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, background 160ms ease',
  '&:hover': {
    borderColor: authColors.orange,
    bgcolor: authColors.peachHover,
    boxShadow: '0 8px 18px rgba(255, 134, 36, 0.12)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-focused': {
    borderColor: authColors.orange,
    bgcolor: authColors.peach,
    boxShadow: '0 0 0 3px rgba(255, 134, 36, 0.12)',
    transform: 'translateY(-1px)',
  },
  '& input': {
    height: '64px',
    boxSizing: 'border-box',
    p: 0,
  },
  '& input::placeholder': {
    opacity: 1,
    color: '#161616',
    fontWeight: 700,
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 100px ${authColors.peach} inset`,
    WebkitTextFillColor: '#111',
    caretColor: '#111',
    transition: 'background-color 9999s ease-out 0s',
  },
};

const errorStyles = {
  mt: 1,
  borderRadius: 1,
  bgcolor: '#fff4f4',
  color: '#d71920',
  fontFamily: authFont,
  fontSize: 12,
  fontWeight: 700,
  px: 1.1,
  py: 0.6,
};

const GoogleLogo = () => (
  <svg width="27" height="27" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.2 4 9.5 8.5 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9L6.2 33C9.4 39.5 16.1 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12.1 12.1 0 0 1-4.1 5.6l6.1 5.2C36.9 39.1 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
  </svg>
);

export default LoginPage;
