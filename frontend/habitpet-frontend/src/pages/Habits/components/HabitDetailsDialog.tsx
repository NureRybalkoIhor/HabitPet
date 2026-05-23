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
import { UserHabit } from '../../../api/habitsApi';
import {
  getDifficultyBadge,
  getPriorityBadge,
  getFrequencyText,
} from '../../../utils/habitHelpers';

interface HabitDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  habit: UserHabit | null;
}

const HabitDetailsDialog = ({ open, onClose, habit }: HabitDetailsDialogProps) => {
  const [visibleLogsCount, setVisibleLogsCount] = useState(10);
  const DialogComponent = Dialog as any;

  useEffect(() => {
    if (open) {
      setVisibleLogsCount(10);
    }
  }, [open]);

  if (!habit) return null;

  const currentStreak = habit.streak?.currentStreak || 0;

  const getReminderHoursText = (mask: number) => {
    if (!mask) return 'None';
    const selectedHours: string[] = [];
    for (let h = 0; h < 24; h++) {
      if ((mask & (1 << h)) !== 0) {
        selectedHours.push(`${String(h).padStart(2, '0')}:00`);
      }
    }
    return selectedHours.join(', ');
  };

  const badge = getDifficultyBadge(habit.difficulty, habit.dayMask, currentStreak);
  const prio = getPriorityBadge(habit.priority);
  const categoryColor = habit.habit?.category?.color || '#111';
  const completionsCount = habit.history?.filter((h) => h.habitStatus === 1).length || 0;

  return (
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
        <span>RITUAL INFORMATION</span>
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
                TOTAL RITUALS DONE
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
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#4A6070',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '12px',
            px: 3,
            py: 1,
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
  );
};

export default HabitDetailsDialog;
