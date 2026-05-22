import { Box, Typography } from '@mui/material';

const ProfilePage = () => {
  return (
    <Box sx={{ p: 4, color: '#111' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Profile Settings
      </Typography>
      <Typography sx={{ color: '#4A6070', fontWeight: 500 }}>
        Personal user info, account details, and statistics will be configurable here.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
