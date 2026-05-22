import apiClient from './apiClient';

export interface PetInfo {
  petId: number;
  name: string;
  mood: number;
  hunger: number;
  happiness: number;
  health: number;
  lastFedAt?: string;
  lastPlayedAt?: string;
}

export const getPet = async (userId: number): Promise<PetInfo> => {
  const response = await apiClient.get<PetInfo>(`/Pet/${userId}`);
  return response.data;
};

export const feedPet = async (userId: number, xpCost = 10): Promise<void> => {
  await apiClient.post(`/Pet/${userId}/feed?xpCost=${xpCost}`);
};

export const playWithPet = async (userId: number, xpCost = 15): Promise<void> => {
  await apiClient.post(`/Pet/${userId}/play?xpCost=${xpCost}`);
};
