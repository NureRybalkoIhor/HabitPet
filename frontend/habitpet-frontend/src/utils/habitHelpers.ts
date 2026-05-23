import { calculateXp } from './xpCalculator';

export interface DifficultyBadge {
  label: string;
  color: string;
  bg: string;
}

export interface PriorityBadge {
  label: string;
  color: string;
}

export const getDifficultyBadge = (difficulty: number, dayMask: number, currentStreak: number = 0): DifficultyBadge => {
  const xp = calculateXp(difficulty, dayMask, currentStreak);
  switch (difficulty) {
    case 1:
      return { label: `TRIVIAL (+${xp} XP)`, color: '#437F70', bg: '#effaf3' };
    case 2:
      return { label: `EASY (+${xp} XP)`, color: '#4A6070', bg: '#f0f4f8' };
    case 3:
      return { label: `MEDIUM (+${xp} XP)`, color: '#ff8624', bg: '#fff5ec' };
    default:
      return { label: `HARD (+${xp} XP)`, color: '#d71920', bg: '#fff0f0' };
  }
};

export const getPriorityBadge = (priority: number): PriorityBadge => {
  switch (priority) {
    case 1:
      return { label: 'LOW', color: '#888' };
    case 3:
      return { label: 'HIGH', color: '#d71920' };
    default:
      return { label: 'MEDIUM', color: '#4A6070' };
  }
};

export const getFrequencyText = (mask: number, short: boolean = true): string => {
  if (mask === 0 || mask === 127) return 'Every day';
  if (mask === 62) return 'Weekdays';
  if (mask === 65) return 'Weekends';

  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const activeDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    if ((mask & (1 << i)) !== 0) {
      activeDays.push(days[i]);
    }
  }
  return activeDays.join(', ');
};

export const getRemindersText = (mask: number): string => {
  if (!mask) return 'Flexible time';
  const selectedHours: string[] = [];
  for (let h = 0; h < 24; h++) {
    if ((mask & (1 << h)) !== 0) {
      selectedHours.push(`${String(h).padStart(2, '0')}:00`);
    }
  }
  if (selectedHours.length <= 4) {
    return selectedHours.join(', ');
  }
  return `${selectedHours.length} times / day`;
};
