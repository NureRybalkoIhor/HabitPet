import { ChangeEvent, FormEvent } from 'react';
import { Box, InputAdornment } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { ProfileValidationData, ValidationErrors } from '../../utils/validation';
import { PrimaryButton, RegisterField, formStyles } from './RegisterShared';

interface RegisterStage2Props {
  avatarPreview: string;
  errors: ValidationErrors<keyof ProfileValidationData>;
  profile: ProfileValidationData;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: keyof ProfileValidationData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const RegisterStage2 = ({
  avatarPreview,
  errors,
  profile,
  onAvatarChange,
  onChange,
  onSubmit,
}: RegisterStage2Props) => (
  <Box component="form" onSubmit={onSubmit} sx={formStyles}>
    <label className="mb-2 flex cursor-pointer flex-col items-center">
      <input className="hidden" type="file" accept="image/*" onChange={onAvatarChange} />
      <span className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full border border-black bg-[#e1e1e1] transition hover:-translate-y-0.5 hover:bg-[#eeeeee] hover:shadow-[0_8px_18px_rgba(0,0,0,0.10)]">
        {avatarPreview ? (
          <img className="h-full w-full object-cover" src={avatarPreview} alt="Selected avatar" />
        ) : (
          <PhotoCameraOutlinedIcon sx={{ fontSize: 38, color: '#222' }} />
        )}
      </span>
    </label>

    <RegisterField
      label="Your Name"
      placeholder="Enter your name"
      value={profile.firstName}
      error={errors.firstName}
      onChange={(value) => onChange('firstName', value)}
    />

    <RegisterField
      label="Your Last Name"
      placeholder="Enter your last name"
      value={profile.lastName}
      error={errors.lastName}
      onChange={(value) => onChange('lastName', value)}
    />

    <RegisterField
      label="Date of Birth"
      type="date"
      value={profile.birthday}
      error={errors.birthday}
      onChange={(value) => onChange('birthday', value)}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') event.preventDefault();
      }}
      onPaste={(event) => event.preventDefault()}
      endAdornment={
        <InputAdornment position="end">
          <CalendarMonthOutlinedIcon sx={{ fontSize: 27, color: '#111' }} />
        </InputAdornment>
      }
    />

    <PrimaryButton type="submit">Next</PrimaryButton>
  </Box>
);

export default RegisterStage2;
