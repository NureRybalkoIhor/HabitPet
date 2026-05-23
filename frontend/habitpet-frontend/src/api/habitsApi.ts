import apiClient from './apiClient';

export interface StreakInfo {
  streakId: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HabitHistoryInfo {
  habitHistoryId: number;
  actionDate: string;
  habitStatus: number;
  userNote?: string;
  markedAt: string;
  userHabitId: number;
}

export interface UserHabit {
  userHabitId: number;
  title: string;
  description: string;
  isPositive: boolean;
  isActive: boolean;
  isMastered: boolean;
  difficulty: number;
  priority: number;
  dayMask: number;
  hourMask: number;
  reminderTime?: string;
  createdAt: string;
  userId: number;
  habitId: number;
  habit?: HabitTemplate;
  streak?: StreakInfo;
  history?: HabitHistoryInfo[];
}

export interface CategoryInfo {
  categoryId: number;
  name: string;
  color: string;
}

export interface HabitTemplate {
  habitId: number;
  title: string;
  description: string;
  isPositive: boolean;
  difficulty: number;
  defaultDayMask: number;
  defaultHourMask: number;
  categoryId: number;
  category?: CategoryInfo;
}

export interface CreateUserHabitDto {
  title: string;
  description: string;
  isPositive: boolean;
  difficulty: number;
  priority: number;
  dayMask: number;
  hourMask: number;
  reminderTime?: string;
  habitId: number;
  userId: number;
}

export interface UpdateUserHabitDto {
  userHabitId: number;
  title: string;
  description: string;
  isPositive: boolean;
  isActive: boolean;
  isMastered?: boolean;
  difficulty: number;
  priority: number;
  dayMask: number;
  hourMask: number;
  reminderTime?: string;
}

export const getUserHabits = async (userId: number): Promise<UserHabit[]> => {
  const response = await apiClient.get<UserHabit[]>(`/Habits/${userId}`);
  return response.data;
};

export const getHabitTemplates = async (): Promise<HabitTemplate[]> => {
  const response = await apiClient.get<HabitTemplate[]>('/Habits/templates');
  return response.data;
};

export const createHabit = async (dto: CreateUserHabitDto): Promise<UserHabit> => {
  const response = await apiClient.post<UserHabit>('/Habits', dto);
  return response.data;
};

export const updateHabit = async (id: number, dto: UpdateUserHabitDto): Promise<UserHabit> => {
  const response = await apiClient.put<UserHabit>(`/Habits/${id}`, dto);
  return response.data;
};

export const deleteHabit = async (id: number): Promise<void> => {
  await apiClient.delete(`/Habits/${id}`);
};

export const completeHabit = async (userHabitId: number, userId: number, note?: string): Promise<void> => {
  const url = note
    ? `/Habits/${userHabitId}/complete/${userId}?note=${encodeURIComponent(note)}`
    : `/Habits/${userHabitId}/complete/${userId}`;
  await apiClient.post(url);
};

export const masterHabit = async (userHabitId: number, userId: number): Promise<void> => {
  await apiClient.post(`/Habits/${userHabitId}/master/${userId}`);
};

