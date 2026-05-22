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
    public class HabitService
    {
        private readonly IUserHabitRepository _userHabitRepository;
        private readonly IStreakRepository _streakRepository;
        private readonly XpService _xpService;
        private readonly StreakService _streakService;

        public HabitService(
            IUserHabitRepository userHabitRepository,
            IStreakRepository streakRepository,
            XpService xpService,
            StreakService streakService)
        {
            _userHabitRepository = userHabitRepository;
            _streakRepository = streakRepository;
            _xpService = xpService;
            _streakService = streakService;
        }

        public async Task<IEnumerable<UserHabit>> GetUserHabitsAsync(int userId)
        {
            return await _userHabitRepository.GetByUserIdAsync(userId);
        }

        public async Task AddHabitAsync(UserHabit userHabit)
        {
            userHabit.CreatedAt = DateTime.UtcNow;
            userHabit.IsActive = true;
            await _userHabitRepository.AddAsync(userHabit);
        }

        public async Task UpdateHabitAsync(UserHabit userHabit)
        {
            await _userHabitRepository.UpdateAsync(userHabit);
        }

        public async Task DeleteHabitAsync(int id)
        {
            var habit = await _userHabitRepository.GetByIdAsync(id);
            if (habit != null)
            {
                habit.IsActive = false;
                await _userHabitRepository.UpdateAsync(habit);
            }
        }

        public async Task CompleteHabitAsync(int userHabitId, int userId)
        {
            var habit = await _userHabitRepository.GetByIdAsync(userHabitId);
            if (habit == null) return;

            var streak = await _streakRepository.GetByUserHabitIdAsync(userHabitId);
            int currentStreak = streak?.CurrentStreak ?? 0;

            int xp = _xpService.CalculateXp(habit.Difficulty, habit.DayMask, currentStreak);

            await _streakService.UpdateStreakAsync(userHabitId);
            await _xpService.AddXpAsync(userId, xp, XpReasonType.HabitDone, userHabitId);
        }
    }
}
