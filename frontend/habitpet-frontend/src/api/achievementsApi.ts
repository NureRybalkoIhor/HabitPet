import apiClient from './apiClient';

export interface AchievementInfo {
  achievementId: number;
  title: string;
  description: string;
  category: string;
  rarity: string;
  icon: string;
  xpReward: number;
  valueCondition: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  currentProgress: number;
}

export const getAchievements = async (userId: number): Promise<AchievementInfo[]> => {
  const response = await apiClient.get<AchievementInfo[]>(`/Achievements/${userId}`);
  return response.data;
};
