import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AuthBackButtonProps {
  onClick: () => void;
}

const AuthBackButton = ({ onClick }: AuthBackButtonProps) => (
  <IconButton
    aria-label="Go back"
    onClick={onClick}
    sx={{
      position: 'fixed',
      left: { xs: 18, sm: 28 },
      top: { xs: 18, sm: 28 },
      color: '#111',
    }}
  >
    <ArrowBackIcon sx={{ fontSize: 34 }} />
  </IconButton>
);

export default AuthBackButton;
