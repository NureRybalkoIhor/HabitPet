import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { CloseOutlined as CloseIcon } from '@mui/icons-material';
import { UserHabit, HabitTemplate } from '../../../api/habitsApi';
import { calculateXp, countBits } from '../../../utils/xpCalculator';


interface HabitDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  selectedHabit: UserHabit | null;
  templates: HabitTemplate[];
  onSubmit: (data: {
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
  }) => void;
}

const HabitDialog = ({
  open,
  onClose,
  mode,
  selectedHabit,
  templates,
  onSubmit,
}: HabitDialogProps) => {
  const DialogComponent = Dialog as any;
  const TextFieldComponent = TextField as any;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(2);
  const [priority, setPriority] = useState(2);
  const [isPositive, setIsPositive] = useState(true);
  const [dayMask, setDayMask] = useState(127);
  const [categoryId, setCategoryId] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [hourMask, setHourMask] = useState(0);
  const [errors, setErrors] = useState<{ title?: string; description?: string; days?: string }>({});

  const daysOfWeek = [
    { label: 'Monday', index: 1 },
    { label: 'Tuesday', index: 2 },
    { label: 'Wednesday', index: 3 },
    { label: 'Thursday', index: 4 },
    { label: 'Friday', index: 5 },
    { label: 'Saturday', index: 6 },
    { label: 'Sunday', index: 0 },
  ];

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  const fallbackCategories = [
    { categoryId: 1, name: 'Health & Fitness', color: '#ff8624' },
    { categoryId: 2, name: 'Mind & Focus', color: '#4A6070' },
    { categoryId: 3, name: 'Productivity', color: '#437F70' },
    { categoryId: 4, name: 'Finance', color: '#2e7d32' },
    { categoryId: 5, name: 'Social & Family', color: '#c2185b' },
    { categoryId: 6, name: 'Self-Care', color: '#7b1fa2' },
    { categoryId: 7, name: 'Learning & Skills', color: '#0288d1' },
    { categoryId: 8, name: 'Hobbies & Creative', color: '#f57c00' },
    { categoryId: 9, name: 'Home & Organization', color: '#607d8b' },
    { categoryId: 10, name: 'General', color: '#111111' },
  ];

  const categoriesList = Array.from(
    new Map(
      templates
        .filter((t) => t.category)
        .map((t) => [t.categoryId, t.category])
    ).values()
  ).filter((c): c is NonNullable<typeof c> => c !== undefined && c !== null);

  const actualCategories = categoriesList.length > 0 ? categoriesList : fallbackCategories;

  useEffect(() => {
    if (open) {
      setErrors({});
      if (mode === 'edit' && selectedHabit) {
        setTitle(selectedHabit.title);
        setDescription(selectedHabit.description);
        setDifficulty(selectedHabit.difficulty);
        setPriority(selectedHabit.priority);
        setIsPositive(selectedHabit.isPositive);
        setDayMask(selectedHabit.dayMask);
        setCategoryId(selectedHabit.habit?.categoryId || 10);
        setIsActive(selectedHabit.isActive);
        setHourMask(selectedHabit.hourMask);
      } else {
        setTitle('');
        setDescription('');
        setDifficulty(2);
        setPriority(2);
        setIsPositive(true);
        setDayMask(127);
        setCategoryId(10);
        setIsActive(true);
        setHourMask(0);
      }
    }
  }, [open, mode, selectedHabit]);

  const handleDayToggle = (dayIndex: number) => {
    const currentMask = dayMask === 0 ? 127 : dayMask;
    const newMask = currentMask ^ (1 << dayIndex);
    setDayMask(newMask);
    if (newMask !== 0 && errors.days) {
      setErrors((prev) => ({ ...prev, days: undefined }));
    }
  };

  const handleHourToggle = (hour: number) => {
    const newMask = hourMask ^ (1 << hour);
    setHourMask(newMask);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = 'Habit title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Habit intent or description is required';
    }
    if (dayMask === 0) {
      newErrors.days = 'Select at least one scheduled day';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validate()) {
      onSubmit({
        title,
        description,
        difficulty,
        priority,
        isPositive,
        dayMask,
        reminderTime: '',
        categoryId,
        isActive,
        hourMask,
      });
    }
  };

  const getDifficultyBtnTheme = (val: number, active: boolean) => {
    switch (val) {
      case 1:
        return active
          ? { color: '#ffffff', bg: '#437F70', border: '1px solid #437F70' }
          : { color: '#437F70', bg: '#effaf3', border: '1px solid #d3ebd9' };
      case 2:
        return active
          ? { color: '#ffffff', bg: '#4A6070', border: '1px solid #4A6070' }
          : { color: '#4A6070', bg: '#f0f4f8', border: '1px solid #d6e1ec' };
      case 3:
        return active
          ? { color: '#ffffff', bg: '#ff8624', border: '1px solid #ff8624' }
          : { color: '#ff8624', bg: '#fff5ec', border: '1px solid #ffdcb9' };
      default:
        return active
          ? { color: '#ffffff', bg: '#d71920', border: '1px solid #d71920' }
          : { color: '#d71920', bg: '#fff0f0', border: '1px solid #ffcccc' };
    }
  };

  const getPriorityBtnTheme = (val: number, active: boolean) => {
    switch (val) {
      case 1:
        return active
          ? { color: '#ffffff', bg: '#888888', border: '1px solid #888888' }
          : { color: '#777777', bg: '#f5f5f5', border: '1px solid #e0e0e0' };
      case 2:
        return active
          ? { color: '#ffffff', bg: '#4A6070', border: '1px solid #4A6070' }
          : { color: '#4A6070', bg: '#f0f4f8', border: '1px solid #d6e1ec' };
      default:
        return active
          ? { color: '#ffffff', bg: '#d71920', border: '1px solid #d71920' }
          : { color: '#d71920', bg: '#fff0f0', border: '1px solid #ffcccc' };
    }
  };

  const estimatedXp = calculateXp(difficulty, dayMask, selectedHabit?.streak?.currentStreak || 0);

  const inputStyles = {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#9a948b',
      borderWidth: '2px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7a746b',
      borderWidth: '2px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4A6070',
      borderWidth: '2.5px',
    },
    '& .MuiInputLabel-root': {
      fontWeight: 650,
      color: '#6c655c',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4A6070',
    },
    '& .MuiOutlinedInput-input': {
      fontWeight: 600,
    },
    '& .MuiSelect-select': {
      fontWeight: 600,
    },
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: '1.5px solid #e6e3dd',
          boxShadow: 'none',
          bgcolor: '#ffffff',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '18px',
          borderBottom: '1.5px solid #e6e3dd',
          pb: 2.5,
          pt: 3,
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fcfbfa',
        }}
      >
        <span>{mode === 'create' ? 'ESTABLISH NEW HABIT' : 'ADJUST HABIT'}</span>
        <IconButton onClick={onClose} sx={{ color: '#4A6070' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 4,
          pb: 4,
          pt: '24px !important',
          borderBottom: '1.5px solid #e6e3dd',
          borderTop: '1.5px solid #e6e3dd',
          maxHeight: '65vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ pt: 2 }}>
          <TextFieldComponent
            label="Habit Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e: any) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            error={!!errors.title}
            helperText={errors.title}
            InputLabelProps={{ style: { fontFamily: "'Inter', sans-serif" } }}
            inputProps={{ style: { fontFamily: "'Inter', sans-serif", fontWeight: 600 } }}
            sx={inputStyles}
          />
        </Box>

        <TextFieldComponent
          label="Intent / Description"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={(e: any) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          error={!!errors.description}
          helperText={errors.description}
          InputLabelProps={{ style: { fontFamily: "'Inter', sans-serif" } }}
          inputProps={{ style: { fontFamily: "'Inter', sans-serif" } }}
          sx={inputStyles}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
          <FormControl fullWidth sx={inputStyles}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {actualCategories.map((c) => (
                <MenuItem key={c.categoryId} value={c.categoryId}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color }} />
                    <span>{c.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HABIT TYPE
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px', width: 'fit-content' }}>
              <Button
                onClick={() => setIsPositive(true)}
                size="small"
                sx={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: isPositive ? '#ffffff' : '#4A6070',
                  bgcolor: isPositive ? '#437F70' : 'transparent',
                  px: 2.5,
                  py: 0.8,
                  borderRadius: '6px',
                  minWidth: 80,
                  '&:hover': { bgcolor: isPositive ? '#336155' : '#e6e3dd' },
                }}
              >
                Do (Build)
              </Button>
              <Button
                onClick={() => setIsPositive(false)}
                size="small"
                sx={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: !isPositive ? '#ffffff' : '#4A6070',
                  bgcolor: !isPositive ? '#d71920' : 'transparent',
                  px: 2.5,
                  py: 0.8,
                  borderRadius: '6px',
                  minWidth: 80,
                  '&:hover': { bgcolor: !isPositive ? '#b0141a' : '#e6e3dd' },
                }}
              >
                Avoid (Break)
              </Button>
            </Box>
          </Box>

          {mode === 'edit' && (
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                HABIT STATUS
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px', width: 'fit-content' }}>
                <Button
                  onClick={() => setIsActive(true)}
                  size="small"
                  sx={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: isActive ? '#ffffff' : '#4A6070',
                    bgcolor: isActive ? '#4A6070' : 'transparent',
                    px: 2.5,
                    py: 0.8,
                    borderRadius: '6px',
                    minWidth: 80,
                    '&:hover': { bgcolor: isActive ? '#344754' : '#e6e3dd' },
                  }}
                >
                  Active
                </Button>
                <Button
                  onClick={() => setIsActive(false)}
                  size="small"
                  sx={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: !isActive ? '#ffffff' : '#4A6070',
                    bgcolor: !isActive ? '#888888' : 'transparent',
                    px: 2.5,
                    py: 0.8,
                    borderRadius: '6px',
                    minWidth: 80,
                    '&:hover': { bgcolor: !isActive ? '#666666' : '#e6e3dd' },
                  }}
                >
                  Paused
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3.5 }}>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DIFFICULTY
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px' }}>
              {[
                { val: 1, lbl: 'Trivial' },
                { val: 2, lbl: 'Easy' },
                { val: 3, lbl: 'Medium' },
                { val: 4, lbl: 'Hard' },
              ].map((item) => {
                const active = difficulty === item.val;
                const themeBtn = getDifficultyBtnTheme(item.val, active);
                return (
                  <Button
                    key={item.val}
                    onClick={() => setDifficulty(item.val)}
                    size="small"
                    sx={{
                      flex: 1,
                      fontSize: '9px',
                      fontWeight: 800,
                      color: themeBtn.color,
                      bgcolor: themeBtn.bg,
                      border: themeBtn.border,
                      py: 0.8,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: active ? themeBtn.bg : '#e6e3dd' },
                    }}
                  >
                    {item.lbl}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRIORITY LEVEL
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px' }}>
              {[
                { val: 1, lbl: 'Low' },
                { val: 2, lbl: 'Medium' },
                { val: 3, lbl: 'High' },
              ].map((item) => {
                const active = priority === item.val;
                const themeBtn = getPriorityBtnTheme(item.val, active);
                return (
                  <Button
                    key={item.val}
                    onClick={() => setPriority(item.val)}
                    size="small"
                    sx={{
                      flex: 1,
                      fontSize: '9px',
                      fontWeight: 800,
                      color: themeBtn.color,
                      bgcolor: themeBtn.bg,
                      border: themeBtn.border,
                      py: 0.8,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: active ? themeBtn.bg : '#e6e3dd' },
                    }}
                  >
                    {item.lbl}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '8px',
            border: '2px solid #d3ebd9',
            bgcolor: '#effaf3',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#437F70',
              color: '#ffffff',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>XP</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#437F70' }}>
              +{estimatedXp} XP Reward
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#5a6b5d', fontWeight: 500 }}>
              Calculated dynamically based on {difficulty === 1 ? 'Trivial' : difficulty === 2 ? 'Easy' : difficulty === 3 ? 'Medium' : 'Hard'} difficulty and {dayMask === 0 ? '7' : countBits(dayMask)} scheduled days.
            </Typography>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SCHEDULED DAYS
            </Typography>
            {errors.days && (
              <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#d71920', letterSpacing: '0.05em' }}>
                {errors.days}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            {daysOfWeek.map((day) => {
              const isActiveDay = dayMask === 0 || (dayMask & (1 << day.index)) !== 0;
              return (
                <Box
                  key={day.label}
                  onClick={() => handleDayToggle(day.index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '10px 16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: isActiveDay ? '#437F70' : '#e6e3dd',
                    bgcolor: isActiveDay ? '#effaf3' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    '&:hover': {
                      borderColor: isActiveDay ? '#336155' : '#c8c4bc',
                      bgcolor: isActiveDay ? '#effaf3' : '#fcfbfa',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isActiveDay ? '#437F70' : '#4A6070',
                    }}
                  >
                    {day.label}
                  </Typography>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '4px',
                      border: '2px solid',
                      borderColor: isActiveDay ? '#437F70' : '#c8c4bc',
                      bgcolor: isActiveDay ? '#437F70' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {isActiveDay && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: '#ffffff',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            REMINDER HOURS (MULTIPLE TIMES A DAY)
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 1,
            }}
          >
            {hoursOfDay.map((hour) => {
              const active = (hourMask & (1 << hour)) !== 0;
              const formattedHour = String(hour).padStart(2, '0');
              return (
                <Button
                  key={hour}
                  onClick={() => handleHourToggle(hour)}
                  variant={active ? 'contained' : 'outlined'}
                  sx={{
                    minWidth: 0,
                    height: 36,
                    fontSize: '11px',
                    fontWeight: 800,
                    bgcolor: active ? '#fff5ec' : 'transparent',
                    color: active ? '#ff8624' : '#4A6070',
                    border: '2px solid',
                    borderColor: active ? '#ff8624' : '#e6e3dd',
                    borderRadius: '6px',
                    '&:hover': {
                      bgcolor: active ? '#ffe9d6' : '#fcfbfa',
                      borderColor: active ? '#e0721b' : '#c8c4bc',
                    },
                  }}
                >
                  {formattedHour}
                </Button>
              );
            })}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 3, justifyContent: 'flex-end', gap: 2, backgroundColor: '#fcfbfa', borderTop: '1.5px solid #e6e3dd' }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#4A6070',
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          sx={{
            bgcolor: '#ff8624',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '12px',
            px: 3,
            py: 1,
            borderRadius: '8px',
            textTransform: 'uppercase',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#e0721b',
              boxShadow: 'none',
            },
          }}
        >
          {mode === 'create' ? 'Establish' : 'Adjust'}
        </Button>
      </DialogActions>
    </DialogComponent>
  );
};

export default HabitDialog;
