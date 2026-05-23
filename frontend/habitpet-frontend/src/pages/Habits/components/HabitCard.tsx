import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import {
  RadioButtonUnchecked as UncheckedIcon,
  CheckCircle as CheckedIcon,
  LocalFireDepartmentOutlined as FireIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  InfoOutlined as InfoIcon,
  PlayArrowOutlined as PlayIcon,
  PauseOutlined as PauseIcon,
  CalendarTodayOutlined as CalendarIcon,
  NotificationsOutlined as BellIcon,
} from '@mui/icons-material';
import { UserHabit } from '../../../api/habitsApi';
import {
  getDifficultyBadge,
  getPriorityBadge,
  getFrequencyText,
  getRemindersText,
} from '../../../utils/habitHelpers';

interface HabitCardProps {
  habit: UserHabit;
  todayStr: string;
  actionLoading: string | null;
  onComplete: (habitId: number, title: string) => void;
  onOpenEdit: (habit: UserHabit) => void;
  onDelete: (habitId: number) => void;
  onOpenDetails: (habit: UserHabit) => void;
  onToggleActive?: (habit: UserHabit) => void;
}

const HabitCard = ({
  habit,
  todayStr,
  actionLoading,
  onComplete,
  onOpenEdit,
  onDelete,
  onOpenDetails,
  onToggleActive,
}: HabitCardProps) => {
  const isCompleted = habit.history?.some(
    (hist) => hist.actionDate === todayStr && hist.habitStatus === 1
  );

  const badge = getDifficultyBadge(habit.difficulty, habit.dayMask, habit.streak?.currentStreak || 0);
  const prio = getPriorityBadge(habit.priority);
  const categoryColor = habit.habit?.category?.color || '#111';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        p: 3,
        borderRadius: '12px',
        border: '1px solid #e6e3dd',
        borderLeft: `5px solid ${habit.isActive ? (habit.isPositive ? '#437F70' : '#d71920') : '#888888'}`,
        bgcolor: habit.isActive ? '#ffffff' : '#f8f7f5',
        opacity: habit.isActive ? (isCompleted ? 0.8 : 1) : 0.6,
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.03)',
        },
      }}
    >
      <IconButton
        disabled={!habit.isActive || actionLoading === `complete-${habit.userHabitId}`}
        onClick={() => onComplete(habit.userHabitId, habit.title)}
        sx={{
          color: isCompleted ? '#437F70' : '#4A6070',
          p: 0,
          '&:hover': { color: '#ff8624' },
        }}
      >
        {actionLoading === `complete-${habit.userHabitId}` ? (
          <CircularProgress size={26} color="inherit" />
        ) : isCompleted ? (
          <CheckedIcon sx={{ fontSize: 28 }} />
        ) : (
          <UncheckedIcon sx={{ fontSize: 28, opacity: 0.7 }} />
        )}
      </IconButton>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '17px',
              color: habit.isActive ? '#111' : '#888',
              textDecoration: isCompleted ? 'line-through' : 'none',
            }}
          >
            {habit.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 800,
              color: categoryColor,
              bgcolor: `${categoryColor}15`,
              border: `1px solid ${categoryColor}30`,
              px: 1.2,
              py: 0.4,
              borderRadius: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {habit.habit?.category?.name || 'General'}
          </Typography>

          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 850,
              color: habit.isPositive ? '#437F70' : '#d71920',
              bgcolor: habit.isPositive ? '#effaf3' : '#fff0f0',
              border: `1px solid ${habit.isPositive ? '#437F70' : '#d71920'}30`,
              px: 1.2,
              py: 0.4,
              borderRadius: '4px',
              letterSpacing: '0.05em',
            }}
          >
            {habit.isPositive ? 'DO' : 'AVOID'}
          </Typography>

          {!habit.isActive && (
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 800,
                color: '#888',
                bgcolor: '#f0f0f0',
                px: 1.2,
                py: 0.4,
                borderRadius: '4px',
                letterSpacing: '0.05em',
              }}
            >
              PAUSED
            </Typography>
          )}
        </Box>

        <Typography sx={{ fontSize: '14px', color: '#4A6070', fontWeight: 500, mb: 1.5 }}>
          {habit.description || 'No description provided.'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 13, color: '#7a8b99' }} />
            <Typography sx={{ fontSize: '11px', color: '#7a8b99', fontWeight: 600 }}>
              {getFrequencyText(habit.dayMask)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BellIcon sx={{ fontSize: 13, color: '#7a8b99' }} />
            <Typography sx={{ fontSize: '11px', color: '#7a8b99', fontWeight: 600 }}>
              {getRemindersText(habit.hourMask)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 800,
              color: badge.color,
              bgcolor: badge.bg,
              px: 1.2,
              py: 0.4,
              borderRadius: '4px',
              letterSpacing: '0.05em',
            }}
          >
            {badge.label}
          </Typography>

          <Typography sx={{ fontSize: '10px', color: '#888', fontWeight: 600 }}>
            PRIORITY: <span style={{ color: prio.color }}>{prio.label}</span>
          </Typography>

          {habit.isActive && habit.streak && habit.streak.currentStreak > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#ff8624' }}>
              <FireIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>
                {habit.streak.currentStreak}d Streak
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          onClick={() => onOpenDetails(habit)}
          sx={{ color: '#4A6070', '&:hover': { color: '#437F70', bgcolor: '#effaf3' } }}
        >
          <InfoIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {onToggleActive && (
          <IconButton
            onClick={() => onToggleActive(habit)}
            sx={{ color: '#4A6070', '&:hover': { color: '#ff8624', bgcolor: '#fff5ec' } }}
          >
            {habit.isActive ? <PauseIcon sx={{ fontSize: 20 }} /> : <PlayIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        )}

        <IconButton
          onClick={() => onOpenEdit(habit)}
          sx={{ color: '#4A6070', '&:hover': { color: '#ff8624', bgcolor: '#fff5ec' } }}
        >
          <EditIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton
          disabled={actionLoading === `delete-${habit.userHabitId}`}
          onClick={() => onDelete(habit.userHabitId)}
          sx={{ color: '#4A6070', '&:hover': { color: '#d71920', bgcolor: '#fff0f0' } }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HabitCard;
