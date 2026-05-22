using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using HabitPet.Domain.Enums;
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
        private readonly XpService _xpService;

        public AchievementService(
            IAchievementRepository achievementRepository,
            IUserRepository userRepository,
            XpService xpService)
        {
            _achievementRepository = achievementRepository;
            _userRepository = userRepository;
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
    }
}
