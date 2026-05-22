import apiClient from './apiClient';

export interface UserStats {
  currentXp: number;
  totalXpEarned: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalHabitsDone: number;
  totalDaysActive: number;
}

export interface UserProfile {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  Stats?: UserStats;
}

export const getUser = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/Users/${userId}`);
  return response.data;
};

export const uploadAvatar = async (userId: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ avatarUrl: string }>(
    `/Users/${userId}/avatar`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.avatarUrl;
};
