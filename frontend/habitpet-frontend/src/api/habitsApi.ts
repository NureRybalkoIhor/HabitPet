import apiClient from './apiClient';

export interface StreakInfo {
  streakId: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HabitRelation {
  habitId: number;
  name: string;
  description: string;
  defaultDayMask: number;
}

export interface UserHabit {
  userHabitId: number;
  title: string;
  description: string;
  isPositive: boolean;
  isActive: boolean;
  difficulty: number;
  priority: number;
  dayMask: number;
  hourMask: number;
  reminderTime?: string;
  createdAt: string;
  userId: number;
  habitId: number;
  habit?: HabitRelation;
  streak?: StreakInfo;
}

export const getUserHabits = async (userId: number): Promise<UserHabit[]> => {
  const response = await apiClient.get<UserHabit[]>(`/Habits/${userId}`);
  return response.data;
};

export const completeHabit = async (userHabitId: number, userId: number): Promise<void> => {
  await apiClient.post(`/Habits/${userHabitId}/complete/${userId}`);
};
