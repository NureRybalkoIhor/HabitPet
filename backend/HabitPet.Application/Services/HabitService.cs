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
        private readonly IHabitRepository _habitRepository;

        public HabitService(
            IUserHabitRepository userHabitRepository,
            IStreakRepository streakRepository,
            XpService xpService,
            StreakService streakService,
            IHabitRepository habitRepository)
        {
            _userHabitRepository = userHabitRepository;
            _streakRepository = streakRepository;
            _xpService = xpService;
            _streakService = streakService;
            _habitRepository = habitRepository;
        }

        public async Task<IEnumerable<UserHabit>> GetUserHabitsAsync(int userId)
        {
            return await _userHabitRepository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Habit>> GetTemplatesAsync()
        {
            return await _habitRepository.GetAllAsync();
        }

        public async Task AddHabitAsync(UserHabit userHabit)
        {
            userHabit.CreatedAt = DateTime.UtcNow;
            userHabit.IsActive = true;
            await _userHabitRepository.AddAsync(userHabit);
        }

        public async Task UpdateHabitAsync(UserHabit userHabit)
        {
            var existing = await _userHabitRepository.GetByIdAsync(userHabit.UserHabitId);
            if (existing == null) return;

            existing.Title = userHabit.Title;
            existing.Description = userHabit.Description;
            existing.IsPositive = userHabit.IsPositive;
            existing.Difficulty = userHabit.Difficulty;
            existing.Priority = userHabit.Priority;
            existing.DayMask = userHabit.DayMask;
            existing.HourMask = userHabit.HourMask;
            existing.ReminderTime = userHabit.ReminderTime;
            existing.IsActive = userHabit.IsActive;

            await _userHabitRepository.UpdateAsync(existing);
        }

        public async Task DeleteHabitAsync(int id)
        {
            await _userHabitRepository.DeleteAsync(id);
        }

        public async Task CompleteHabitAsync(int userHabitId, int userId, string? note = null)
        {
            var habit = await _userHabitRepository.GetByIdAsync(userHabitId);
            if (habit == null) return;

            var streak = await _streakRepository.GetByUserHabitIdAsync(userHabitId);
            int currentStreak = streak?.CurrentStreak ?? 0;

            int xp = _xpService.CalculateXp(habit.Difficulty, habit.DayMask, currentStreak);

            await _streakService.UpdateStreakAsync(userHabitId);
            await _xpService.AddXpAsync(userId, xp, XpReasonType.HabitDone, userHabitId);

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (!habit.History.Any(h => h.ActionDate == today && h.HabitStatus == HabitStatus.Done))
            {
                habit.History.Add(new HabitHistory
                {
                    ActionDate = today,
                    HabitStatus = HabitStatus.Done,
                    MarkedAt = DateTime.UtcNow,
                    UserNote = note
                });
                await _userHabitRepository.UpdateAsync(habit);
            }
        }

        public async Task MasterHabitAsync(int userHabitId, int userId)
        {
            var habit = await _userHabitRepository.GetByIdAsync(userHabitId);
            if (habit == null) return;

            habit.IsMastered = true;
            habit.IsActive = false;

            await _userHabitRepository.UpdateAsync(habit);
            await _xpService.AddXpAsync(userId, 500, XpReasonType.ChallengeCompleted, userHabitId);
        }
    }
}
