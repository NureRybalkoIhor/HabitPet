using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using HabitPet.Persistence.Context;
using HabitPet.Domain.Entities;
using HabitPet.Domain.Enums;
using HabitPet.Application.Services;

namespace HabitPet.Api.BackgroundServices
{
    public class DailyResetWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DailyResetWorker> _logger;
        private DateOnly _lastProcessedDate = DateOnly.MinValue;

        public DailyResetWorker(IServiceScopeFactory scopeFactory, ILogger<DailyResetWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DailyResetWorker started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                if (today > _lastProcessedDate)
                {
                    try
                    {
                        await RunDailyStreakResetAsync(today);
                        _lastProcessedDate = today;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error executing DailyResetWorker streak reset logic.");
                    }
                }

                try
                {
                    await RunHourlyPetDecayAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error executing Hourly decay logic.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task RunDailyStreakResetAsync(DateOnly today)
        {
            _logger.LogInformation($"Running DailyResetWorker streak reset logic for {today}");

            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<HabitPetDbContext>();

                var yesterday = today.AddDays(-1);
                var yesterdayDayOfWeek = (int)yesterday.DayOfWeek;

                var activeHabits = await dbContext.UserHabits
                    .Include(h => h.History)
                    .Where(h => h.IsActive)
                    .ToListAsync();

                foreach (var habit in activeHabits)
                {
                    bool wasScheduledYesterday = habit.DayMask == 0 || (habit.DayMask & (1 << yesterdayDayOfWeek)) != 0;

                    if (wasScheduledYesterday)
                    {
                        bool completedYesterday = habit.History.Any(h => h.ActionDate == yesterday && h.HabitStatus == HabitStatus.Done);

                        if (!completedYesterday)
                        {
                            var streak = await dbContext.Streaks.FirstOrDefaultAsync(s => s.UserHabitId == habit.UserHabitId);
                            if (streak != null && streak.CurrentStreak > 0)
                            {
                                _logger.LogInformation($"Resetting streak to 0 for habit {habit.UserHabitId} ({habit.Title})");
                                streak.CurrentStreak = 0;
                            }
                        }
                    }
                }

                await dbContext.SaveChangesAsync();
            }
        }

        private async Task RunHourlyPetDecayAsync()
        {
            _logger.LogInformation("Running Hourly Pet Decay logic");

            using (var scope = _scopeFactory.CreateScope())
            {
                var petService = scope.ServiceProvider.GetRequiredService<PetService>();
                var dbContext = scope.ServiceProvider.GetRequiredService<HabitPetDbContext>();

                var pets = await dbContext.Pets.ToListAsync();
                foreach (var pet in pets)
                {
                    var oldHunger = pet.Hunger;
                    var oldHappiness = pet.Happiness;
                    var oldHealth = pet.Health;

                    await petService.CatchUpDecayAsync(pet);

                    if (pet.Hunger != oldHunger || pet.Happiness != oldHappiness || pet.Health != oldHealth)
                    {
                        _logger.LogInformation($"Hourly decay for user {pet.UserId}. Health: {pet.Health}, Hunger: {pet.Hunger}, Happiness: {pet.Happiness}");
                    }
                }
            }
        }
    }
}
