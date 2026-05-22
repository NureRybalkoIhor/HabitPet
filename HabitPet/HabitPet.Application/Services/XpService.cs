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
    public class XpService
    {
        private readonly IXpTransactionRepository _xpRepository;
        private readonly IUserRepository _userRepository;

        public XpService(IXpTransactionRepository xpRepository, IUserRepository userRepository)
        {
            _xpRepository = xpRepository;
            _userRepository = userRepository;
        }

        public int CalculateXp(int difficulty, int dayMask, int currentStreak)
        {
            double kd = difficulty / 5.0;
            double kf = CountBits(dayMask) / 7.0;
            double xpBase = 100 * kd * kf;
            int xpEarned = (int)Math.Floor(xpBase * (1 + 0.05 * currentStreak));
            return xpEarned;
        }

        public async Task AddXpAsync(int userId, int amount, XpReasonType reason, int? userHabitId = null)
        {
            var transaction = new XpTransaction
            {
                UserId = userId,
                XpAmount = amount,
                TypeReason = reason,
                CreatedAt = DateTime.UtcNow,
                UserHabitId = userHabitId
            };

            await _xpRepository.AddAsync(transaction);

            var user = await _userRepository.GetByIdAsync(userId);
            if (user?.Stats != null)
            {
                user.Stats.CurrentXp += amount;
                user.Stats.TotalXpEarned += amount;
                UpdateLevel(user.Stats);
                await _userRepository.UpdateAsync(user);
            }
        }

        private void UpdateLevel(UserStats stats)
        {
            int level = (int)Math.Floor(0.1 * Math.Sqrt(stats.TotalXpEarned)) + 1;
            stats.CurrentLevel = level;
            stats.XpToNextLevel = (int)Math.Pow((level) * 10, 2) - stats.TotalXpEarned;
        }

        private int CountBits(int mask)
        {
            int count = 0;
            while (mask > 0)
            {
                count += mask & 1;
                mask >>= 1;
            }
            return count;
        }
    }
}
