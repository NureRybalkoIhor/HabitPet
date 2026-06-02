import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SideToast from '../../components/SideToast';
import ProfileSidebar from './components/ProfileSidebar';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import SecurityForm from './components/SecurityForm';
import XpActionsHistory from './components/XpActionsHistory';
import { authFont } from './components/profileHelpers';
import { useProfilePage } from './hooks/useProfilePage';

const ProfilePage = () => {
  const {
    profile,
    transactions,
    visibleTxCount,
    setVisibleTxCount,
    activeTab,
    setActiveTab,
    toastMessage,
    setToastMessage,
    toastType,
    isLoading,
    fullName,
    setFullName,
    username,
    setUsername,
    email,
    setEmail,
    sex,
    setSex,
    birthday,
    setBirthday,
    fullNameError,
    setFullNameError,
    usernameError,
    setUsernameError,
    emailError,
    setEmailError,
    birthdayError,
    setBirthdayError,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    setCurrentPasswordError,
    newPasswordError,
    setNewPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    handleAvatarUpload,
    handleProfileSubmit,
    handlePasswordSubmit,
    stats,
    xpPercentage,
    xpLeft,
    percentLeft,
  } = useProfilePage();

  if (!profile) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontFamily: authFont, color: '#4A6070', fontWeight: 600 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        color: '#111111',
        fontFamily: authFont,
        p: { xs: 2, md: 3.5 },
        width: '100%',
        boxSizing: 'border-box',
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SideToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <Box
        component="header"
        sx={{
          pb: 2,
          borderBottom: '1px solid #e6e3dd',
          mb: 4.5,
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
          PERSONAL DETAILS, SECURITY & EXPERIENCE HISTORY
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4.5,
          alignItems: 'flex-start',
          width: '100%',
          flexGrow: 1,
        }}
      >
        <Box sx={{ width: { xs: '100%', lg: '22%' }, display: 'flex', flexDirection: 'column' }}>
          <ProfileSidebar
            profile={profile}
            stats={stats}
            xpPercentage={xpPercentage}
            xpLeft={xpLeft}
            percentLeft={percentLeft}
            isLoading={isLoading}
            onAvatarUpload={handleAvatarUpload}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '42%' }, display: 'flex', flexDirection: 'column' }}>
          <Card
            sx={{
              p: { xs: 4, md: 4.5 },
              border: '1.5px solid #e6e3dd',
              borderRadius: '16px',
              boxShadow: 'none',
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={{
                mb: 4,
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
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#8c8881',
                  pb: 1.5,
                  '&.Mui-selected': { color: '#ff8624' },
                }}
              />
              <Tab
                icon={<SecurityIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Security"
                sx={{
                  fontFamily: authFont,
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#8c8881',
                  pb: 1.5,
                  '&.Mui-selected': { color: '#ff8624' },
                }}
              />
            </Tabs>

            {activeTab === 0 && (
              <PersonalDetailsForm
                fullName={fullName}
                setFullName={setFullName}
                fullNameError={fullNameError}
                setFullNameError={setFullNameError}
                username={username}
                setUsername={setUsername}
                usernameError={usernameError}
                setUsernameError={setUsernameError}
                email={email}
                setEmail={setEmail}
                emailError={emailError}
                setEmailError={setEmailError}
                sex={sex}
                setSex={setSex}
                birthday={birthday}
                setBirthday={setBirthday}
                birthdayError={birthdayError}
                setBirthdayError={setBirthdayError}
                isLoading={isLoading}
                onSubmit={handleProfileSubmit}
              />
            )}

            {activeTab === 1 && (
              <SecurityForm
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                currentPasswordError={currentPasswordError}
                setCurrentPasswordError={setCurrentPasswordError}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                newPasswordError={newPasswordError}
                setNewPasswordError={setNewPasswordError}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                confirmPasswordError={confirmPasswordError}
                setConfirmPasswordError={setConfirmPasswordError}
                isLoading={isLoading}
                onSubmit={handlePasswordSubmit}
              />
            )}
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '36%' }, display: 'flex', flexDirection: 'column' }}>
          <XpActionsHistory
            transactions={transactions}
            visibleTxCount={visibleTxCount}
            onLoadMore={() => setVisibleTxCount((prev) => prev + 10)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
