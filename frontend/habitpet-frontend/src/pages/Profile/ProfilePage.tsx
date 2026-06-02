import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  LinearProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarsIcon from '@mui/icons-material/Stars';
import { useAuth } from '../../store/AuthContext';
import {
  getUser,
  uploadAvatar,
  updateProfile,
  changePassword,
  getXpTransactions,
  UserProfile,
  XpTransaction,
} from '../../api/userApi';
import SideToast from '../../components/SideToast';
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validatePersonName,
  validateBirthday,
} from '../../utils/validation';
import { authColors, authFont } from '../../components/auth/authTheme';

const getAvatarUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://localhost:7059${url}`;
};

const getReasonDetails = (type: string, habitTitle?: string) => {
  switch (type) {
    case 'HabitDone':
      return {
        label: `Completed habit${habitTitle ? ` "${habitTitle}"` : ''}`,
        color: '#437F70',
        bgColor: 'rgba(67, 127, 112, 0.08)',
        icon: <TaskAltIcon sx={{ color: '#437F70', fontSize: 20 }} />,
      };
    case 'StreakBonus':
      return {
        label: 'Reached streak milestone!',
        color: '#ff8624',
        bgColor: 'rgba(255, 134, 36, 0.08)',
        icon: <LocalFireDepartmentIcon sx={{ color: '#ff8624', fontSize: 20 }} />,
      };
    case 'AchievementUnlocked':
      return {
        label: 'Unlocked an achievement!',
        color: '#c59265',
        bgColor: 'rgba(197, 146, 101, 0.08)',
        icon: <EmojiEventsIcon sx={{ color: '#c59265', fontSize: 20 }} />,
      };
    case 'ChallengeCompleted':
      return {
        label: `Mastered habit${habitTitle ? ` "${habitTitle}"` : ''}!`,
        color: '#2e7d32',
        bgColor: 'rgba(46, 125, 50, 0.08)',
        icon: <WorkspacePremiumIcon sx={{ color: '#2e7d32', fontSize: 20 }} />,
      };
    case 'ReturnBonus':
      return {
        label: 'Daily return reward',
        color: '#0288d1',
        bgColor: 'rgba(2, 136, 209, 0.08)',
        icon: <AutoAwesomeIcon sx={{ color: '#0288d1', fontSize: 20 }} />,
      };
    default:
      return {
        label: 'Earned experience points',
        color: '#7b1fa2',
        bgColor: 'rgba(123, 31, 162, 0.08)',
        icon: <StarsIcon sx={{ color: '#7b1fa2', fontSize: 20 }} />,
      };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ProfilePage = () => {
  const { userId, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<XpTransaction[]>([]);
  const [visibleTxCount, setVisibleTxCount] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const data = await getUser(userId);
        setProfile(data);
        setFullName(data.fullName);
        setUsername(data.username);
        setEmail(data.email);
        setSex(data.sex || '');
        setBirthday(data.birthday || '');
      } catch {
        setToastType('error');
        setToastMessage('Failed to load user profile.');
      }
    };

    const fetchTransactions = async () => {
      try {
        const txData = await getXpTransactions(userId);
        setTransactions(txData);
      } catch {
        console.error('Failed to load XP history.');
      }
    };

    fetchUser();
    fetchTransactions();
  }, [userId]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setIsLoading(true);
    try {
      const newAvatarUrl = await uploadAvatar(userId, file);
      if (profile) {
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
      }
      setToastType('success');
      setToastMessage('Avatar uploaded successfully.');
    } catch {
      setToastType('error');
      setToastMessage('Failed to upload avatar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !profile) return;

    const nextFullNameError = validatePersonName(fullName, 'Full Name');
    const nextUsernameError = validateUsername(username);
    const nextEmailError = validateEmail(email);
    const nextBirthdayError = birthday ? validateBirthday(birthday) : '';

    setFullNameError(nextFullNameError);
    setUsernameError(nextUsernameError);
    setEmailError(nextEmailError);
    setBirthdayError(nextBirthdayError);

    if (nextFullNameError || nextUsernameError || nextEmailError || nextBirthdayError) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        sex: sex,
        birthday: birthday || undefined,
      };

      await updateProfile(userId, updatedData);
      setProfile({
        ...profile,
        fullName: updatedData.fullName,
        username: updatedData.username,
        email: updatedData.email,
        sex: updatedData.sex,
        birthday: updatedData.birthday,
      });

      setToastType('success');
      setToastMessage('Profile updated successfully.');
    } catch (err: any) {
      setToastType('error');
      const apiError = err.response?.data || 'Failed to update profile.';
      setToastMessage(typeof apiError === 'string' ? apiError : 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    const nextCurrentPasswordError = currentPassword ? '' : 'Current password is required.';
    const nextNewPasswordError = validatePassword(newPassword);
    const nextConfirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);

    setCurrentPasswordError(nextCurrentPasswordError);
    setNewPasswordError(nextNewPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);

    if (nextCurrentPasswordError || nextNewPasswordError || nextConfirmPasswordError) {
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(userId, {
        currentPassword,
        newPassword,
      });
      setToastType('success');
      setToastMessage('Password changed successfully. Logging out...');
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      setToastType('error');
      const apiError = err.response?.data || 'Failed to change password.';
      setToastMessage(typeof apiError === 'string' ? apiError : 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontFamily: authFont, color: '#4A6070', fontWeight: 600 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  const stats = profile.stats || {
    currentLevel: 1,
    currentXp: 0,
    xpToNextLevel: 100,
    totalDaysActive: 0,
    totalHabitsDone: 0,
  };

  const xpPercentage = Math.min(100, (stats.currentXp / stats.xpToNextLevel) * 100);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1350, mx: 'auto' }}>
      <SideToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <Box
        component="header"
        sx={{
          pb: 2,
          borderBottom: '1.5px solid #e6e3dd',
          mb: 5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: authFont,
            fontWeight: 800,
            fontSize: '22px',
            letterSpacing: '0.15em',
            color: '#111',
          }}
        >
          PROFILE
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: authFont,
            fontWeight: 600,
            fontSize: '11px',
            color: '#4A6070',
            letterSpacing: '0.15em',
            mt: 0.5,
          }}
        >
          PERSONAL INFORMATION & JOURNEY STATISTICS
        </Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} md={4.5} lg={3.8}>
          <Card
            sx={{
              p: { xs: 4, md: 5 },
              border: '1.5px solid #e6e3dd',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={handleAvatarClick}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '50%',
                mb: 3,
                '&:hover .avatar-overlay': {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                src={getAvatarUrl(profile.avatarUrl)}
                sx={{
                  width: 155,
                  height: 155,
                  border: '3px solid #ff8624',
                  boxShadow: '0 8px 24px rgba(255,134,36,0.15)',
                }}
              />
              <Box
                className="avatar-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 200ms ease',
                }}
              >
                <CameraAltIcon sx={{ fontSize: 32, mb: 0.5 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 800, fontFamily: authFont }}>
                  Change Photo
                </Typography>
              </Box>
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <Typography
              sx={{
                fontFamily: authFont,
                fontSize: 24,
                fontWeight: 900,
                color: '#161616',
                textAlign: 'center',
                mb: 0.5,
              }}
            >
              {profile.fullName}
            </Typography>

            <Typography
              sx={{
                fontFamily: authFont,
                fontSize: 15,
                fontWeight: 700,
                color: '#8c8881',
                textAlign: 'center',
                mb: 3,
              }}
            >
              @{profile.username}
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2.2,
                py: 0.8,
                border: '1.5px solid #ff8624',
                borderRadius: 999,
                bgcolor: '#fff9f5',
                mb: 3.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: authFont,
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#ff8624',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                LEVEL {stats.currentLevel}
              </Typography>
            </Box>

            <Box sx={{ width: '100%', mb: 4.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                <Typography sx={{ fontFamily: authFont, fontSize: 12, fontWeight: 800, color: '#8c8881' }}>
                  EXPERIENCE
                </Typography>
                <Typography sx={{ fontFamily: authFont, fontSize: 12, fontWeight: 900, color: '#161616' }}>
                  {stats.currentXp} / {stats.xpToNextLevel} XP
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={xpPercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: '#fff0e2',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ff8624',
                    borderRadius: 6,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                borderTop: '1.5px solid #e6e3dd',
                pt: 4,
              }}
            >
              <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1.5px solid #e6e3dd' }}>
                <Typography
                  sx={{
                    fontFamily: authFont,
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#ff8624',
                    mb: 0.5,
                  }}
                >
                  {stats.totalDaysActive}
                </Typography>
                <Typography sx={{ fontFamily: authFont, fontSize: 11, fontWeight: 800, color: '#8c8881' }}>
                  DAYS TOGETHER
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: authFont,
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#ff8624',
                    mb: 0.5,
                  }}
                >
                  {stats.totalHabitsDone}
                </Typography>
                <Typography sx={{ fontFamily: authFont, fontSize: 11, fontWeight: 800, color: '#8c8881' }}>
                  MASTERED HABITS
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={7.5} lg={8.2}>
          <Card
            sx={{
              p: { xs: 4, md: 5 },
              border: '1.5px solid #e6e3dd',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: '#fff',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={{
                mb: 4.5,
                borderBottom: '1.5px solid #e6e3dd',
                '& .MuiTabs-indicator': {
                  bgcolor: '#ff8624',
                  height: 2.5,
                },
              }}
            >
              <Tab
                icon={<PersonIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Personal Details"
                sx={{
                  fontFamily: authFont,
                  fontSize: 14,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#8c8881',
                  '&.Mui-selected': { color: '#ff8624' },
                }}
              />
              <Tab
                icon={<SecurityIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Security"
                sx={{
                  fontFamily: authFont,
                  fontSize: 14,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#8c8881',
                  '&.Mui-selected': { color: '#ff8624' },
                }}
              />
              <Tab
                icon={<HistoryIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Activity Log"
                sx={{
                  fontFamily: authFont,
                  fontSize: 14,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#8c8881',
                  '&.Mui-selected': { color: '#ff8624' },
                }}
              />
            </Tabs>

            {activeTab === 0 && (
              <Box component="form" onSubmit={handleProfileSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography sx={labelStyles}>Full Name</Typography>
                  <InputBase
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setFullNameError('');
                    }}
                    fullWidth
                    sx={inputStyles}
                  />
                  {fullNameError && <Typography sx={errorStyles}>{fullNameError}</Typography>}
                </Box>

                <Box>
                  <Typography sx={labelStyles}>Username</Typography>
                  <InputBase
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError('');
                    }}
                    fullWidth
                    sx={inputStyles}
                  />
                  {usernameError && <Typography sx={errorStyles}>{usernameError}</Typography>}
                </Box>

                <Box>
                  <Typography sx={labelStyles}>Email Address</Typography>
                  <InputBase
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    type="email"
                    fullWidth
                    sx={inputStyles}
                  />
                  {emailError && <Typography sx={errorStyles}>{emailError}</Typography>}
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyles}>Gender</Typography>
                    <Select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={selectStyles}
                    >
                      <MenuItem value="" sx={{ fontFamily: authFont, fontWeight: 700 }}>
                        Select gender
                      </MenuItem>
                      <MenuItem value="male" sx={{ fontFamily: authFont, fontWeight: 700 }}>
                        Male
                      </MenuItem>
                      <MenuItem value="female" sx={{ fontFamily: authFont, fontWeight: 700 }}>
                        Female
                      </MenuItem>
                      <MenuItem value="other" sx={{ fontFamily: authFont, fontWeight: 700 }}>
                        Other
                      </MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelStyles}>Date of Birth</Typography>
                    <InputBase
                      value={birthday}
                      onChange={(e) => {
                        setBirthday(e.target.value);
                        setBirthdayError('');
                      }}
                      type="date"
                      fullWidth
                      sx={inputStyles}
                    />
                    {birthdayError && <Typography sx={errorStyles}>{birthdayError}</Typography>}
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="contained"
                  sx={submitButtonStyles}
                >
                  {isLoading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography sx={labelStyles}>Current Password</Typography>
                  <InputBase
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setCurrentPasswordError('');
                    }}
                    type={showCurrentPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          sx={{ mr: 1, color: '#161616' }}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    fullWidth
                    sx={inputStyles}
                  />
                  {currentPasswordError && <Typography sx={errorStyles}>{currentPasswordError}</Typography>}
                </Box>

                <Box>
                  <Typography sx={labelStyles}>New Password</Typography>
                  <InputBase
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPasswordError('');
                    }}
                    type={showNewPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          sx={{ mr: 1, color: '#161616' }}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    fullWidth
                    sx={inputStyles}
                  />
                  {newPasswordError && <Typography sx={errorStyles}>{newPasswordError}</Typography>}
                </Box>

                <Box>
                  <Typography sx={labelStyles}>Repeat New Password</Typography>
                  <InputBase
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError('');
                    }}
                    type={showConfirmPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{ mr: 1, color: '#161616' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    fullWidth
                    sx={inputStyles}
                  />
                  {confirmPasswordError && <Typography sx={errorStyles}>{confirmPasswordError}</Typography>}
                </Box>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="contained"
                  sx={submitButtonStyles}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                {transactions.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      bgcolor: '#fffbf9',
                      border: '1.5px dashed #ff8624',
                      borderRadius: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: authFont,
                        color: '#ff8624',
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      No activity recorded yet. Complete habits to start earning experience!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
                    <Box
                      sx={{
                        maxHeight: '480px',
                        overflowY: 'auto',
                        pr: 1.5,
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#e6e3dd', borderRadius: '4px' },
                      }}
                    >
                      {transactions.slice(0, visibleTxCount).map((tx) => {
                        const reason = getReasonDetails(tx.typeReason, tx.habitTitle);
                        return (
                          <Box
                            key={tx.xpTransactionId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 2.2,
                              borderBottom: '1px solid #f0ede9',
                              '&:last-child': { borderBottom: 'none' },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  bgcolor: reason.bgColor,
                                }}
                              >
                                {reason.icon}
                              </Box>
                              <Box>
                                <Typography
                                  sx={{
                                    fontFamily: authFont,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: '#161616',
                                    mb: 0.4,
                                  }}
                                >
                                  {reason.label}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: authFont,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#8c8881',
                                  }}
                                >
                                  {formatDate(tx.createdAt)}
                                </Typography>
                              </Box>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: authFont,
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: tx.xpAmount >= 0 ? '#437F70' : '#d71920',
                                }}
                              >
                                {tx.xpAmount >= 0 ? `+${tx.xpAmount}` : tx.xpAmount} XP
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {transactions.length > visibleTxCount && (
                      <Button
                        onClick={() => setVisibleTxCount((prev) => prev + 10)}
                        fullWidth
                        sx={{
                          py: 1.5,
                          border: '1.5px solid #e6e3dd',
                          borderRadius: 2,
                          color: '#4A6070',
                          fontFamily: authFont,
                          fontSize: 13,
                          fontWeight: 800,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#fcfbfa',
                            borderColor: '#c59265',
                          },
                        }}
                      >
                        Load 10 more previous entries...
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const labelStyles = {
  fontFamily: authFont,
  fontSize: 13,
  fontWeight: 800,
  color: '#161616',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  mb: 1.2,
};

const inputStyles = {
  minHeight: 56,
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
    transform: 'translateY(-0.5px)',
  },
  '&.Mui-focused': {
    borderColor: authColors.orange,
    bgcolor: authColors.peach,
    boxShadow: '0 0 0 3px rgba(255, 134, 36, 0.12)',
    transform: 'translateY(-0.5px)',
  },
  '& input': {
    height: '56px',
    boxSizing: 'border-box',
    p: 0,
  },
};

const selectStyles = {
  height: 56,
  border: '1.5px solid #161616',
  borderRadius: '8px',
  bgcolor: authColors.peach,
  color: '#111',
  fontFamily: authFont,
  fontSize: 14,
  fontWeight: 700,
  px: 1,
  transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, background 160ms ease',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    borderColor: authColors.orange,
    bgcolor: authColors.peachHover,
    transform: 'translateY(-0.5px)',
  },
  '&.Mui-focused': {
    borderColor: authColors.orange,
    bgcolor: authColors.peach,
    boxShadow: '0 0 0 3px rgba(255, 134, 36, 0.12)',
    transform: 'translateY(-0.5px)',
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

const submitButtonStyles = {
  mt: 1.5,
  height: 56,
  borderRadius: 2,
  bgcolor: authColors.orange,
  color: '#111',
  fontFamily: authFont,
  fontSize: 15,
  fontWeight: 800,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: authColors.orangeHover,
    boxShadow: 'none',
  },
  '&:disabled': {
    bgcolor: '#eae6df',
    color: '#8c8881',
  },
};

export default ProfilePage;
