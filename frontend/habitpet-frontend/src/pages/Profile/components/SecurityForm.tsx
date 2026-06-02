import { FormEvent, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, InputBase, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { labelStyles, inputStyles, errorStyles, submitButtonStyles } from './profileHelpers';

interface SecurityFormProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  currentPasswordError: string;
  setCurrentPasswordError: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  newPasswordError: string;
  setNewPasswordError: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  confirmPasswordError: string;
  setConfirmPasswordError: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SecurityForm = ({
  currentPassword,
  setCurrentPassword,
  currentPasswordError,
  setCurrentPasswordError,
  newPassword,
  setNewPassword,
  newPasswordError,
  setNewPasswordError,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
  setConfirmPasswordError,
  isLoading,
  onSubmit,
}: SecurityFormProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.2, flexGrow: 1 }}>
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
                sx={{ mr: 1, color: '#4A6070' }}
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
                sx={{ mr: 1, color: '#4A6070' }}
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
                sx={{ mr: 1, color: '#4A6070' }}
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
  );
};

export default SecurityForm;
