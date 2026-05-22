import { Box, Typography } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box sx={{ p: 4, color: '#111' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Application Settings
      </Typography>
      <Typography sx={{ color: '#4A6070', fontWeight: 500 }}>
        Configure theme colors, notification preferences, sound effects, and pet decay timers.
      </Typography>
    </Box>
  );
};

export default SettingsPage;
