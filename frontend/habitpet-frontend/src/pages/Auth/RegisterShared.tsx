import { ClipboardEventHandler, KeyboardEventHandler, ReactNode } from 'react';
import { Box, Button, InputBase, Typography } from '@mui/material';

export interface RegisterFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  endAdornment?: ReactNode;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onPaste?: ClipboardEventHandler<HTMLInputElement>;
}

export const RegisterField = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  endAdornment,
  onKeyDown,
  onPaste,
}: RegisterFieldProps) => (
  <Box sx={{ width: '100%' }}>
    <Typography sx={fieldLabelStyles}>{label}</Typography>
    <InputBase
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      autoComplete="off"
      fullWidth
      endAdornment={endAdornment}
      sx={lineInputStyles}
    />
    {error && <Typography sx={errorStyles}>{error}</Typography>}
  </Box>
);

interface PrimaryButtonProps {
  children: ReactNode;
  disabled?: boolean;
  type: 'button' | 'submit';
}

export const PrimaryButton = ({ children, disabled, type }: PrimaryButtonProps) => (
  <Button
    disabled={disabled}
    fullWidth
    type={type}
    variant="contained"
    sx={{
      mt: 3,
      height: 56,
      border: '1.5px solid #111',
      borderRadius: 2,
      bgcolor: '#ff8624',
      color: '#111',
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: 17,
      fontWeight: 800,
      textTransform: 'none',
      boxShadow: 'none',
      transition: 'background 160ms ease, box-shadow 160ms ease, transform 160ms ease',
      '&:hover': {
        bgcolor: '#ff9438',
        boxShadow: '0 9px 20px rgba(255, 134, 36, 0.16)',
        transform: 'translateY(-1px)',
      },
    }}
  >
    {children}
  </Button>
);

export const titleStyles = {
  mb: 4,
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 15,
  fontWeight: 700,
  color: '#111',
  textAlign: 'center',
};

export const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  width: '100%',
};

export const fieldLabelStyles = {
  mb: 1,
  color: '#ff6f00',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 14,
  fontWeight: 800,
};

export const lineInputStyles = {
  minHeight: 42,
  borderBottom: '1.5px solid #111',
  color: '#111',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 16,
  fontWeight: 600,
  transition: 'border-color 160ms ease, transform 160ms ease',
  '&:hover': {
    borderBottomColor: '#ff8624',
    transform: 'translateY(-1px)',
  },
  '&.Mui-focused': {
    borderBottomColor: '#ff8624',
  },
  '& input': {
    p: 0,
  },
  '& input::placeholder': {
    opacity: 1,
    color: '#3f3f3f',
    fontWeight: 500,
  },
};

export const errorStyles = {
  mt: 0.8,
  color: '#ff1414',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 11.5,
  fontWeight: 500,
};
