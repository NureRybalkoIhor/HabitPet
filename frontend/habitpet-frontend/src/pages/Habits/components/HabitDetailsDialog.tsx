import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  CloseOutlined as CloseIcon,
  LocalFireDepartmentOutlined as FireIcon,
  EmojiEventsOutlined as XpIcon,
} from '@mui/icons-material';
import { UserHabit, masterHabit } from '../../../api/habitsApi';
import { useAuth } from '../../../store/AuthContext';
import {
  getDifficultyBadge,
  getPriorityBadge,
  getFrequencyText,
  getReminderHoursText,
} from '../../../utils/habitHelpers';

interface HabitDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  habit: UserHabit | null;
  onMasterSuccess?: () => void;
}

const HabitDetailsDialog = ({ open, onClose, habit, onMasterSuccess }: HabitDetailsDialogProps) => {
  const { userId } = useAuth();
  const [visibleLogsCount, setVisibleLogsCount] = useState(10);
  const [masterLoading, setMasterLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const DialogComponent = Dialog as any;

  useEffect(() => {
    if (open) {
      setVisibleLogsCount(10);
      setConfirmOpen(false);
      setErrorText(null);
    }
  }, [open]);

  if (!habit) return null;

  const currentStreak = habit.streak?.currentStreak || 0;

  const confirmMaster = async () => {
    if (!userId || !habit) return;
    setErrorText(null);
    setMasterLoading(true);
    try {
      await masterHabit(habit.userHabitId, userId);
      if (onMasterSuccess) {
        onMasterSuccess();
      }
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorText("Failed to perform the operation. Please try again later.");
    } finally {
      setMasterLoading(false);
    }
  };

  const badge = getDifficultyBadge(habit.difficulty, habit.dayMask, currentStreak);
  const prio = getPriorityBadge(habit.priority);
  const categoryColor = habit.habit?.category?.color || '#111';
  const completionsCount = habit.history?.filter((h) => h.habitStatus === 1).length || 0;

  return (
    <>
      <DialogComponent
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid #e6e3dd',
            boxShadow: 'none',
            bgcolor: '#ffffff',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '18px',
            borderBottom: '1px solid #e6e3dd',
            pb: 2.5,
            pt: 3,
            px: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>HABIT INFORMATION</span>
          <IconButton onClick={onClose} sx={{ color: '#4A6070' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 4, pt: '24px !important', display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Box sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', lineHeight: 1.2 }}>
                {habit.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: categoryColor,
                  bgcolor: `${categoryColor}15`,
                  border: `1px solid ${categoryColor}30`,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {habit.habit?.category?.name || 'General'}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '15px', color: '#4A6070', lineHeight: 1.6, mt: 1.5 }}>
              {habit.description || 'No description established.'}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, borderTop: '1px solid #f2effa', pt: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 1, letterSpacing: '0.05em' }}>
                DIFFICULTY & REWARD
              </Typography>
              <Typography
                sx={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: badge.color,
                  bgcolor: badge.bg,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                }}
              >
                {badge.label}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 1, letterSpacing: '0.05em' }}>
                PRIORITY LEVEL
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 800, color: prio.color }}>
                {prio.label}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 0.5, letterSpacing: '0.05em' }}>
                SCHEDULE
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
                {getFrequencyText(habit.dayMask, false)}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 0.5, letterSpacing: '0.05em' }}>
                STATUS
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: habit.isActive ? '#437F70' : '#888' }}>
                {habit.isActive ? 'Active' : 'Paused'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid #f2effa', pt: 3 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 0.5, letterSpacing: '0.05em' }}>
              REMINDER TIMES
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
              {getReminderHoursText(habit.hourMask)}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, borderTop: '1px solid #f2effa', pt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FireIcon sx={{ color: '#ff8624', fontSize: 32 }} />
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
                  CURRENT STREAK
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                  {habit.streak?.currentStreak || 0} days
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <XpIcon sx={{ color: '#437F70', fontSize: 32 }} />
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
                  TOTAL HABITS DONE
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                  {completionsCount} times
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid #f2effa', pt: 3 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#888', mb: 1.5, letterSpacing: '0.05em' }}>
              COMPLETION JOURNAL LOGS
            </Typography>
            {habit.history && habit.history.filter((h) => h.habitStatus === 1).length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    maxHeight: 180,
                    overflowY: 'auto',
                    border: '1px solid #e6e3dd',
                    borderRadius: '8px',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {habit.history
                    .filter((hist) => hist.habitStatus === 1)
                    .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime())
                    .slice(0, visibleLogsCount)
                    .map((hist) => (
                      <Box key={hist.habitHistoryId} sx={{ py: 0.5, borderBottom: '1px solid #e6e3dd', '&:last-child': { borderBottom: 'none' } }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#4A6070' }}>
                          ✓ Completed on {hist.actionDate}
                        </Typography>
                        {hist.userNote && (
                          <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#ff8624', pl: 2, fontStyle: 'italic', mt: 0.5 }}>
                            Note: "{hist.userNote}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
                {habit.history.filter((h) => h.habitStatus === 1).length > visibleLogsCount && (
                  <Button
                    onClick={() => setVisibleLogsCount((prev) => prev + 10)}
                    size="small"
                    sx={{
                      alignSelf: 'center',
                      fontSize: '11px',
                      fontWeight: 750,
                      color: '#ff8624',
                      mt: 0.5,
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Load 10 more previous entries...
                  </Button>
                )}
              </Box>
            ) : (
              <Typography sx={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                No entries logged in this scroll yet.
              </Typography>
            )}
          </Box>

          {habit.isActive && !habit.isMastered && (
            <Box
              sx={{
                mt: 2,
                p: 2.5,
                borderRadius: '12px',
                bgcolor: currentStreak >= 21 ? 'rgba(67, 127, 112, 0.05)' : 'rgba(255, 134, 36, 0.05)',
                border: `1.5px solid ${currentStreak >= 21 ? '#437F70' : '#ff8624'}30`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: currentStreak >= 21 ? '#437F70' : '#ff8624',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentStreak >= 21
                    ? (habit.isPositive ? 'Habit ready to be mastered' : 'Habit ready to be overcome')
                    : `${21 - currentStreak} ${21 - currentStreak === 1 ? 'streak' : 'streaks'} left to master`}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: currentStreak >= 21 ? '#437F70' : '#ff8624',
                    bgcolor: currentStreak >= 21 ? 'rgba(67, 127, 112, 0.15)' : 'rgba(255, 134, 36, 0.15)',
                    px: 1.2,
                    py: 0.4,
                    borderRadius: '4px',
                  }}
                >
                  {currentStreak}/21
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: '8px', bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${Math.min((currentStreak / 21) * 100, 100)}%`,
                    height: '100%',
                    bgcolor: currentStreak >= 21 ? '#437F70' : '#ff8624',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease-out',
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            {habit.isActive && !habit.isMastered && (
              <Button
                onClick={() => {
                  setErrorText(null);
                  setConfirmOpen(true);
                }}
                disabled={currentStreak < 21 || masterLoading}
                variant="contained"
                sx={{
                  bgcolor: habit.isPositive ? '#437F70' : '#ff8624',
                  color: '#ffffff',
                  fontWeight: 750,
                  fontSize: '12px',
                  px: 3.5,
                  py: 1.2,
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: habit.isPositive ? '#346357' : '#e0721b',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                  '&:disabled': {
                    bgcolor: '#f5f3f0',
                    color: '#d0c5b5',
                    border: '1px solid #e6e3dd'
                  }
                }}
              >
                {habit.isPositive ? 'Master Habit (+500 XP)' : 'Overcome Habit (+500 XP)'}
              </Button>
            )}
          </Box>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: '#4A6070',
              color: '#ffffff',
              fontWeight: 750,
              fontSize: '12px',
              px: 3.5,
              py: 1.2,
              borderRadius: '8px',
              textTransform: 'uppercase',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#344754',
                boxShadow: 'none',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </DialogComponent>

      <DialogComponent
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid #e6e3dd',
            boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
            bgcolor: '#ffffff',
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            px: 4.5,
            pt: 6,
            pb: 6,
            gap: 3
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: habit.isPositive ? 'rgba(67, 127, 112, 0.08)' : 'rgba(255, 134, 36, 0.08)',
              border: `1.5px solid ${habit.isPositive ? '#437F70' : '#ff8624'}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XpIcon sx={{ color: habit.isPositive ? '#437F70' : '#ff8624', fontSize: 28 }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111', lineHeight: 1.3, letterSpacing: '0.02em' }}>
            {habit.isPositive ? 'Master Habit' : 'Overcome Habit'}
          </Typography>

          <Typography sx={{ fontSize: '14px', color: '#4A6070', lineHeight: 1.6 }}>
            {habit.isPositive
              ? 'Are you sure this positive habit is fully mastered? It will be archived.'
              : 'Are you sure you successfully overcame this bad habit? It will be archived.'}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(67, 127, 112, 0.06)',
              border: '1px solid rgba(67, 127, 112, 0.15)',
              px: 2.5,
              py: 0.8,
              borderRadius: '20px',
            }}
          >
            <XpIcon sx={{ color: '#437F70', fontSize: 16 }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#437F70', letterSpacing: '0.08em' }}>
              REWARD: +500 XP
            </Typography>
          </Box>

          {errorText && (
            <Box
              sx={{
                width: '100%',
                bgcolor: 'rgba(211, 47, 47, 0.08)',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                borderRadius: '8px',
                p: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#d32f2f' }}>
                {errorText}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%', mt: 1.5 }}>
            <Button
              onClick={() => setConfirmOpen(false)}
              sx={{
                fontWeight: 800,
                fontSize: '11px',
                color: '#4A6070',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                px: 4,
                py: 1.2,
                borderRadius: '8px',
                border: '1.5px solid #e6e3dd',
                bgcolor: '#ffffff',
                flex: 1,
                maxHeight: '40px',
                '&:hover': { bgcolor: '#f9f8f6', borderColor: '#c8c4bc' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMaster}
              disabled={masterLoading}
              variant="contained"
              sx={{
                bgcolor: habit.isPositive ? '#437F70' : '#ff8624',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '0.05em',
                px: 4,
                py: 1.2,
                borderRadius: '8px',
                textTransform: 'uppercase',
                boxShadow: 'none',
                flex: 1,
                maxHeight: '40px',
                '&:hover': {
                  bgcolor: habit.isPositive ? '#346357' : '#e0721b',
                  boxShadow: 'none'
                }
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogComponent>
    </>
  );
};

export default HabitDetailsDialog;
