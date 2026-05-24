import { Card, Typography, Box, LinearProgress } from '@mui/material';
import { LockOutlined, CheckCircle, AutoAwesome } from '@mui/icons-material';
import { AchievementInfo } from '../../../api/achievementsApi';
import { iconMap, getDifficultyStyle, formatUnlockDate } from './achievementsHelpers';

interface AchievementCardProps {
  ach: AchievementInfo;
}

const AchievementCard = ({ ach }: AchievementCardProps) => {
  const IconComponent = iconMap[ach.icon] || AutoAwesome;
  const isUnlocked = ach.isUnlocked;
  const diffStyle = getDifficultyStyle(ach.rarity);
  const progressPercent = ach.valueCondition > 0 ? (ach.currentProgress / ach.valueCondition) * 100 : 0;

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: isUnlocked ? '#ffffff' : '#fcfbfa',
        border: isUnlocked ? `1.5px solid ${diffStyle.border}` : '1.5px solid #e6e3dd',
        borderRadius: '16px',
        p: 2.5,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        opacity: isUnlocked ? 1 : 0.75,
        boxShadow: isUnlocked ? '0 4px 12px rgba(0, 0, 0, 0.02)' : 'none',
        transition: 'all 200ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isUnlocked ? '0 8px 24px rgba(0,0,0,0.06)' : '0 4px 12px rgba(0,0,0,0.02)',
          borderColor: diffStyle.border,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          sx={{
            fontSize: '10px',
            fontWeight: 800,
            color: diffStyle.text,
            bgcolor: `${diffStyle.border}15`,
            px: 1.2,
            py: 0.3,
            borderRadius: '4px',
            letterSpacing: '0.08em',
            border: `1px solid ${diffStyle.border}40`,
          }}
        >
          {diffStyle.label.toUpperCase()}
        </Typography>

        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 800,
            color: isUnlocked ? '#ff8624' : '#888',
            letterSpacing: '0.05em',
          }}
        >
          +{ach.xpReward} XP
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            border: `1.5px solid ${isUnlocked ? diffStyle.border : '#e6e3dd'}`,
            bgcolor: isUnlocked ? `${diffStyle.border}08` : '#f2effa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isUnlocked ? diffStyle.text : '#a8a296',
            flexShrink: 0,
          }}
        >
          <IconComponent sx={{ fontSize: 22 }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              fontWeight: 800,
              color: isUnlocked ? '#111' : '#555',
              mb: 0.5,
              letterSpacing: '0.02em',
            }}
          >
            {ach.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '12.5px',
              color: '#555',
              lineHeight: 1.45,
              fontWeight: 500,
            }}
          >
            {ach.description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 'auto', pt: isUnlocked ? 2 : 0, borderTop: isUnlocked ? '1.2px solid #f2effa' : 'none' }}>
        {isUnlocked ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#437F70' }}>
            <CheckCircle sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>
              UNLOCKED {formatUnlockDate(ach.unlockedAt)?.toUpperCase()}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#888' }}>
                <LockOutlined sx={{ fontSize: 11 }} />
                <Typography sx={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  LOCKED
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '10.5px', fontWeight: 800, color: '#111' }}>
                {ach.currentProgress} / {ach.valueCondition}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 5,
                borderRadius: 2.5,
                bgcolor: '#f0ede9',
                '& .MuiLinearProgress-bar': { bgcolor: '#c8c4bc' },
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AchievementCard;
