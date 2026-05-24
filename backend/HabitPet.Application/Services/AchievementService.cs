using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Domain.Enums;
using HabitPet.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Services
{
    public class AchievementService
    {
        private readonly IAchievementRepository _achievementRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPetRepository _petRepository;
        private readonly IUserHabitRepository _userHabitRepository;
        private readonly XpService _xpService;

        public AchievementService(
            IAchievementRepository achievementRepository,
            IUserRepository userRepository,
            IPetRepository petRepository,
            IUserHabitRepository userHabitRepository,
            XpService xpService)
        {
            _achievementRepository = achievementRepository;
            _userRepository = userRepository;
            _petRepository = petRepository;
            _userHabitRepository = userHabitRepository;
            _xpService = xpService;
        }

        public async Task<IEnumerable<Achievement>> GetAllAchievementsAsync()
        {
            return await _achievementRepository.GetAllAsync();
        }

        public async Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(int userId)
        {
            return await _achievementRepository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<AchievementDto>> GetUserAchievementsWithProgressAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Stats == null) return Enumerable.Empty<AchievementDto>();

            var pets = await _petRepository.GetByUserIdAsync(userId);
            var userHabits = await _userHabitRepository.GetByUserIdAsync(userId);

            int totalHabitsDone = user.Stats.TotalHabitsDone;
            int currentLevel = user.Stats.CurrentLevel;
            int totalDaysActive = user.Stats.TotalDaysActive;
            int totalXpEarned = user.Stats.TotalXpEarned;

            int totalTimesFed = 0;
            int totalTimesPlayed = 0;
            int careScore = 100;

            if (pets != null)
            {
                totalTimesFed = pets.PetActions.Count(pa => pa.ActionType == PetActionType.Feed);
                totalTimesPlayed = pets.PetActions.Count(pa => pa.ActionType == PetActionType.Play);
                careScore = Math.Min(100, Math.Max(0, (int)Math.Round(pets.Health * 0.8 + pets.Happiness * 0.2)));
            }

            int totalHabitsMastered = userHabits.Count(uh => uh.IsMastered == true);
            int avoidHabitsDone = userHabits
                .Where(uh => uh.Habit != null && !uh.Habit.IsPositive)
                .Sum(uh => uh.History.Count(h => h.HabitStatus == HabitStatus.Done));

            var allAchievements = await _achievementRepository.GetAllAsync();
            var unlocked = await _achievementRepository.GetByUserIdAsync(userId);
            var unlockedMap = unlocked.ToDictionary(u => u.AchievementId, u => u.UnlockedAt);

            return allAchievements.Select(a =>
            {
                bool isUnlocked = unlockedMap.ContainsKey(a.AchievementId);
                int progress = GetProgressValue(a.TypeCondition, totalHabitsDone, currentLevel, totalDaysActive, totalXpEarned, totalTimesFed, totalTimesPlayed, careScore, totalHabitsMastered, avoidHabitsDone);

                return new AchievementDto
                {
                    AchievementId = a.AchievementId,
                    Title = a.Title,
                    Description = a.Description,
                    Category = a.Category,
                    Rarity = a.Rarity,
                    Icon = a.Icon,
                    XpReward = a.XpReward,
                    ValueCondition = a.ValueCondition,
                    IsUnlocked = isUnlocked,
                    UnlockedAt = isUnlocked ? unlockedMap[a.AchievementId] : (DateTime?)null,
                    CurrentProgress = Math.Min(a.ValueCondition, progress)
                };
            }).ToList();
        }

        public async Task CheckAndUnlockAllAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Stats == null) return;

            var pets = await _petRepository.GetByUserIdAsync(userId);
            var userHabits = await _userHabitRepository.GetByUserIdAsync(userId);

            int totalHabitsDone = user.Stats.TotalHabitsDone;
            int currentLevel = user.Stats.CurrentLevel;
            int totalDaysActive = user.Stats.TotalDaysActive;
            int totalXpEarned = user.Stats.TotalXpEarned;

            int totalTimesFed = 0;
            int totalTimesPlayed = 0;
            int careScore = 100;

            if (pets != null)
            {
                totalTimesFed = pets.PetActions.Count(pa => pa.ActionType == PetActionType.Feed);
                totalTimesPlayed = pets.PetActions.Count(pa => pa.ActionType == PetActionType.Play);
                careScore = Math.Min(100, Math.Max(0, (int)Math.Round(pets.Health * 0.8 + pets.Happiness * 0.2)));
            }

            int totalHabitsMastered = userHabits.Count(uh => uh.IsMastered == true);
            int avoidHabitsDone = userHabits
                .Where(uh => uh.Habit != null && !uh.Habit.IsPositive)
                .Sum(uh => uh.History.Count(h => h.HabitStatus == HabitStatus.Done));

            var all = await _achievementRepository.GetAllAsync();
            var unlocked = await _achievementRepository.GetByUserIdAsync(userId);
            var unlockedIds = unlocked.Select(u => u.AchievementId).ToHashSet();

            foreach (var achievement in all)
            {
                if (unlockedIds.Contains(achievement.AchievementId)) continue;

                int progressValue = GetProgressValue(achievement.TypeCondition, totalHabitsDone, currentLevel, totalDaysActive, totalXpEarned, totalTimesFed, totalTimesPlayed, careScore, totalHabitsMastered, avoidHabitsDone);

                if (progressValue >= achievement.ValueCondition)
                {
                    var userAchievement = new UserAchievement
                    {
                        UserId = userId,
                        AchievementId = achievement.AchievementId,
                        UnlockedAt = DateTime.UtcNow
                    };

                    await _achievementRepository.AddUserAchievementAsync(userAchievement);
                    await _xpService.AddXpAsync(userId, achievement.XpReward, XpReasonType.AchievementUnlocked);
                }
            }
        }

        public async Task CheckAndUnlockAsync(int userId, string conditionType, int currentValue)
        {
            var all = await _achievementRepository.GetAllAsync();
            var unlocked = await _achievementRepository.GetByUserIdAsync(userId);
            var unlockedIds = unlocked.Select(u => u.AchievementId).ToHashSet();

            foreach (var achievement in all)
            {
                if (unlockedIds.Contains(achievement.AchievementId)) continue;
                if (achievement.TypeCondition != conditionType) continue;
                if (currentValue < achievement.ValueCondition) continue;

                var userAchievement = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.AchievementId,
                    UnlockedAt = DateTime.UtcNow
                };

                await _achievementRepository.AddUserAchievementAsync(userAchievement);
                await _xpService.AddXpAsync(userId, achievement.XpReward, XpReasonType.AchievementUnlocked);
            }
        }

        private int GetProgressValue(
            string conditionType,
            int totalHabitsDone,
            int currentLevel,
            int totalDaysActive,
            int totalXpEarned,
            int totalTimesFed,
            int totalTimesPlayed,
            int careScore,
            int totalHabitsMastered,
            int avoidHabitsDone)
        {
            return conditionType switch
            {
                "TotalHabitsDone" => totalHabitsDone,
                "CurrentLevel" => currentLevel,
                "TotalDaysActive" => totalDaysActive,
                "TotalXpEarned" => totalXpEarned,
                "TotalTimesFed" => totalTimesFed,
                "TotalTimesPlayed" => totalTimesPlayed,
                "CareScore" => careScore,
                "TotalHabitsMastered" => totalHabitsMastered,
                "AvoidHabitsDone" => avoidHabitsDone,
                _ => 0
            };
        }
    }
}
