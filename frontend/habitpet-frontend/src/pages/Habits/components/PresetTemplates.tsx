import { Box, Typography, Button, CircularProgress } from '@mui/material';
import {
  CalendarTodayOutlined as CalendarIcon,
  NotificationsOutlined as BellIcon,
} from '@mui/icons-material';
import { HabitTemplate, UserHabit } from '../../../api/habitsApi';
import {
  getDifficultyBadge,
  getFrequencyText,
  getRemindersText,
} from '../../../utils/habitHelpers';

interface PresetTemplatesProps {
  templates: HabitTemplate[];
  habits: UserHabit[];
  actionLoading: string | null;
  onAddTemplate: (template: HabitTemplate) => void;
}

const PresetTemplates = ({
  templates,
  habits,
  actionLoading,
  onAddTemplate,
}: PresetTemplatesProps) => {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography sx={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', color: '#4A6070' }}>
        TEMPLE PRESETS
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {templates.map((template) => {
          const alreadyAdopted = habits.some((h) => h.habitId === template.habitId);
          const badge = getDifficultyBadge(template.difficulty, template.defaultDayMask);
          const isAdoptPending = actionLoading === `template-${template.habitId}`;
          const categoryColor = template.category?.color || '#111';

          return (
            <Box
              key={template.habitId}
              sx={{
                p: 2.5,
                borderRadius: '8px',
                border: '1px solid #e6e3dd',
                borderLeft: `4px solid ${categoryColor}`,
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '15px', color: '#111' }}>
                    {template.title}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#4A6070', mt: 0.5 }}>
                    {template.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 13, color: '#7a8b99' }} />
                      <Typography sx={{ fontSize: '11px', color: '#7a8b99', fontWeight: 600 }}>
                        {getFrequencyText(template.defaultDayMask)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BellIcon sx={{ fontSize: 13, color: '#7a8b99' }} />
                      <Typography sx={{ fontSize: '11px', color: '#7a8b99', fontWeight: 600 }}>
                        {getRemindersText(template.defaultHourMask)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  disabled={alreadyAdopted || isAdoptPending}
                  onClick={() => onAddTemplate(template)}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    borderColor: '#e6e3dd',
                    color: alreadyAdopted ? '#888' : '#4A6070',
                    textTransform: 'uppercase',
                    minWidth: 80,
                    ml: 2,
                    '&:hover': {
                      bgcolor: alreadyAdopted ? 'transparent' : '#f0f4f8',
                      borderColor: alreadyAdopted ? '#e6e3dd' : '#4A6070',
                    },
                  }}
                >
                  {isAdoptPending ? (
                    <CircularProgress size={12} color="inherit" />
                  ) : alreadyAdopted ? (
                    'Active'
                  ) : (
                    'Adopt'
                  )}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                  {template.category?.name || 'General'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PresetTemplates;
