import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordToggleProps {
  isVisible: boolean;
  onClick: () => void;
  iconSize?: number;
}

const PasswordToggle = ({ isVisible, onClick, iconSize = 34 }: PasswordToggleProps) => (
  <InputAdornment position="end">
    <IconButton aria-label={isVisible ? 'Hide password' : 'Show password'} onClick={onClick} edge="end">
      {isVisible ? <VisibilityOff sx={{ fontSize: iconSize }} /> : <Visibility sx={{ fontSize: iconSize }} />}
    </IconButton>
  </InputAdornment>
);

export default PasswordToggle;
