import { FormEvent } from 'react';
import { Box, Button, Grid, InputBase, MenuItem, Select, Typography } from '@mui/material';
import { labelStyles, inputStyles, selectStyles, errorStyles, submitButtonStyles } from './profileHelpers';

interface PersonalDetailsFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  fullNameError: string;
  setFullNameError: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  usernameError: string;
  setUsernameError: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  emailError: string;
  setEmailError: (val: string) => void;
  sex: string;
  setSex: (val: string) => void;
  birthday: string;
  setBirthday: (val: string) => void;
  birthdayError: string;
  setBirthdayError: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const PersonalDetailsForm = ({
  fullName,
  setFullName,
  fullNameError,
  setFullNameError,
  username,
  setUsername,
  usernameError,
  setUsernameError,
  email,
  setEmail,
  emailError,
  setEmailError,
  sex,
  setSex,
  birthday,
  setBirthday,
  birthdayError,
  setBirthdayError,
  isLoading,
  onSubmit,
}: PersonalDetailsFormProps) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.2, flexGrow: 1 }}>
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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography sx={labelStyles}>Gender</Typography>
          <Select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            displayEmpty
            fullWidth
            sx={selectStyles}
          >
            <MenuItem value="">
              Select gender
            </MenuItem>
            <MenuItem value="male">
              Male
            </MenuItem>
            <MenuItem value="female">
              Female
            </MenuItem>
            <MenuItem value="other">
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
  );
};

export default PersonalDetailsForm;
