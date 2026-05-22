using HabitPet.Application.Interfaces;
using HabitPet.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HabitPet.Application.Services
{
    public class StreakService
    {
        private readonly IStreakRepository _streakRepository;

        public StreakService(IStreakRepository streakRepository)
        {
            _streakRepository = streakRepository;
        }

        public async Task UpdateStreakAsync(int userHabitId)
        {
            var streak = await _streakRepository.GetByUserHabitIdAsync(userHabitId);

            if (streak == null)
            {
                streak = new Streak
                {
                    UserHabitId = userHabitId,
                    CurrentStreak = 1,
                    LongestStreak = 1,
                    LastCompletedDate = DateOnly.FromDateTime(DateTime.UtcNow)
                };
                await _streakRepository.AddAsync(streak);
                return;
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var yesterday = today.AddDays(-1);

            if (streak.LastCompletedDate == yesterday)
            {
                streak.CurrentStreak++;
                if (streak.CurrentStreak > streak.LongestStreak)
                    streak.LongestStreak = streak.CurrentStreak;
            }
            else if (streak.LastCompletedDate != today)
            {
                streak.CurrentStreak = 1;
            }

            streak.LastCompletedDate = today;
            await _streakRepository.UpdateAsync(streak);
        }

        public async Task ResetStreakAsync(int userHabitId)
        {
            var streak = await _streakRepository.GetByUserHabitIdAsync(userHabitId);
            if (streak != null)
            {
                streak.CurrentStreak = 0;
                await _streakRepository.UpdateAsync(streak);
            }
        }
    }
}
