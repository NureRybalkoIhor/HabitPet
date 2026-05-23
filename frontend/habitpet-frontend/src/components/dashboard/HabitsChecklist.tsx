import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PetsOutlined as PetIcon } from '@mui/icons-material';
import { UserHabit } from '../../api/habitsApi';
import HabitCard from '../../pages/Habits/components/HabitCard';
import HabitDetailsDialog from '../../pages/Habits/components/HabitDetailsDialog';
import HabitCompleteDialog from '../../pages/Habits/components/HabitCompleteDialog';
import { getLocalDateString } from '../../utils/habitHelpers';

interface HabitsChecklistProps {
  habits: UserHabit[];
  filterToday: boolean;
  setFilterToday: (val: boolean) => void;
  actionLoading: string | null;
  onCompleteHabit: (habitId: number, title: string, note?: string) => Promise<void>;
  onRefresh?: () => void;
}

const HabitsChecklist = ({
  habits,
  filterToday,
  setFilterToday,
  actionLoading,
  onCompleteHabit,
  onRefresh,
}: HabitsChecklistProps) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsSelectedHabit, setDetailsSelectedHabit] = useState<UserHabit | null>(null);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeHabitId, setCompleteHabitId] = useState<number | null>(null);
  const [completeHabitTitle, setCompleteHabitTitle] = useState('');

  const todayIndex = new Date().getDay();
  const displayedHabits = habits.filter((h) => {
    if (h.isMastered) return false;
    if (!filterToday) return true;
    return h.dayMask === 0 || (h.dayMask & (1 << todayIndex)) !== 0;
  });

  const todayStr = getLocalDateString();

  const handleCompleteClick = (habitId: number, title: string) => {
    setCompleteHabitId(habitId);
    setCompleteHabitTitle(title);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async (note: string) => {
    if (!completeHabitId) return;
    setCompleteDialogOpen(false);
    await onCompleteHabit(completeHabitId, completeHabitTitle, note);
    setCompleteHabitId(null);
    setCompleteHabitTitle('');
  };

  const handleOpenDetails = (habit: UserHabit) => {
    setDetailsSelectedHabit(habit);
    setDetailsDialogOpen(true);
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
          DAILY HABITS
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
            ALL HABITS
          </Typography>
        </Box>
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
            No habits found. Take a peaceful breath.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {displayedHabits.map((habit) => (
            <HabitCard
              key={habit.userHabitId}
              habit={habit}
              todayStr={todayStr}
              actionLoading={actionLoading}
              onComplete={handleCompleteClick}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </Box>
      )}

      {detailsSelectedHabit && (
        <HabitDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setDetailsSelectedHabit(null);
          }}
          habit={detailsSelectedHabit}
          onMasterSuccess={onRefresh}
        />
      )}

      <HabitCompleteDialog
        open={completeDialogOpen}
        onClose={() => {
          setCompleteDialogOpen(false);
          setCompleteHabitId(null);
          setCompleteHabitTitle('');
        }}
        onConfirm={handleCompleteConfirm}
        habitTitle={completeHabitTitle}
      />
    </Box>
  );
};

export default HabitsChecklist;
