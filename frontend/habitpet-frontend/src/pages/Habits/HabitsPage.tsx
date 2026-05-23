import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Button, MenuItem, Select } from '@mui/material';
import { AddOutlined as AddIcon, AutoAwesomeOutlined as PresetIcon } from '@mui/icons-material';

import { useAuth } from '../../store/AuthContext';
import {
  getUserHabits,
  getHabitTemplates,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  UserHabit,
  HabitTemplate,
  CreateUserHabitDto,
  UpdateUserHabitDto,
} from '../../api/habitsApi';

import SideToast from '../../components/SideToast';
import HabitHeatmap from './components/HabitHeatmap';
import HabitCard from './components/HabitCard';
import HabitDialog from './components/HabitDialog';
import PresetTemplates from './components/PresetTemplates';
import HabitDetailsDialog from './components/HabitDetailsDialog';
import HabitCompleteDialog from './components/HabitCompleteDialog';
import { getLocalDateString } from '../../utils/habitHelpers';


const HabitsPage = () => {
  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedHabit, setSelectedHabit] = useState<UserHabit | null>(null);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsSelectedHabit, setDetailsSelectedHabit] = useState<UserHabit | null>(null);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeHabitId, setCompleteHabitId] = useState<number | null>(null);
  const [completeHabitTitle, setCompleteHabitTitle] = useState('');

  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'priority' | 'xp' | 'streak'>('default');

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const [hData, tData] = await Promise.all([
        getUserHabits(userId),
        getHabitTemplates(),
      ]);
      setHabits(hData);
      setTemplates(tData);
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to synchronize habit lists.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComplete = (habitId: number, title: string) => {
    setCompleteHabitId(habitId);
    setCompleteHabitTitle(title);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async (note: string) => {
    if (!userId || !completeHabitId) return;
    setCompleteDialogOpen(false);
    setActionLoading(`complete-${completeHabitId}`);
    try {
      await completeHabit(completeHabitId, userId, note);
      setToast({ message: `Habit "${completeHabitTitle}" completed. Wisdom grows.`, type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to complete habit.', type: 'error' });
    } finally {
      setActionLoading(null);
      setCompleteHabitId(null);
      setCompleteHabitTitle('');
    }
  };

  const handleDelete = async (habitId: number) => {
    setActionLoading(`delete-${habitId}`);
    try {
      await deleteHabit(habitId);
      setToast({ message: 'Habit dissolved.', type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to remove habit.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (habit: UserHabit) => {
    if (!userId) return;
    setActionLoading(`toggle-${habit.userHabitId}`);
    try {
      const dto: UpdateUserHabitDto = {
        userHabitId: habit.userHabitId,
        title: habit.title,
        description: habit.description,
        isPositive: habit.isPositive,
        isActive: !habit.isActive,
        difficulty: habit.difficulty,
        priority: habit.priority,
        dayMask: habit.dayMask,
        hourMask: habit.hourMask,
        reminderTime: habit.reminderTime,
      };
      await updateHabit(habit.userHabitId, dto);
      setToast({
        message: habit.isActive
          ? `Habit "${habit.title}" paused.`
          : `Habit "${habit.title}" resumed.`,
        type: 'success',
      });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to adjust habit status.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenCreate = () => {
    setSelectedHabit(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleOpenEdit = (habit: UserHabit) => {
    setSelectedHabit(habit);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleOpenDetails = (habit: UserHabit) => {
    setDetailsSelectedHabit(habit);
    setDetailsDialogOpen(true);
  };

  const handleDialogSubmit = async (data: {
    title: string;
    description: string;
    difficulty: number;
    priority: number;
    isPositive: boolean;
    dayMask: number;
    reminderTime: string;
    categoryId: number;
    isActive: boolean;
    hourMask: number;
  }) => {
    if (!userId) return;
    try {
      if (dialogMode === 'create') {
        const categoryTemplate = templates.find((t) => t.categoryId === data.categoryId);
        const habitId = categoryTemplate ? categoryTemplate.habitId : (templates[0]?.habitId || 1);

        const dto: CreateUserHabitDto = {
          title: data.title,
          description: data.description,
          isPositive: data.isPositive,
          difficulty: data.difficulty,
          priority: data.priority,
          dayMask: data.dayMask,
          hourMask: data.hourMask,
          reminderTime: data.reminderTime ? `${data.reminderTime}:00` : undefined,
          habitId,
          userId,
        };
        await createHabit(dto);
        setToast({ message: 'Custom habit established.', type: 'success' });
      } else {
        if (!selectedHabit) return;
        const dto: UpdateUserHabitDto = {
          userHabitId: selectedHabit.userHabitId,
          title: data.title,
          description: data.description,
          isPositive: data.isPositive,
          isActive: data.isActive,
          difficulty: data.difficulty,
          priority: data.priority,
          dayMask: data.dayMask,
          hourMask: data.hourMask,
          reminderTime: data.reminderTime ? `${data.reminderTime}:00` : undefined,
        };
        await updateHabit(selectedHabit.userHabitId, dto);
        setToast({ message: 'Habit properties adjusted.', type: 'success' });
      }
      setDialogOpen(false);
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to persist habit changes.', type: 'error' });
    }
  };

  const handleAddTemplate = async (template: HabitTemplate) => {
    if (!userId) return;
    setActionLoading(`template-${template.habitId}`);
    try {
      const dto: CreateUserHabitDto = {
        title: template.title,
        description: template.description,
        isPositive: template.isPositive,
        difficulty: template.difficulty,
        priority: 2,
        dayMask: template.defaultDayMask,
        hourMask: template.defaultHourMask,
        reminderTime: undefined,
        habitId: template.habitId,
        userId,
      };
      await createHabit(dto);
      setToast({ message: `Adopted "${template.title}" template.`, type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to add template habit.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#ff8624' }} />
      </Box>
    );
  }

  const todayStr = getLocalDateString();

  const filteredHabits = habits.filter((h) => {
    if (h.isMastered) return false;
    if (filterType === 'positive') return h.isPositive;
    if (filterType === 'negative') return !h.isPositive;
    return true;
  });

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority - a.priority;
    }
    if (sortBy === 'xp') {
      return b.difficulty - a.difficulty;
    }
    if (sortBy === 'streak') {
      const streakA = a.streak?.currentStreak || 0;
      const streakB = b.streak?.currentStreak || 0;
      return streakB - streakA;
    }
    return 0;
  });

  return (
    <Box
      sx={{
        color: '#111111',
        fontFamily: "'Inter', Arial, sans-serif",
        p: { xs: 2.5, md: 5 },
      }}
    >
      {toast && (
        <SideToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Box
        component="header"
        sx={{
          pb: 3,
          borderBottom: '1px solid #e6e3dd',
          mb: 5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: '24px',
            letterSpacing: '0.1em',
            color: '#111',
          }}
        >
          HABIT TEMPLE
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '12px',
            color: '#4A6070',
            letterSpacing: '0.15em',
            mt: 0.5,
          }}
        >
          HABITS & DAILY PRACTICES
        </Typography>
      </Box>

      <Box sx={{ mb: 5 }}>
        <HabitHeatmap habits={habits} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '5.5fr 4.5fr' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              pb: 1.5,
              borderBottom: '1px solid #e6e3dd',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', color: '#4A6070' }}>
              MY ACTIVE HABITS
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                size="small"
                sx={{
                  fontSize: '11px',
                  fontFamily: "'Inter', sans-serif",
                  height: '28px',
                  borderColor: '#e6e3dd',
                  bgcolor: 'transparent',
                  fontWeight: 700,
                  color: '#4A6070',
                }}
              >
                <MenuItem value="default">Sort: Default</MenuItem>
                <MenuItem value="priority">Sort: Priority</MenuItem>
                <MenuItem value="xp">Sort: XP Reward</MenuItem>
                <MenuItem value="streak">Sort: Streak</MenuItem>
              </Select>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {(['all', 'positive', 'negative'] as const).map((t) => (
                  <Typography
                    key={t}
                    onClick={() => setFilterType(t)}
                    sx={{
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      transition: 'all 120ms ease',
                      bgcolor: filterType === t ? '#4A6070' : 'transparent',
                      color: filterType === t ? '#ffffff' : '#4A6070',
                      border: '1px solid',
                      borderColor: filterType === t ? '#4A6070' : '#e6e3dd',
                    }}
                  >
                    {t}
                  </Typography>
                ))}
              </Box>

              <Button
                onClick={handleOpenCreate}
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                sx={{
                  bgcolor: '#ff8624',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  px: 2,
                  py: 0.7,
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#e0721b',
                    boxShadow: 'none',
                  },
                }}
              >
                Create
              </Button>
            </Box>
          </Box>

          {sortedHabits.length === 0 ? (
            <Box
              sx={{
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #e6e3dd',
                borderRadius: '12px',
                bgcolor: '#ffffff',
              }}
            >
              <PresetIcon sx={{ color: '#d0cac0', fontSize: 32, mb: 1.5 }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#4A6070' }}>
                No active habits found. Adopt presets or create custom ones.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedHabits.map((habit) => (
                <HabitCard
                  key={habit.userHabitId}
                  habit={habit}
                  todayStr={todayStr}
                  actionLoading={actionLoading}
                  onComplete={handleComplete}
                  onOpenEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onOpenDetails={handleOpenDetails}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </Box>
          )}

          {habits.some((h) => h.isMastered) && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: '16px',
                border: '1px solid #e6e3dd',
                bgcolor: '#fffbf5',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  color: '#b78103',
                  mb: 3,
                  pb: 1,
                  borderBottom: '1px solid #f9ebd2',
                }}
              >
                MASTERED PRACTICES ARCHIVE
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {habits
                  .filter((h) => h.isMastered)
                  .map((habit) => (
                    <Box
                      key={habit.userHabitId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2.5,
                        borderRadius: '12px',
                        border: '1px solid #e6e3dd',
                        bgcolor: '#ffffff',
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '15px', color: '#111' }}>
                          {habit.title}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#4A6070', mt: 0.5 }}>
                          {habit.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: '#fff9e6',
                          border: '1px solid #ffe89e',
                          px: 2,
                          py: 0.7,
                          borderRadius: '20px',
                          color: '#b78103',
                          fontWeight: 800,
                          fontSize: '11px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        MASTERED
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}
        </Box>

        <PresetTemplates
          templates={templates}
          habits={habits}
          actionLoading={actionLoading}
          onAddTemplate={handleAddTemplate}
        />
      </Box>

      <HabitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        selectedHabit={selectedHabit}
        templates={templates}
        onSubmit={handleDialogSubmit}
      />

      {detailsSelectedHabit && (
        <HabitDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setDetailsSelectedHabit(null);
          }}
          habit={detailsSelectedHabit}
          onMasterSuccess={fetchData}
        />
      )}

      <HabitCompleteDialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        onConfirm={handleCompleteConfirm}
        habitTitle={completeHabitTitle}
      />
    </Box>
  );
};

export default HabitsPage;
