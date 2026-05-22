import { Box, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import {
  RadioButtonUnchecked as UncheckedIcon,
  PetsOutlined as PetIcon,
  LocalFireDepartmentOutlined as FireIcon,
  AddOutlined as AddIcon,
  AutoAwesomeOutlined as PresetIcon,
} from '@mui/icons-material';
import { UserHabit } from '../../api/habitsApi';

interface HabitsChecklistProps {
  habits: UserHabit[];
  filterToday: boolean;
  setFilterToday: (val: boolean) => void;
  actionLoading: string | null;
  onCompleteHabit: (habitId: number, title: string) => void;
  onCreatePlaceholder: () => void;
  onPresetPlaceholder: () => void;
}

const HabitsChecklist = ({
  habits,
  filterToday,
  setFilterToday,
  actionLoading,
  onCompleteHabit,
  onCreatePlaceholder,
  onPresetPlaceholder,
}: HabitsChecklistProps) => {
  const todayIndex = new Date().getDay();
  const displayedHabits = habits.filter((h) => {
    if (!filterToday) return true;
    return h.dayMask === 0 || (h.dayMask & (1 << todayIndex)) !== 0;
  });

  const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: 'TRIVIAL', color: '#437F70', bg: '#effaf3' };
      case 2:
        return { label: 'EASY', color: '#4A6070', bg: '#f0f4f8' };
      case 3:
        return { label: 'MEDIUM', color: '#ff8624', bg: '#fff5ec' };
      default:
        return { label: 'HARD', color: '#d71920', bg: '#fff0f0' };
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fffafa',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'start', sm: 'center' },
          gap: 2,
          mb: 3,
          pb: 1.5,
          borderBottom: '1px solid #f2effa',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', color: '#4A6070' }}>
          DAILY RITUALS
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography
            onClick={() => setFilterToday(true)}
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              px: 1.8,
              py: 0.6,
              borderRadius: '6px',
              letterSpacing: '0.05em',
              transition: 'all 120ms ease',
              bgcolor: filterToday ? '#4A6070' : 'transparent',
              color: filterToday ? '#fff' : '#4A6070',
              border: '1px solid',
              borderColor: filterToday ? '#4A6070' : '#e6e3dd',
            }}
          >
            TODAY
          </Typography>
          <Typography
            onClick={() => setFilterToday(false)}
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              px: 1.8,
              py: 0.6,
              borderRadius: '6px',
              letterSpacing: '0.05em',
              transition: 'all 120ms ease',
              bgcolor: !filterToday ? '#4A6070' : 'transparent',
              color: !filterToday ? '#fff' : '#4A6070',
              border: '1px solid',
              borderColor: !filterToday ? '#4A6070' : '#e6e3dd',
            }}
          >
            ALL RITUALS
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3.5 }}>
        <Button
          onClick={onCreatePlaceholder}
          startIcon={<AddIcon />}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#111',
            border: '1px solid #e6e3dd',
            borderRadius: '8px',
            px: 2,
            py: 1,
            textTransform: 'uppercase',
            transition: 'all 160ms ease',
            '&:hover': {
              bgcolor: '#f7f5f0',
              borderColor: '#111',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Create Ritual
        </Button>
        <Button
          onClick={onPresetPlaceholder}
          startIcon={<PresetIcon />}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#4A6070',
            border: '1px solid #e6e3dd',
            borderRadius: '8px',
            px: 2,
            py: 1,
            textTransform: 'uppercase',
            transition: 'all 160ms ease',
            '&:hover': {
              bgcolor: '#f0f4f8',
              borderColor: '#4A6070',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Presets
        </Button>
      </Box>

      {displayedHabits.length === 0 ? (
        <Box
          sx={{
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #e6e3dd',
            borderRadius: '8px',
          }}
        >
          <PetIcon sx={{ color: '#d0cac0', fontSize: 32, mb: 1.5 }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#4A6070' }}>
            No rituals found. Take a peaceful breath.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayedHabits.map((habit) => {
            const badge = getDifficultyBadge(habit.difficulty);
            const isPending = actionLoading === `complete-${habit.userHabitId}`;
            return (
              <Box
                key={habit.userHabitId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.2,
                  p: 2.5,
                  borderRadius: '8px',
                  border: '1px solid #e6e3dd',
                  bgcolor: '#ffffff',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.03)',
                  },
                }}
              >
                <IconButton
                  disabled={isPending}
                  onClick={() => onCompleteHabit(habit.userHabitId, habit.title)}
                  sx={{
                    color: '#4A6070',
                    p: 0,
                    '&:hover': { color: '#ff8624' },
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    <UncheckedIcon sx={{ fontSize: 26, opacity: 0.7 }} />
                  )}
                </IconButton>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '15px', mb: 0.5, color: '#111' }}>
                    {habit.title}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: '13px', color: '#4A6070', fontWeight: 500 }}>
                    {habit.description || 'No description provided.'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, shrink: 0 }}>
                  {habit.streak && habit.streak.currentStreak > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#ff8624' }}>
                      <FireIcon sx={{ fontSize: 17 }} />
                      <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>
                        {habit.streak.currentStreak}
                      </Typography>
                    </Box>
                  )}

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
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default HabitsChecklist;
