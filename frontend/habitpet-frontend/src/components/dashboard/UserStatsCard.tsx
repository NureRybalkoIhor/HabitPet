import { Box, Typography, LinearProgress } from '@mui/material';

interface UserStatsCardProps {
  currentLevel: number;
  totalXpEarned: number;
  currentXp: number;
  totalHabitsDone: number;
  totalDaysActive: number;
}

const UserStatsCard = ({
  currentLevel,
  totalXpEarned,
  currentXp,
  totalHabitsDone,
  totalDaysActive,
}: UserStatsCardProps) => {
  const getLevelProgress = () => {
    const xpStart = currentLevel > 1 ? Math.pow((currentLevel - 1) * 10, 2) : 0;
    const xpEnd = Math.pow(currentLevel * 10, 2);
    const range = xpEnd - xpStart;
    const progressInLevel = totalXpEarned - xpStart;

    const progressPercent = Math.min(100, Math.max(0, (progressInLevel / range) * 100));
    return {
      progress: progressPercent,
      current: progressInLevel,
      max: range,
    };
  };

  const levelInfo = getLevelProgress();

  return (
    <Box
      sx={{
        bgcolor: '#fffafa',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 4,
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', color: '#4A6070', mb: 2 }}>
            LEVEL PROGRESS
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#ff8624', fontSize: '38px', lineHeight: 1 }}>
              Lv. {currentLevel.toString().padStart(2, '0')}
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#4A6070' }}>
              {levelInfo.current} / {levelInfo.max} XP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={levelInfo.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#ff8624' },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            pl: { sm: 3 },
            borderLeft: { sm: '1px solid #e6e3dd' },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              CURRENT XP
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {currentXp}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              TOTAL HABITS DONE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totalHabitsDone}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              TOTAL DAYS ACTIVE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totalDaysActive}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              TOTAL EARNED
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totalXpEarned}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserStatsCard;
