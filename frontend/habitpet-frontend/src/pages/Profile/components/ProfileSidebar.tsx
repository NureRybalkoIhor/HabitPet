import { useRef } from 'react';
import { Avatar, Box, Card, LinearProgress, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { UserProfile, UserStats } from '../../../api/userApi';
import { getAvatarUrl, authFont } from './profileHelpers';

interface ProfileSidebarProps {
  profile: UserProfile;
  stats: UserStats;
  xpPercentage: number;
  xpLeft: number;
  percentLeft: number;
  isLoading: boolean;
  onAvatarUpload: (file: File) => void;
}

const ProfileSidebar = ({
  profile,
  stats,
  xpPercentage,
  xpLeft,
  percentLeft,
  isLoading,
  onAvatarUpload,
}: ProfileSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  const getLevelProgress = () => {
    const currentLevel = stats.currentLevel;
    const totalXpEarned = stats.totalXpEarned;
    const xpStart = currentLevel > 1 ? Math.pow((currentLevel - 1) * 10, 2) : 0;
    const xpEnd = Math.pow(currentLevel * 10, 2);
    const range = xpEnd - xpStart;
    const progressInLevel = totalXpEarned - xpStart;
    return {
      current: progressInLevel,
      max: range,
    };
  };

  const levelInfo = getLevelProgress();

  return (
    <Card
      sx={{
        p: { xs: 4, md: 4.5 },
        border: '1.5px solid #e6e3dd',
        borderRadius: '16px',
        boxShadow: 'none',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <Box
        onClick={handleAvatarClick}
        sx={{
          position: 'relative',
          cursor: 'pointer',
          borderRadius: '50%',
          mb: 3.5,
          '&:hover .avatar-overlay': {
            opacity: 1,
          },
        }}
      >
        <Avatar
          src={getAvatarUrl(profile.avatarUrl)}
          sx={{
            width: 170,
            height: 170,
            border: '3px solid #ff8624',
            boxShadow: '0 8px 24px rgba(255,134,36,0.15)',
          }}
        />
        <Box
          className="avatar-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            opacity: 0,
            transition: 'opacity 200ms ease',
          }}
        >
          <CameraAltIcon sx={{ fontSize: 36, mb: 0.5 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 800, fontFamily: authFont, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Change Photo
          </Typography>
        </Box>
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Typography
        sx={{
          fontFamily: authFont,
          fontSize: 25,
          fontWeight: 900,
          color: '#161616',
          textAlign: 'center',
          mb: 0.5,
        }}
      >
        {profile.fullName}
      </Typography>

      <Typography
        sx={{
          fontFamily: authFont,
          fontSize: 14,
          fontWeight: 700,
          color: '#8c8881',
          textAlign: 'center',
          mb: 3,
        }}
      >
        @{profile.username}
      </Typography>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 2.5,
          py: 1,
          border: '1.5px solid #ff8624',
          borderRadius: 999,
          bgcolor: '#fff9f5',
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: authFont,
            fontSize: 11,
            fontWeight: 900,
            color: '#ff8624',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          LEVEL {stats.currentLevel}
        </Typography>
      </Box>

      <Box sx={{ width: '100%', mb: 4.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
          <Typography sx={{ fontFamily: authFont, fontSize: 11, fontWeight: 800, color: '#8c8881', letterSpacing: '0.05em' }}>
            LEVEL PROGRESS
          </Typography>
          <Typography sx={{ fontFamily: authFont, fontSize: 11, fontWeight: 900, color: '#161616' }}>
            {levelInfo.current} / {levelInfo.max} XP
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={xpPercentage}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: '#fff0e2',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#ff8624',
              borderRadius: 6,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography
            sx={{
              fontFamily: authFont,
              fontSize: 10.5,
              fontWeight: 800,
              color: '#ff8624',
            }}
          >
            XP BALANCE: {stats.currentXp} XP
          </Typography>
          <Typography
            sx={{
              fontFamily: authFont,
              fontSize: 10.5,
              fontWeight: 700,
              color: '#8c8881',
            }}
          >
            {percentLeft}% ({xpLeft} XP) to next level
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          borderTop: '1.5px solid #e6e3dd',
          pt: 3,
          mt: 'auto',
        }}
      >
        <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1.5px solid #e6e3dd' }}>
          <Typography
            sx={{
              fontFamily: authFont,
              fontSize: 22,
              fontWeight: 900,
              color: '#ff8624',
              mb: 0.5,
            }}
          >
            {stats.totalDaysActive}
          </Typography>
          <Typography sx={{ fontFamily: authFont, fontSize: 9.5, fontWeight: 800, color: '#8c8881', letterSpacing: '0.02em' }}>
            DAYS ACT.
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1.5px solid #e6e3dd' }}>
          <Typography
            sx={{
              fontFamily: authFont,
              fontSize: 22,
              fontWeight: 900,
              color: '#ff8624',
              mb: 0.5,
            }}
          >
            {stats.totalHabitsDone}
          </Typography>
          <Typography sx={{ fontFamily: authFont, fontSize: 9.5, fontWeight: 800, color: '#8c8881', letterSpacing: '0.02em' }}>
            HABITS DONE
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: authFont,
              fontSize: 22,
              fontWeight: 900,
              color: '#ff8624',
              mb: 0.5,
            }}
          >
            {stats.totalXpEarned}
          </Typography>
          <Typography sx={{ fontFamily: authFont, fontSize: 9.5, fontWeight: 800, color: '#8c8881', letterSpacing: '0.02em' }}>
            TOTAL XP
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileSidebar;
