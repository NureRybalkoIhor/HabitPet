import { ReactNode } from 'react';
import { Button } from '@mui/material';
import { authColors, authFont } from './authTheme';

interface AuthCardButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  width?: string;
  height?: number;
  fontWeight?: number;
}

const AuthCardButton = ({
  children,
  disabled,
  onClick,
  type = 'button',
  width = '80%',
  height = 62,
  fontWeight = 600,
}: AuthCardButtonProps) => (
  <Button
    disabled={disabled}
    type={type}
    onClick={onClick}
    sx={{
      alignSelf: 'center',
      width,
      height,
      borderRadius: 2,
      bgcolor: authColors.white,
      color: authColors.black,
      fontFamily: authFont,
      fontSize: 16,
      fontWeight,
      textTransform: 'none',
      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.28)',
      transition: 'box-shadow 160ms ease, transform 160ms ease, background 160ms ease',
      '&:hover': {
        bgcolor: '#ffffff',
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.22)',
        transform: 'translateY(-1px)',
      },
    }}
  >
    {children}
  </Button>
);

export default AuthCardButton;
