import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarsIcon from '@mui/icons-material/Stars';
import PetsIcon from '@mui/icons-material/PetsOutlined';

export const authFont = "'Inter', Arial, sans-serif";

export const getAvatarUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://localhost:7059${url}`;
};

export const getReasonDetails = (type: string, xpAmount: number, habitTitle?: string) => {
  switch (type) {
    case 'PetFeed':
      return {
        label: 'Fed pet companion',
        color: '#ff8624',
        bgColor: '#fff6ed',
        icon: <PetsIcon sx={{ color: '#ff8624', fontSize: 20 }} />,
      };
    case 'PetPlay':
      return {
        label: 'Played with companion',
        color: '#437F70',
        bgColor: '#effaf6',
        icon: <PetsIcon sx={{ color: '#437F70', fontSize: 20 }} />,
      };
    case 'HabitDone':
      if (xpAmount < 0) {
        const isFeed = Math.abs(xpAmount) === 10;
        return {
          label: isFeed ? 'Fed pet companion' : 'Played with companion',
          color: isFeed ? '#ff8624' : '#437F70',
          bgColor: isFeed ? '#fff6ed' : '#effaf6',
          icon: <PetsIcon sx={{ color: isFeed ? '#ff8624' : '#437F70', fontSize: 20 }} />,
        };
      }
      return {
        label: `Completed habit${habitTitle ? ` "${habitTitle}"` : ''}`,
        color: '#437F70',
        bgColor: 'rgba(67, 127, 112, 0.08)',
        icon: <TaskAltIcon sx={{ color: '#437F70', fontSize: 20 }} />,
      };
    case 'StreakBonus':
      return {
        label: 'Reached streak milestone!',
        color: '#ff8624',
        bgColor: 'rgba(255, 134, 36, 0.08)',
        icon: <LocalFireDepartmentIcon sx={{ color: '#ff8624', fontSize: 20 }} />,
      };
    case 'AchievementUnlocked':
      return {
        label: 'Unlocked an achievement!',
        color: '#c59265',
        bgColor: 'rgba(197, 146, 101, 0.08)',
        icon: <EmojiEventsIcon sx={{ color: '#c59265', fontSize: 20 }} />,
      };
    case 'ChallengeCompleted':
      return {
        label: `Mastered habit${habitTitle ? ` "${habitTitle}"` : ''}!`,
        color: '#2e7d32',
        bgColor: 'rgba(46, 125, 50, 0.08)',
        icon: <WorkspacePremiumIcon sx={{ color: '#2e7d32', fontSize: 20 }} />,
      };
    case 'ReturnBonus':
      return {
        label: 'Daily return reward',
        color: '#0288d1',
        bgColor: 'rgba(2, 136, 209, 0.08)',
        icon: <AutoAwesomeIcon sx={{ color: '#0288d1', fontSize: 20 }} />,
      };
    default:
      return {
        label: 'Earned experience points',
        color: '#7b1fa2',
        bgColor: 'rgba(123, 31, 162, 0.08)',
        icon: <StarsIcon sx={{ color: '#7b1fa2', fontSize: 20 }} />,
      };
  }
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const labelStyles = {
  fontFamily: authFont,
  fontSize: 11,
  fontWeight: 800,
  color: '#4A6070',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  mb: 1,
};

export const inputStyles = {
  minHeight: 50,
  border: '1.5px solid #e6e3dd',
  borderRadius: '8px',
  bgcolor: '#ffffff',
  color: '#111',
  fontFamily: authFont,
  fontSize: 14,
  fontWeight: 600,
  px: 2,
  transition: 'all 160ms ease',
  '&:hover': {
    borderColor: '#ff8624',
    bgcolor: '#fffbf9',
  },
  '&.Mui-focused': {
    borderColor: '#ff8624',
    bgcolor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(255, 134, 36, 0.12)',
  },
  '& input': {
    height: '50px',
    boxSizing: 'border-box',
    p: 0,
  },
};

export const selectStyles = {
  height: 50,
  border: '1.5px solid #e6e3dd',
  borderRadius: '8px',
  bgcolor: '#ffffff',
  color: '#111',
  fontFamily: authFont,
  fontSize: 14,
  fontWeight: 600,
  px: 1,
  transition: 'all 160ms ease',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    borderColor: '#ff8624',
    bgcolor: '#fffbf9',
  },
  '&.Mui-focused': {
    borderColor: '#ff8624',
    bgcolor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(255, 134, 36, 0.12)',
  },
};

export const errorStyles = {
  mt: 1,
  borderRadius: 1,
  bgcolor: '#fff4f4',
  color: '#d71920',
  fontFamily: authFont,
  fontSize: 12,
  fontWeight: 700,
  px: 1.1,
  py: 0.6,
};

export const submitButtonStyles = {
  mt: 1.5,
  height: 50,
  borderRadius: 2,
  bgcolor: '#ff8624',
  color: '#ffffff',
  fontFamily: authFont,
  fontSize: 14,
  fontWeight: 800,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: '#ff7200',
    boxShadow: 'none',
  },
  '&:disabled': {
    bgcolor: '#eae6df',
    color: '#8c8881',
  },
};
